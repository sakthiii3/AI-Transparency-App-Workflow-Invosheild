import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Notification } from '../types';
import { Bell, AlertCircle, Database, Shield, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const notificationIcons: Record<string, any> = {
  consent_request: Shield,
  consent_expiring: Clock,
  unusual_activity: AlertCircle,
  data_access: Database
};

const notificationColors: Record<string, string> = {
  consent_request: 'bg-blue-50 border-blue-200',
  consent_expiring: 'bg-orange-50 border-orange-200',
  unusual_activity: 'bg-red-50 border-red-200',
  data_access: 'bg-green-50 border-green-200'
};

export function NotificationsPanel({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Notifications</h2>
          <p className="text-muted-foreground">
            Stay informed about data access and consent status
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={onMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <p className="text-sm">
              You have <span className="font-medium">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
                <p className="text-sm mt-2">You'll be notified about important events</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell;
            const colorClass = notificationColors[notification.type] || 'bg-gray-50 border-gray-200';

            return (
              <Card
                key={notification.id}
                className={`${!notification.read ? colorClass : 'opacity-60'}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${!notification.read ? 'bg-white' : 'bg-muted'}`}>
                        <Icon className={`w-5 h-5 ${!notification.read ? 'text-blue-600' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <CardDescription>{notification.message}</CardDescription>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {!notification.read && (
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
