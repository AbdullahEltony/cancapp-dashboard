import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, CompleteProfileResponse } from '@/services/api';

export const ProfileVerification: React.FC = () => {
  const [pendingProfiles, setPendingProfiles] = useState<CompleteProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const fetchPendingProfiles = async () => {
    try {
      setIsLoading(true);
      const profiles = await apiService.getUncompletedProfiles();
      setPendingProfiles(profiles);
    } catch (error) {
      console.error('Error fetching pending profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load pending profiles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (action: 'approve' | 'reject', userId: string) => {
    try {
      if (action === 'approve') {
        await apiService.confirmProfile(userId);
      } else {
        await apiService.failProfile(userId);
      }
      
      // Remove the profile from the list
      setPendingProfiles(prev => prev.filter(p => p.userId !== userId));
      
      toast({
        title: action === 'approve' ? "Profile Approved" : "Profile Rejected",
        description: `Profile has been ${action}d successfully`,
        variant: action === 'approve' ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error during verification:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'Doctor': return 'bg-green-100 text-green-800';
      case 'Psychiatrist': return 'bg-orange-100 text-orange-800';
      case 'Pharmacist': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Verification</h1>
          <p className="text-gray-600 mt-2">Loading pending profiles...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Verification</h1>
        <p className="text-gray-600 mt-2">Review and verify professional profiles ({pendingProfiles.length} pending)</p>
      </div>

      {pendingProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingProfiles.map((profile) => (
            <Card key={profile.userId} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={profile.imageId} />
                    <AvatarFallback>{profile.userType.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">User ID: {profile.userId}</CardTitle>
                    <CardDescription>Professional Profile</CardDescription>
                  </div>
                </div>
                <Badge className={getUserTypeColor(profile.userType)}>
                  {profile.userType}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Profile Image</span>
                    <div className="mt-2">
                      <img 
                        src={profile.imageId} 
                        alt="Profile" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Medical/Professional License</span>
                    <div className="mt-2">
                      <img 
                        src={profile.medicalProve} 
                        alt="License" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIExpY2Vuc2U8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-3">
                    User ID: {profile.userId}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                      onClick={() => handleVerification('approve', profile.userId)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      size="sm"
                      onClick={() => handleVerification('reject', profile.userId)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending profile verifications at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
