
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfileVerification: React.FC = () => {
  const { toast } = useToast();

  const pendingProfiles = [
    {
      id: '1',
      userId: 'user_123',
      name: 'Dr. Maria Garcia',
      userType: 'doctor',
      profileImage: '/placeholder.svg',
      medicalLicense: '/placeholder.svg',
      submittedAt: '2 hours ago',
      specialty: 'Oncology'
    },
    {
      id: '2',
      userId: 'user_456',
      name: 'Dr. James Wilson',
      userType: 'psychiatrist',
      profileImage: '/placeholder.svg',
      medicalLicense: '/placeholder.svg',
      submittedAt: '5 hours ago',
      specialty: 'Clinical Psychology'
    },
    {
      id: '3',
      userId: 'user_789',
      name: 'PharmD Lisa Chen',
      userType: 'pharmacist',
      profileImage: '/placeholder.svg',
      medicalLicense: '/placeholder.svg',
      submittedAt: '1 day ago',
      specialty: 'Clinical Pharmacy'
    },
  ];

  const handleVerification = (action: 'approve' | 'reject', profileId: string, name: string) => {
    console.log(`${action} profile ${profileId}`);
    toast({
      title: action === 'approve' ? "Profile Approved" : "Profile Rejected",
      description: `${name}'s profile has been ${action}d`,
      variant: action === 'approve' ? "default" : "destructive"
    });
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'psychiatrist': return 'bg-orange-100 text-orange-800';
      case 'pharmacist': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Verification</h1>
        <p className="text-gray-600 mt-2">Review and verify professional profiles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingProfiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={profile.profileImage} />
                  <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{profile.name}</CardTitle>
                  <CardDescription>{profile.specialty}</CardDescription>
                </div>
              </div>
              <Badge className={getUserTypeColor(profile.userType)}>
                {profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Profile Image</span>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Medical License</span>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-3">
                  User ID: {profile.userId} • Submitted {profile.submittedAt}
                </p>
                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                    onClick={() => handleVerification('approve', profile.id, profile.name)}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    size="sm"
                    onClick={() => handleVerification('reject', profile.id, profile.name)}
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

      {pendingProfiles.length === 0 && (
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
