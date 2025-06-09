
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, MessageSquare, AlertTriangle } from 'lucide-react';

export const Overview: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Verifications',
      value: '23',
      change: '-8%',
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Reported Content',
      value: '15',
      change: '+3%',
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Active Warnings',
      value: '7',
      change: '-15%',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
  ];

  const recentActivity = [
    { action: 'Profile verified', user: 'Dr. Sarah Johnson', time: '2 minutes ago', type: 'success' },
    { action: 'Post reported', user: 'Anonymous', time: '15 minutes ago', type: 'warning' },
    { action: 'User warned', user: 'Mike Chen', time: '1 hour ago', type: 'error' },
    { action: 'New doctor registered', user: 'Dr. Alex Rivera', time: '2 hours ago', type: 'info' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening on CancApp today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {stat.change} from last month
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown by user type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Patients', count: 8234, percentage: 64, color: 'bg-blue-500' },
                { type: 'Doctors', count: 2456, percentage: 19, color: 'bg-green-500' },
                { type: 'Pharmacists', count: 1457, percentage: 11, color: 'bg-purple-500' },
                { type: 'Volunteers', count: 456, percentage: 4, color: 'bg-orange-500' },
                { type: 'Psychiatrists', count: 244, percentage: 2, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.type} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{item.type}</span>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
