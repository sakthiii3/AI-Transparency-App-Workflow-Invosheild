import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Consent, DataUsageRecord, AIDecision, Notification } from '../types';
import { mockServices } from '../utils/mockData';
import { Shield, Activity, Lightbulb, AlertCircle, CheckCircle2, XCircle, Clock, Database } from 'lucide-react';
import { formatDistanceToNow, differenceInHours } from 'date-fns';

interface DashboardProps {
  consents: Consent[];
  dataUsage: DataUsageRecord[];
  decisions: AIDecision[];
  notifications: Notification[];
  onNavigate: (tab: string) => void;
  onRevokeConsent?: (consentId: string) => void;
}

export function Dashboard({ consents, dataUsage, decisions, notifications, onNavigate, onRevokeConsent }: DashboardProps) {
  const activeConsents = consents.filter(c => c.status === 'active');
  
  const getServiceById = (id: string) => mockServices.find(s => s.id === id);
  
  const getConsentStatus = (consent: Consent) => {
    const now = new Date();
    const expiresAt = new Date(consent.expiresAt);
    const hoursRemaining = differenceInHours(expiresAt, now);
    
    if (hoursRemaining < 24) return { label: 'Expiring Soon', color: 'bg-warning', icon: AlertCircle };
    if (hoursRemaining < 72) return { label: 'Active', color: 'bg-warning/70', icon: CheckCircle2 };
    return { label: 'Active', color: 'bg-success', icon: CheckCircle2 };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-foreground">Service Control Dashboard</h1>
          <p className="text-muted-foreground">
            Manage AI service access and monitor data usage
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Services</p>
                <p className="text-3xl text-foreground">{activeConsents.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data Access Events</p>
                <p className="text-3xl text-foreground">{dataUsage.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">AI Decisions</p>
                <p className="text-3xl text-foreground">{decisions.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Unread Alerts</p>
                <p className="text-3xl text-foreground">{notifications.filter(n => !n.read).length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground">Active AI Services</h2>
          <Button variant="outline" onClick={() => onNavigate('consents')} className="border-primary/30 text-primary hover:bg-primary/10">
            Manage All Services
          </Button>
        </div>
        
        <div className="grid gap-4">
          {activeConsents.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="pt-6 text-center py-12">
                <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">No active services</p>
                <Button onClick={() => onNavigate('consents')} className="bg-primary hover:bg-primary/90">
                  Grant Service Access
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeConsents.map((consent) => {
              const service = getServiceById(consent.serviceId);
              const status = getConsentStatus(consent);
              const StatusIcon = status.icon;
              
              if (!service) return null;

              return (
                <Card key={consent.id} className="bg-card border-border/50 hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <CardTitle className="text-xl text-foreground">{service.name}</CardTitle>
                          <Badge className={`${status.color} border-0 text-white px-3`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label} - Expires {formatDistanceToNow(new Date(consent.expiresAt), { addSuffix: true })}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Data Access Summary */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                      <p className="text-sm text-muted-foreground mb-2">Data Access Permitted:</p>
                      <div className="flex flex-wrap gap-2">
                        {consent.dataTypes.map((dataType) => (
                          <Badge key={dataType} variant="outline" className="border-primary/30 text-foreground bg-primary/5">
                            {dataType}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Purpose Summary */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                      <p className="text-sm text-muted-foreground mb-1">Purpose:</p>
                      <p className="text-sm text-foreground">{consent.purpose}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="destructive" 
                        onClick={() => onRevokeConsent?.(consent.id)}
                        className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Revoke Access
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => onNavigate('consents')}
                        className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Manage Permissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => onNavigate('usage')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Recent Data Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {dataUsage.length} total access events recorded
            </p>
            <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
              View Full Activity Log →
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => onNavigate('explanations')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="w-5 h-5 text-primary" />
              AI Explanations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {decisions.length} AI decisions with detailed explanations
            </p>
            <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
              View Explanations →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}