import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AIDecision } from '../types';
import { Lightbulb, CheckCircle2, XCircle, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { format } from 'date-fns';

interface AIExplanationsProps {
  decisions: AIDecision[];
}

export function AIExplanations({ decisions }: AIExplanationsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">AI Decision Explanations</h1>
        <p className="text-muted-foreground">
          Understand exactly how AI makes decisions using your data
        </p>
      </div>

      {decisions.length === 0 ? (
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-2">No AI decisions to display yet</p>
              <p className="text-sm text-muted-foreground">Grant consent to services to see explanations</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {decisions.map((decision) => (
            <Card key={decision.id} className="bg-card border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl text-foreground">{decision.serviceName}</CardTitle>
                      <Badge className="bg-primary/20 border border-primary/30 text-primary">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        Explained
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      Decision Breakdown - {format(new Date(decision.timestamp), 'MMM dd, yyyy • HH:mm')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Result */}
                <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-primary/80 mb-1">AI Decision:</p>
                      <p className="text-foreground">{decision.result}</p>
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-foreground">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Why This Decision Was Made
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                      {decision.explanation.reasoning}
                    </p>
                  </div>
                </div>

                {/* Feature Influence Visualization */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-foreground">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Data Influence Weights
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-5 border border-border/30">
                    <div className="space-y-4">
                      {decision.explanation.featureInfluence.map((feature, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">{feature.feature}</span>
                            <div className="flex items-center gap-3">
                              <Progress 
                                value={feature.impact} 
                                className="h-2 w-32 bg-muted" 
                              />
                              <span className="text-lg font-medium text-primary w-12 text-right">
                                {feature.impact}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Data Used */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      Data Used
                    </h3>
                    <div className="space-y-2">
                      {decision.explanation.dataUsed.map((data, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 text-sm bg-success/10 border border-success/30 rounded-lg p-3"
                        >
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{data}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Not Used */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-foreground">
                      <XCircle className="w-5 h-5 text-muted-foreground" />
                      Data NOT Used
                    </h3>
                    <div className="space-y-2">
                      {decision.explanation.dataNotUsed.map((data, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 text-sm bg-muted/20 border border-border/30 rounded-lg p-3"
                        >
                          <XCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{data}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}