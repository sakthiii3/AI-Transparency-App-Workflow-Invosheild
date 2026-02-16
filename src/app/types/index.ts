export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AIService {
  id: string;
  name: string;
  description: string;
  icon: string;
  dataTypes: string[];
  purpose: string;
  provider: string;
}

export interface ConsentRequest {
  serviceId: string;
  dataTypes: string[];
  purpose: string;
  requestedDuration: number; // in hours
}

export interface Consent {
  id: string;
  userId: string;
  serviceId: string;
  dataTypes: string[];
  purpose: string;
  status: 'active' | 'expired' | 'revoked';
  grantedAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface DataUsageRecord {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  dataType: string;
  modelName: string;
  purpose: 'training' | 'inference';
  timestamp: string;
  metadataHash?: string;
}

export interface AIDecision {
  id: string;
  serviceId: string;
  serviceName: string;
  result: string;
  explanation: {
    dataUsed: string[];
    dataNotUsed: string[];
    reasoning: string;
    featureInfluence: { feature: string; impact: number }[];
  };
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  type: 'consent_granted' | 'consent_revoked' | 'data_access' | 'ai_decision' | 'consent_expired';
  serviceId: string;
  serviceName: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface Notification {
  id: string;
  type: 'consent_request' | 'consent_expiring' | 'unusual_activity' | 'data_access';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  serviceId?: string;
}
