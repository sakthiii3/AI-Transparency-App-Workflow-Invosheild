import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Consent, AIService } from '../types';
import { mockServices } from '../utils/mockData';
import { 
  Shield, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  Heart,
  MessageSquare,
  DollarSign,
  GraduationCap 
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ConsentManagerProps {
  consents: Consent[];
  onGrantConsent: (serviceId: string, duration: number) => void;
  onRevokeConsent: (consentId: string) => void;
  onExtendConsent: (consentId: string, duration: number) => void;
}

const iconMap: Record<string, any> = {
  Sparkles,
  Heart,
  MessageSquare,
  DollarSign,
  GraduationCap
};

export function ConsentManager({ consents, onGrantConsent, onRevokeConsent, onExtendConsent }: ConsentManagerProps) {
  const [selectedDurations, setSelectedDurations] = useState<Record<string, number>>({});

  const getServiceById = (id: string) => mockServices.find(s => s.id === id);

  const getConsentByServiceId = (serviceId: string) => 
    consents.find(c => c.serviceId === serviceId && c.status === 'active');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'expired': return 'bg-gray-500';
      case 'revoked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      case 'revoked': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const isExpiringSoon = (consent: Consent) => {
    const expiresAt = new Date(consent.expiresAt);
    const now = new Date();
    const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilExpiry < 24 && hoursUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">Consent Manager</h1>
        <p className="text-muted-foreground">
          Manage which AI services can access your data and for how long
        </p>
      </div>

      <div className="grid gap-4">
        {mockServices.map((service) => {
          const consent = getConsentByServiceId(service.id);
          const Icon = iconMap[service.icon] || Shield;

          return (
            <Card key={service.id} className="bg-card border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground mb-2">{service.name}</CardTitle>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-2">
                        Provider: {service.provider}
                      </p>
                    </div>
                  </div>
                  {consent && (
                    <Badge 
                      variant={consent.status === 'active' ? 'default' : 'secondary'} 
                      className={`gap-1 ${consent.status === 'active' ? 'bg-success text-white' : ''}`}
                    >
                      {getStatusIcon(consent.status)}
                      {consent.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm mb-2 text-muted-foreground">Data Access Requested:</p>
                  <div className="flex flex-wrap gap-2">
                    {service.dataTypes.map((dataType) => (
                      <Badge key={dataType} variant="outline" className="border-primary/30 text-foreground bg-primary/5">
                        {dataType}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Purpose:</span>{' '}
                    <span className="text-foreground">{service.purpose}</span>
                  </p>
                </div>

                {consent ? (
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Granted:</span>
                        <span className="text-foreground">{format(new Date(consent.grantedAt), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className={`${isExpiringSoon(consent) ? 'text-warning' : 'text-foreground'}`}>
                          {formatDistanceToNow(new Date(consent.expiresAt), { addSuffix: true })}
                          {isExpiringSoon(consent) && <AlertCircle className="inline w-3 h-3 ml-1" />}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Select
                        value={selectedDurations[service.id]?.toString() || '168'}
                        onValueChange={(value) => 
                          setSelectedDurations({ ...selectedDurations, [service.id]: parseInt(value) })
                        }
                      >
                        <SelectTrigger className="flex-1 bg-input-background border-border/50">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="168">7 days</SelectItem>
                          <SelectItem value="720">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        onClick={() => onExtendConsent(consent.id, selectedDurations[service.id] || 168)}
                        className="border-primary/30 text-primary hover:bg-primary/10"
                      >
                        Extend
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onRevokeConsent(consent.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Select
                        value={selectedDurations[service.id]?.toString() || '168'}
                        onValueChange={(value) => 
                          setSelectedDurations({ ...selectedDurations, [service.id]: parseInt(value) })
                        }
                      >
                        <SelectTrigger className="flex-1 bg-input-background border-border/50">
                          <SelectValue placeholder="Access Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="168">7 days</SelectItem>
                          <SelectItem value="720">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => onGrantConsent(service.id, selectedDurations[service.id] || 168)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Grant Access
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}