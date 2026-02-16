import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Mail, Smartphone, Wallet, Lock } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (name: string, email: string) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onLogin(name, email);
    }
  };

  const handleMobileLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile && name) {
      onLogin(name, `${mobile}@mobile.user`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 border-2 border-primary rounded-2xl mb-6">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl mb-3 text-foreground">AI Data Control Portal</h1>
          <p className="text-xl text-muted-foreground">
            Secure identity. Complete transparency. Total control.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Web3 Wallet Login - Featured */}
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Connect Web3 Wallet</CardTitle>
              <CardDescription className="text-base">
                Decentralized authentication with maximum security
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Private key never leaves your device</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Cryptographic identity verification</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Traditional Login */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Secure ID Login</CardTitle>
              <CardDescription>
                Email or mobile authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="mobile">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-input-background border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-input-background border-border/50"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Continue with Email
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="mobile" className="space-y-4">
                  <form onSubmit={handleMobileLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-mobile">Full Name</Label>
                      <Input
                        id="name-mobile"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-input-background border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        className="bg-input-background border-border/50"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Continue with Mobile
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-lg">
            <Lock className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              User identity linked to secure ID. <span className="text-foreground font-medium">No raw data is ever stored.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}