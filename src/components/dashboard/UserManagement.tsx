
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Shield, ShieldOff, AlertTriangle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, User } from '@/services/api';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (action: string, userId: string, userName: string) => {
    try {
      switch (action) {
        case 'Disable':
          await apiService.updateUserStatus(userId, 'disabled');
          break;
        case 'Enable':
          await apiService.updateUserStatus(userId, 'active');
          break;
        case 'Add Warning':
          await apiService.addUserWarning(userId, 'Administrative warning');
          break;
        case 'View Details':
          // Handle view details - could open a modal or navigate to user detail page
          console.log('View details for user:', userId);
          break;
      }
      
      if (action !== 'View Details') {
        await fetchUsers(); // Refresh the users list
      }
      
      toast({
        title: "Action Completed",
        description: `${action} applied to ${userName}`,
      });
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} user`,
        variant: "destructive"
      });
    }
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Loading users...</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <CardDescription>View and manage all user accounts ({users.length} total)</CardDescription>
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
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
                        <Badge className={getStatusColor(user.status || 'active')}>
                          {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                        </Badge>
                        {user.warnings && user.warnings > 0 && (
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
                    {(user.status || 'active') === 'active' ? (
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
