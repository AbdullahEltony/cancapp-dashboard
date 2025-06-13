import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, MessageSquare, AlertTriangle, Stethoscope, Pill, Heart, Brain } from 'lucide-react';
import { apiService, NumberOfUsersResponse } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const Overview: React.FC = () => {
  const [userStats, setUserStats] = useState<NumberOfUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Test API connection first
        await apiService.testConnection();
        
        const statsData = await apiService.getUserStats();
        setUserStats(statsData);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statsConfig = [
    {
      title: 'Total Users',
      value: userStats?.numberOfUsers?.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Doctors',
      value: userStats?.numberOfDoctors?.toString() || '0',
      icon: Stethoscope,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Patients',
      value: userStats?.numberOfPatients?.toString() || '0',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Pharmacists',
      value: userStats?.numberOfPharmacist?.toString() || '0',
      icon: Pill,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Volunteers',
      value: userStats?.numberOfVolunteers?.toString() || '0',
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Psychiatrists',
      value: userStats?.numberOfPsychiatrist?.toString() || '0',
      icon: Brain,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
  ];

  const pieData = [
    { name: 'Doctors', value: userStats?.numberOfDoctors || 0 },
    { name: 'Patients', value: userStats?.numberOfPatients || 0 },
    { name: 'Pharmacists', value: userStats?.numberOfPharmacist || 0 },
    { name: 'Volunteers', value: userStats?.numberOfVolunteers || 0 },
    { name: 'Psychiatrists', value: userStats?.numberOfPsychiatrist || 0 },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Doctors', users: userStats?.numberOfDoctors || 0 },
    { name: 'Patients', users: userStats?.numberOfPatients || 0 },
    { name: 'Pharmacists', users: userStats?.numberOfPharmacist || 0 },
    { name: 'Volunteers', users: userStats?.numberOfVolunteers || 0 },
    { name: 'Psychiatrists', users: userStats?.numberOfPsychiatrist || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening on CancApp today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Count by Type</CardTitle>
            <CardDescription>Detailed user statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
