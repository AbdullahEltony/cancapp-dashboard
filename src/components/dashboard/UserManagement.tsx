
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Shield, ShieldOff, AlertTriangle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const mockUsers = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@email.com',
      userType: 'doctor',
      status: 'active',
      warnings: 0,
      lastActive: '2 hours ago',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      userType: 'patient',
      status: 'active',
      warnings: 1,
      lastActive: '1 day ago',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Dr. Alex Rivera',
      email: 'alex.rivera@email.com',
      userType: 'psychiatrist',
      status: 'disabled',
      warnings: 2,
      lastActive: '1 week ago',
      image: '/placeholder.svg'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      userType: 'pharmacist',
      status: 'active',
      warnings: 0,
      lastActive: '3 hours ago',
      image: '/placeholder.svg'
    },
  ];

  const handleUserAction = (action: string, userId: string, userName: string) => {
    console.log(`${action} action for user ${userId}`);
    toast({
      title: "Action Completed",
      description: `${action} applied to ${userName}`,
    });
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'pharmacist': return 'bg-purple-100 text-purple-800';
      case 'psychiatrist': return 'bg-orange-100 text-orange-800';
      case 'volunteer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage user accounts, permissions, and warnings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>View and manage all user accounts</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getUserTypeColor(user.userType)}>
                        {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                      {user.warnings > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {user.warnings} Warning{user.warnings > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserAction('View Details', user.id, user.name)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserAction('Add Warning', user.id, user.name)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Warn
                  </Button>
                  {user.status === 'active' ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUserAction('Disable', user.id, user.name)}
                    >
                      <ShieldOff className="w-4 h-4 mr-1" />
                      Disable
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleUserAction('Enable', user.id, user.name)}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Enable
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
