
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Trash2, Shield, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, ReportedPost, ReportedComment, TopPost } from '@/services/api';

export const ContentModeration: React.FC = () => {
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([]);
  const [reportedComments, setReportedComments] = useState<ReportedComment[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setIsLoading(true);
      const [postsData, commentsData, topPostsData] = await Promise.all([
        apiService.getReportedPosts(),
        apiService.getReportedComments(),
        apiService.getTopPosts()
      ]);
      
      setReportedPosts(postsData);
      setReportedComments(commentsData);
      setTopPosts(topPostsData);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentAction = async (action: string, contentType: string, id: number, userId?: string) => {
    try {
      switch (action) {
        case 'Remove':
          if (contentType === 'post') {
            await apiService.removePost(id);
            setReportedPosts(prev => prev.filter(p => p.id !== id));
          } else if (contentType === 'comment') {
            await apiService.removeComment(id);
            setReportedComments(prev => prev.filter(c => c.id !== id));
          }
          break;
        case 'Warn User':
          if (userId) {
            await apiService.warnUserForContent(userId, contentType as 'post' | 'comment', id);
          }
          break;
        case 'View Details':
        case 'View Full':
        case 'View Post':
          // Handle view actions - could open a modal or navigate to content detail
          console.log(`View ${contentType}:`, id);
          break;
      }
      
      if (action !== 'View Details' && action !== 'View Full' && action !== 'View Post') {
        toast({
          title: "Action Completed",
          description: `${action} applied to ${contentType}`,
        });
      }
    } catch (error) {
      console.error('Error performing content action:', error);
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} ${contentType}`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600 mt-2">Loading content data...</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600 mt-2">Review reported content and monitor top posts</p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Reported Posts ({reportedPosts.length})</TabsTrigger>
          <TabsTrigger value="comments">Reported Comments ({reportedComments.length})</TabsTrigger>
          <TabsTrigger value="top">Top Posts ({topPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {reportedPosts.length > 0 ? (
            reportedPosts.map((post) => (
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
                      onClick={() => handleContentAction('View Full', 'post', post.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Full
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContentAction('Warn User', 'post', post.id, post.userId)}
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
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reported Posts</h3>
                <p className="text-gray-600">All posts are clean at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {reportedComments.length > 0 ? (
            reportedComments.map((comment) => (
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
                      onClick={() => handleContentAction('Warn User', 'comment', comment.id, comment.userId)}
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
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reported Comments</h3>
                <p className="text-gray-600">All comments are clean at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="top" className="space-y-4">
          {topPosts.length > 0 ? (
            topPosts.map((post, index) => (
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
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Top Posts</h3>
                <p className="text-gray-600">No trending posts available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
