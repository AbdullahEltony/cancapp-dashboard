
import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Overview } from '@/components/dashboard/Overview';
import { UserManagement } from '@/components/dashboard/UserManagement';
import { ProfileVerification } from '@/components/dashboard/ProfileVerification';
import { ContentModeration } from '@/components/dashboard/ContentModeration';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <UserManagement />;
      case 'verification':
        return <ProfileVerification />;
      case 'content':
        return <ContentModeration />;
      default:
        return <Overview />;
    }
  };

  return (
    <AuthProvider>
      <LoginForm>
        <div className="flex h-screen bg-gray-50">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </LoginForm>
    </AuthProvider>
  );
};

export default Index;
