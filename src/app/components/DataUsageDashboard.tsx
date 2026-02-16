import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { DataUsageRecord } from '../types';
import { Database, Clock, Brain, Target } from 'lucide-react';
import { format } from 'date-fns';

interface DataUsageDashboardProps {
  dataUsage: DataUsageRecord[];
}

export function DataUsageDashboard({ dataUsage }: DataUsageDashboardProps) {
  const groupedByService = dataUsage.reduce((acc, record) => {
    if (!acc[record.serviceId]) {
      acc[record.serviceId] = [];
    }
    acc[record.serviceId].push(record);
    return acc;
  }, {} as Record<string, DataUsageRecord[]>);

  const stats = {
    totalAccess: dataUsage.length,
    uniqueServices: Object.keys(groupedByService).length,
    inference: dataUsage.filter(r => r.purpose === 'inference').length,
    training: dataUsage.filter(r => r.purpose === 'training').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">Data Usage Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time tracking of how AI services access your data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardDescription>Total Access Events</CardDescription>
            <CardTitle className="text-3xl text-foreground">{stats.totalAccess}</CardTitle>
          </CardHeader>
          <CardContent>
            <Database className="w-4 h-4 text-primary" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardDescription>Active Services</CardDescription>
            <CardTitle className="text-3xl text-foreground">{stats.uniqueServices}</CardTitle>
          </CardHeader>
          <CardContent>
            <Brain className="w-4 h-4 text-primary" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardDescription>Inference Calls</CardDescription>
            <CardTitle className="text-3xl text-primary">{stats.inference}</CardTitle>
          </CardHeader>
          <CardContent>
            <Target className="w-4 h-4 text-primary" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardDescription>Training Uses</CardDescription>
            <CardTitle className="text-3xl text-warning">{stats.training}</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock className="w-4 h-4 text-warning" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Data Access</CardTitle>
          <CardDescription>Detailed log of AI service data usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataUsage.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No data access recorded yet</p>
              </div>
            ) : (
              dataUsage.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start justify-between p-4 bg-muted/30 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground">{record.serviceName}</p>
                      <Badge 
                        variant={record.purpose === 'inference' ? 'default' : 'secondary'}
                        className={record.purpose === 'inference' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-warning/20 text-warning border border-warning/30'}
                      >
                        {record.purpose}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Data Type: <span className="text-foreground">{record.dataType}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Model: <span className="text-foreground">{record.modelName}</span>
                    </p>
                    {record.metadataHash && (
                      <p className="text-xs text-muted-foreground font-mono">
                        Hash: {record.metadataHash}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p className="text-foreground">{format(new Date(record.timestamp), 'MMM dd')}</p>
                    <p>{format(new Date(record.timestamp), 'HH:mm')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}