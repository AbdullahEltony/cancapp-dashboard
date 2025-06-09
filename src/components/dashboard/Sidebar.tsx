
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  MessageSquare,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'verification', label: 'Profile Verification', icon: UserCheck },
  { id: 'content', label: 'Content Moderation', icon: MessageSquare },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">CancApp Admin</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.image} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
