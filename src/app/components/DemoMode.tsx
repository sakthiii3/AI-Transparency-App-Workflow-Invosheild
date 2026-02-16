import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PlayCircle, CheckCircle2 } from 'lucide-react';

interface DemoModeProps {
  onRunDemo: () => void;
  demoStep: number;
}

const demoSteps = [
  { step: 1, title: 'Login to app', description: 'User authentication complete' },
  { step: 2, title: 'Approve consent', description: 'Grant data access to AI service' },
  { step: 3, title: 'Trigger AI action', description: 'AI processes your data' },
  { step: 4, title: 'View explanation', description: 'See how AI made decisions' },
  { step: 5, title: 'Revoke consent', description: 'Take back data access' },
  { step: 6, title: 'Show audit log', description: 'Review complete history' }
];

export function DemoMode({ onRunDemo, demoStep }: DemoModeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Demo Mode</h2>
        <p className="text-muted-foreground">
          Automated demonstration for judges and stakeholders
        </p>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-6 h-6" />
            Interactive Demo Flow
          </CardTitle>
          <CardDescription>
            Watch the complete end-to-end user journey in action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {demoSteps.map((step) => (
              <div
                key={step.step}
                className={`flex items-start gap-3 p-4 rounded-lg transition-colors ${
                  demoStep >= step.step
                    ? 'bg-white border-2 border-green-200'
                    : 'bg-white/50 border border-gray-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    demoStep >= step.step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {demoStep >= step.step ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{step.step}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p>{step.title}</p>
                    {demoStep === step.step && (
                      <Badge variant="default" className="animate-pulse">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={onRunDemo} className="w-full" size="lg">
            <PlayCircle className="w-5 h-5 mr-2" />
            {demoStep === 0 ? 'Start Demo' : 'Continue Demo'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Impact Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            "This app makes AI <span className="font-medium">transparent</span>,{' '}
            <span className="font-medium">accountable</span>, and{' '}
            <span className="font-medium">user-controlled</span>."
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Users understand how AI uses their data</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Complete audit trail of all AI interactions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Real-time consent management and revocation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Explainable AI decisions in plain language</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
