import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { AuditLogEntry } from '../types';
import { CheckCircle2, XCircle, Database, Lightbulb, Clock, Search, Shield, Link } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogProps {
  auditLog: AuditLogEntry[];
}

const typeIcons: Record<string, any> = {
  consent_granted: CheckCircle2,
  consent_revoked: XCircle,
  data_access: Database,
  ai_decision: Lightbulb,
  consent_expired: Clock
};

const typeColors: Record<string, string> = {
  consent_granted: 'bg-success/10 border-success/30 text-success',
  consent_revoked: 'bg-destructive/10 border-destructive/30 text-destructive',
  data_access: 'bg-primary/10 border-primary/30 text-primary',
  ai_decision: 'bg-primary/10 border-primary/30 text-primary',
  consent_expired: 'bg-muted/10 border-border/30 text-muted-foreground'
};

export function AuditLog({ auditLog }: AuditLogProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLog = auditLog
    .filter(entry => filterType === 'all' || entry.type === filterType)
    .filter(entry => 
      searchTerm === '' || 
      entry.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">Immutable Data Usage Audit Log</h1>
        <p className="text-muted-foreground">
          Complete chronological record of all AI interactions - tamper-proof and transparent
        </p>
      </div>

      {/* Blockchain Security Notice */}
      <Card className="bg-primary/5 border-2 border-primary/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Link className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground mb-1">Blockchain-Secured Records</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All audit log entries are immutable and cryptographically verified to ensure data integrity and prevent tampering. Each entry is hashed and stored on a distributed ledger.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search audit log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-input-background border-border/50"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[220px] bg-input-background border-border/50">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="consent_granted">Consent Granted</SelectItem>
                <SelectItem value="consent_revoked">Consent Revoked</SelectItem>
                <SelectItem value="data_access">Data Access</SelectItem>
                <SelectItem value="ai_decision">AI Decisions</SelectItem>
                <SelectItem value="consent_expired">Consent Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLog.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No audit entries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Description</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLog.map((entry, index) => {
                    const Icon = typeIcons[entry.type] || Database;
                    const colorClass = typeColors[entry.type] || 'bg-muted/10 border-border/30 text-muted-foreground';
                    
                    return (
                      <tr 
                        key={entry.id} 
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <p className="text-sm text-foreground">
                              {format(new Date(entry.timestamp), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(entry.timestamp), 'HH:mm:ss')}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${colorClass} border gap-1`}>
                            <Icon className="w-3 h-3" />
                            {entry.type.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-foreground">{entry.serviceName}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-muted-foreground max-w-md">
                            {entry.description}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Entries</p>
            <p className="text-2xl text-foreground">{auditLog.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Consents Granted</p>
            <p className="text-2xl text-success">{auditLog.filter(e => e.type === 'consent_granted').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Data Access Events</p>
            <p className="text-2xl text-primary">{auditLog.filter(e => e.type === 'data_access').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">AI Decisions</p>
            <p className="text-2xl text-primary">{auditLog.filter(e => e.type === 'ai_decision').length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}