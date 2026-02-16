import { AIService, Consent, DataUsageRecord, AIDecision, AuditLogEntry, Notification } from '../types';

export const mockServices: AIService[] = [
  {
    id: 'svc-1',
    name: 'Smart Recommendations',
    description: 'Personalized content recommendations based on your preferences',
    icon: 'Sparkles',
    dataTypes: ['Search History', 'Browsing Patterns', 'Preferences'],
    purpose: 'Generate personalized content recommendations',
    provider: 'ContentAI Inc.'
  },
  {
    id: 'svc-2',
    name: 'Health Insights',
    description: 'AI-powered health analytics and wellness suggestions',
    icon: 'Heart',
    dataTypes: ['Activity Data', 'Health Metrics', 'Sleep Patterns'],
    purpose: 'Provide health insights and wellness recommendations',
    provider: 'HealthTech AI'
  },
  {
    id: 'svc-3',
    name: 'Smart Assistant',
    description: 'Intelligent virtual assistant for daily tasks',
    icon: 'MessageSquare',
    dataTypes: ['Calendar Events', 'Email Content', 'Location Data'],
    purpose: 'Assist with scheduling and task management',
    provider: 'AssistAI Corp'
  },
  {
    id: 'svc-4',
    name: 'Finance Advisor',
    description: 'AI-driven financial planning and budgeting',
    icon: 'DollarSign',
    dataTypes: ['Transaction History', 'Spending Patterns', 'Income Data'],
    purpose: 'Provide financial insights and budgeting advice',
    provider: 'FinanceAI'
  },
  {
    id: 'svc-5',
    name: 'Learning Companion',
    description: 'Adaptive learning and educational content curation',
    icon: 'GraduationCap',
    dataTypes: ['Learning History', 'Quiz Results', 'Study Time'],
    purpose: 'Personalize learning paths and content',
    provider: 'EduAI Systems'
  }
];

export const generateMockConsents = (userId: string): Consent[] => {
  const now = new Date();
  return [
    {
      id: 'consent-1',
      userId,
      serviceId: 'svc-1',
      dataTypes: ['Search History', 'Browsing Patterns'],
      purpose: 'Generate personalized content recommendations',
      status: 'active',
      grantedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'consent-2',
      userId,
      serviceId: 'svc-2',
      dataTypes: ['Activity Data', 'Health Metrics'],
      purpose: 'Provide health insights and wellness recommendations',
      status: 'active',
      grantedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now.getTime() + 23 * 60 * 60 * 1000).toISOString() // Expires in 23 hours
    }
  ];
};

export const generateMockDataUsage = (userId: string): DataUsageRecord[] => {
  const now = new Date();
  return [
    {
      id: 'usage-1',
      userId,
      serviceId: 'svc-1',
      serviceName: 'Smart Recommendations',
      dataType: 'Search History',
      modelName: 'RecommendNet-v3',
      purpose: 'inference',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      metadataHash: 'a3f5d9c2e1b4...'
    },
    {
      id: 'usage-2',
      userId,
      serviceId: 'svc-1',
      serviceName: 'Smart Recommendations',
      dataType: 'Browsing Patterns',
      modelName: 'RecommendNet-v3',
      purpose: 'inference',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      metadataHash: 'b7e2f1d8c4a9...'
    },
    {
      id: 'usage-3',
      userId,
      serviceId: 'svc-2',
      serviceName: 'Health Insights',
      dataType: 'Activity Data',
      modelName: 'HealthAnalyzer-2.1',
      purpose: 'inference',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      metadataHash: 'c9d4e6f2b1a8...'
    },
    {
      id: 'usage-4',
      userId,
      serviceId: 'svc-2',
      serviceName: 'Health Insights',
      dataType: 'Health Metrics',
      modelName: 'HealthAnalyzer-2.1',
      purpose: 'training',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      metadataHash: 'd2a7f9e3c5b1...'
    }
  ];
};

export const generateMockAIDecisions = (): AIDecision[] => {
  const now = new Date();
  return [
    {
      id: 'decision-1',
      serviceId: 'svc-1',
      serviceName: 'Smart Recommendations',
      result: 'Recommended 5 articles on sustainable technology and 3 videos on AI ethics',
      explanation: {
        dataUsed: ['Recent searches for "AI ethics"', 'Browsing history on tech blogs', 'Previous engagement with sustainability content'],
        dataNotUsed: ['Location data', 'Device information', 'Contact list'],
        reasoning: 'Your recent searches and browsing patterns show strong interest in AI ethics and sustainability. We matched content from similar users with these interests.',
        featureInfluence: [
          { feature: 'Recent searches', impact: 45 },
          { feature: 'Browsing history', impact: 35 },
          { feature: 'Previous engagement', impact: 20 }
        ]
      },
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'decision-2',
      serviceId: 'svc-2',
      serviceName: 'Health Insights',
      result: 'Suggested increasing daily water intake and adding 15 minutes of morning stretching',
      explanation: {
        dataUsed: ['Activity patterns (7-day average)', 'Sleep quality scores', 'Daily hydration logs'],
        dataNotUsed: ['Heart rate variability', 'Meal photos', 'Social media activity'],
        reasoning: 'Your activity data shows peak performance after morning hydration. Sleep quality improved 18% on days with morning stretching routines.',
        featureInfluence: [
          { feature: 'Hydration correlation', impact: 50 },
          { feature: 'Sleep quality', impact: 30 },
          { feature: 'Morning activity', impact: 20 }
        ]
      },
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    }
  ];
};

export const generateMockAuditLog = (userId: string): AuditLogEntry[] => {
  const now = new Date();
  return [
    {
      id: 'audit-1',
      type: 'consent_granted',
      serviceId: 'svc-1',
      serviceName: 'Smart Recommendations',
      description: 'Granted consent for 7 days to access Search History and Browsing Patterns',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'audit-2',
      type: 'data_access',
      serviceId: 'svc-1',
      serviceName: 'Smart Recommendations',
      description: 'Accessed Search History for inference using RecommendNet-v3',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString()
    },
    {
      id: 'audit-3',
      type: 'ai_decision',
      serviceId: 'svc-1',
      serviceName: 'Smart Recommendations',
      description: 'Generated content recommendations',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'audit-4',
      type: 'consent_granted',
      serviceId: 'svc-2',
      serviceName: 'Health Insights',
      description: 'Granted consent for 24 hours to access Activity Data and Health Metrics',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'audit-5',
      type: 'data_access',
      serviceId: 'svc-2',
      serviceName: 'Health Insights',
      description: 'Accessed Activity Data for inference using HealthAnalyzer-2.1',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    }
  ];
};

export const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: 'notif-1',
      type: 'consent_expiring',
      title: 'Consent Expiring Soon',
      message: 'Your consent for Health Insights will expire in 23 hours',
      timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      read: false,
      serviceId: 'svc-2'
    },
    {
      id: 'notif-2',
      type: 'data_access',
      title: 'Data Accessed',
      message: 'Smart Recommendations accessed your Search History',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      read: false,
      serviceId: 'svc-1'
    },
    {
      id: 'notif-3',
      type: 'consent_request',
      title: 'New Consent Request',
      message: 'Finance Advisor is requesting access to your Transaction History',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      read: true,
      serviceId: 'svc-4'
    }
  ];
};
