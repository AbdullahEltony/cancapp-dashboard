import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ShieldOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

export const UserManagement: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUserAction = async (action: string) => {
    if (!userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a User ID",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      switch (action) {
        case 'disable':
          await apiService.disableUser(userId.trim());
          toast({
            title: "Success",
            description: "User disabled successfully",
          });
          break;
        case 'enable':
          await apiService.enableUser(userId.trim());
          toast({
            title: "Success",
            description: "User enabled successfully",
          });
          break;
        case 'warning':
          await apiService.addWarning(userId.trim());
          toast({
            title: "Success",
            description: "Warning added successfully",
          });
          break;
      }
      
      setUserId(''); // Clear the input after successful action
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage user accounts, permissions, and warnings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Actions</CardTitle>
            <CardDescription>Perform actions on user accounts by entering their User ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleUserAction('disable')}
                disabled={isLoading || !userId.trim()}
                className="w-full"
              >
                <ShieldOff className="w-4 h-4 mr-2" />
                Disable User
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleUserAction('enable')}
                disabled={isLoading || !userId.trim()}
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Enable User
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={() => handleUserAction('warning')}
              disabled={isLoading || !userId.trim()}
              className="w-full"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Add Warning
            </Button>
            
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>How to use the user management system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Disable User</h4>
                  <p className="text-sm text-gray-600">Temporarily disable a user account. The user will not be able to access the platform.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Enable User</h4>
                  <p className="text-sm text-gray-600">Re-enable a previously disabled user account.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Add Warning</h4>
                  <p className="text-sm text-gray-600">Add a warning to a user's account. Multiple warnings may lead to account suspension.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Finding User IDs</h4>
              <p className="text-sm text-blue-700">
                You can find User IDs in the Profile Verification section or through user reports. 
                The User ID is a unique identifier for each user account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
