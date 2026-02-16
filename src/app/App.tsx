import { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { ConsentManager } from './components/ConsentManager';
import { DataUsageDashboard } from './components/DataUsageDashboard';
import { AIExplanations } from './components/AIExplanations';
import { AuditLog } from './components/AuditLog';
import { NotificationsPanel } from './components/NotificationsPanel';
import { DemoMode } from './components/DemoMode';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  User, 
  Consent, 
  DataUsageRecord, 
  AIDecision, 
  AuditLogEntry, 
  Notification 
} from './types';
import {
  generateMockConsents,
  generateMockDataUsage,
  generateMockAIDecisions,
  generateMockAuditLog,
  generateMockNotifications,
  mockServices
} from './utils/mockData';
import { 
  LayoutDashboard, 
  Shield, 
  Activity, 
  Lightbulb, 
  FileText, 
  Bell, 
  PlayCircle,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [consents, setConsents] = useState<Consent[]>([]);
  const [dataUsage, setDataUsage] = useState<DataUsageRecord[]>([]);
  const [aiDecisions, setAIDecisions] = useState<AIDecision[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [demoStep, setDemoStep] = useState(0);

  // Initialize data when user logs in
  useEffect(() => {
    if (user) {
      setConsents(generateMockConsents(user.id));
      setDataUsage(generateMockDataUsage(user.id));
      setAIDecisions(generateMockAIDecisions());
      setAuditLog(generateMockAuditLog(user.id));
      setNotifications(generateMockNotifications());
    }
  }, [user]);

  const handleLogin = (name: string, email: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    toast.success('Welcome! Your secure account has been created.');
  };

  const handleLogout = () => {
    setUser(null);
    setConsents([]);
    setDataUsage([]);
    setAIDecisions([]);
    setAuditLog([]);
    setNotifications([]);
    setDemoStep(0);
    setActiveTab('dashboard');
    toast.info('You have been logged out');
  };

  const handleGrantConsent = (serviceId: string, duration: number) => {
    if (!user) return;

    const service = mockServices.find(s => s.id === serviceId);
    if (!service) return;

    const now = new Date();
    const newConsent: Consent = {
      id: `consent-${Date.now()}`,
      userId: user.id,
      serviceId,
      dataTypes: service.dataTypes,
      purpose: service.purpose,
      status: 'active',
      grantedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + duration * 60 * 60 * 1000).toISOString()
    };

    setConsents([...consents, newConsent]);

    const auditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      type: 'consent_granted',
      serviceId,
      serviceName: service.name,
      description: `Granted consent for ${duration} hours to access ${service.dataTypes.join(', ')}`,
      timestamp: now.toISOString()
    };
    setAuditLog([auditEntry, ...auditLog]);

    toast.success(`Consent granted to ${service.name}`, {
      description: `Access will expire in ${duration} hours`
    });
  };

  const handleRevokeConsent = (consentId: string) => {
    const consent = consents.find(c => c.id === consentId);
    if (!consent) return;

    const service = mockServices.find(s => s.id === consent.serviceId);
    
    setConsents(consents.map(c => 
      c.id === consentId 
        ? { ...c, status: 'revoked' as const, revokedAt: new Date().toISOString() }
        : c
    ));

    const auditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      type: 'consent_revoked',
      serviceId: consent.serviceId,
      serviceName: service?.name || 'Unknown Service',
      description: `Consent revoked for ${consent.dataTypes.join(', ')}`,
      timestamp: new Date().toISOString()
    };
    setAuditLog([auditEntry, ...auditLog]);

    toast.success('Consent revoked', {
      description: 'The service can no longer access your data'
    });
  };

  const handleExtendConsent = (consentId: string, duration: number) => {
    const consent = consents.find(c => c.id === consentId);
    if (!consent) return;

    const service = mockServices.find(s => s.id === consent.serviceId);
    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + duration * 60 * 60 * 1000);

    setConsents(consents.map(c =>
      c.id === consentId
        ? { ...c, expiresAt: newExpiresAt.toISOString() }
        : c
    ));

    const auditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      type: 'consent_granted',
      serviceId: consent.serviceId,
      serviceName: service?.name || 'Unknown Service',
      description: `Extended consent for ${duration} hours`,
      timestamp: now.toISOString()
    };
    setAuditLog([auditEntry, ...auditLog]);

    toast.success('Consent extended', {
      description: `Access extended for ${duration} hours`
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleRunDemo = () => {
    const nextStep = demoStep + 1;
    setDemoStep(nextStep);

    switch (nextStep) {
      case 1:
        toast.success('Demo Step 1: User logged in successfully');
        break;
      case 2:
        setActiveTab('consents');
        toast.info('Demo Step 2: Navigate to Consent Manager');
        setTimeout(() => {
          handleGrantConsent('svc-1', 168);
        }, 1000);
        break;
      case 3:
        setActiveTab('usage');
        toast.info('Demo Step 3: AI service accessing data...');
        break;
      case 4:
        setActiveTab('explanations');
        toast.info('Demo Step 4: View AI explanations');
        break;
      case 5:
        setActiveTab('consents');
        toast.info('Demo Step 5: Ready to revoke consent');
        break;
      case 6:
        setActiveTab('audit');
        toast.success('Demo Step 6: Complete audit trail shown');
        break;
      default:
        setDemoStep(0);
        setActiveTab('demo');
        toast.success('Demo completed! Ready to run again.');
    }
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background flex">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 border-2 border-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-sidebar-foreground">AI Control</h2>
              <p className="text-xs text-muted-foreground">Data Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('consents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'consents'
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Consent Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('usage')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'usage'
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Data Usage</span>
          </button>

          <button
            onClick={() => setActiveTab('explanations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'explanations'
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            <span>AI Explanations</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'audit'
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Audit Log</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
              activeTab === 'notifications'
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1.5 text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'demo'
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <PlayCircle className="w-5 h-5" />
            <span>Demo Mode</span>
          </button>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 bg-sidebar-accent rounded-lg mb-2">
            <UserIcon className="w-5 h-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            className="w-full border-sidebar-border hover:bg-sidebar-accent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl text-foreground">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'consents' && 'Consent Manager'}
                  {activeTab === 'usage' && 'Data Usage'}
                  {activeTab === 'explanations' && 'AI Explanations'}
                  {activeTab === 'audit' && 'Audit Log'}
                  {activeTab === 'notifications' && 'Notifications'}
                  {activeTab === 'demo' && 'Demo Mode'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Transparency. Accountability. Control.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-8 py-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              consents={consents}
              dataUsage={dataUsage}
              decisions={aiDecisions}
              notifications={notifications}
              onNavigate={setActiveTab}
              onRevokeConsent={handleRevokeConsent}
            />
          )}

          {activeTab === 'consents' && (
            <ConsentManager
              consents={consents}
              onGrantConsent={handleGrantConsent}
              onRevokeConsent={handleRevokeConsent}
              onExtendConsent={handleExtendConsent}
            />
          )}

          {activeTab === 'usage' && (
            <DataUsageDashboard dataUsage={dataUsage} />
          )}

          {activeTab === 'explanations' && (
            <AIExplanations decisions={aiDecisions} />
          )}

          {activeTab === 'audit' && (
            <AuditLog auditLog={auditLog} />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPanel
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}

          {activeTab === 'demo' && (
            <DemoMode onRunDemo={handleRunDemo} demoStep={demoStep} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-card/30 border-t border-border/50 mt-12">
          <div className="px-8 py-6">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Making AI <span className="text-primary">transparent</span>, <span className="text-primary">accountable</span>, and <span className="text-primary">user-controlled</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}