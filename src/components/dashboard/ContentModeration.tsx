
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Trash2, Shield, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ContentModeration: React.FC = () => {
  const { toast } = useToast();

  const reportedPosts = [
    {
      id: 1,
      content: "Just started my chemo treatment today. Feeling nervous but hopeful...",
      userImage: '/placeholder.svg',
      userName: 'Sarah M.',
      userId: 'user_123',
      time: '2 hours ago',
      commentsCount: 24,
      reactionsCount: 156,
      postImage: '/placeholder.svg',
      reportReason: 'Inappropriate content'
    },
    {
      id: 2,
      content: "Looking for support group recommendations in the Bay Area",
      userImage: '/placeholder.svg',
      userName: 'Mike Johnson',
      userId: 'user_456',
      time: '5 hours ago',
      commentsCount: 12,
      reactionsCount: 89,
      postImage: null,
      reportReason: 'Spam'
    },
  ];

  const reportedComments = [
    {
      id: 1,
      content: "That's not how treatment works, you should try this alternative method instead...",
      postId: 123,
      time: '1 hour ago',
      userId: 'user_789',
      userImage: '/placeholder.svg',
      userName: 'Dr. Alternative',
      reactionsCount: 5,
      reportReason: 'Medical misinformation'
    },
    {
      id: 2,
      content: "Stop being so negative all the time!",
      postId: 456,
      time: '3 hours ago',
      userId: 'user_101',
      userImage: '/placeholder.svg',
      userName: 'Anonymous User',
      reactionsCount: 0,
      reportReason: 'Harassment'
    },
  ];

  const topPosts = [
    {
      id: 1,
      content: "Celebrating 1 year cancer-free today! Thank you to this amazing community...",
      userImage: '/placeholder.svg',
      userName: 'Emma Wilson',
      userId: 'user_202',
      time: '6 hours ago',
      commentsCount: 189,
      reactionsCount: 1245,
      engagementScore: 1434
    },
    {
      id: 2,
      content: "Tips for managing side effects during treatment - what worked for me",
      userImage: '/placeholder.svg',
      userName: 'Dr. Patricia Lee',
      userId: 'user_303',
      time: '1 day ago',
      commentsCount: 97,
      reactionsCount: 876,
      engagementScore: 973
    },
  ];

  const handleContentAction = (action: string, contentType: string, id: number) => {
    console.log(`${action} ${contentType} ${id}`);
    toast({
      title: "Action Completed",
      description: `${action} applied to ${contentType}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600 mt-2">Review reported content and monitor top posts</p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Reported Posts</TabsTrigger>
          <TabsTrigger value="comments">Reported Comments</TabsTrigger>
          <TabsTrigger value="top">Top Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {reportedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.userImage} />
                      <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                      <p className="text-sm text-gray-600">{post.time} • ID: {post.id}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">{post.reportReason}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-800">{post.content}</p>
                {post.postImage && (
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Image attachment available</p>
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} comments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.reactionsCount} reactions</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContentAction('View Details', 'post', post.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Full
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContentAction('Warn User', 'post', post.id)}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Warn User
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleContentAction('Remove', 'post', post.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {reportedComments.map((comment) => (
            <Card key={comment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={comment.userImage} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{comment.userName}</h3>
                      <p className="text-sm text-gray-600">{comment.time} • Post ID: {comment.postId}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">{comment.reportReason}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-800">{comment.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{comment.reactionsCount} reactions</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContentAction('View Post', 'comment', comment.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Post
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContentAction('Warn User', 'comment', comment.id)}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Warn User
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleContentAction('Remove', 'comment', comment.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="top" className="space-y-4">
          {topPosts.map((post, index) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.userImage} />
                      <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                      <p className="text-sm text-gray-600">{post.time}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-800">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} comments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.reactionsCount} reactions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Score: {post.engagementScore}</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContentAction('View Details', 'top post', post.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Full
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
