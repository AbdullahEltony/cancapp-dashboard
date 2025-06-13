import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { PostResponse, CommentResponse } from '@/services/api';

export const ContentModeration: React.FC = () => {
  const [reportedPosts, setReportedPosts] = useState<PostResponse[]>([]);
  const [reportedComments, setReportedComments] = useState<CommentResponse[]>([]);
  const [topPosts, setTopPosts] = useState<PostResponse[]>([]);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                        <AvatarImage src={post.userProgilePictureUrl} />
                        <AvatarFallback>{post.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.name}</h3>
                        <p className="text-sm text-gray-600">{formatDate(post.time)} • ID: {post.id}</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Reported</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-800">{post.content}</p>
                  {post.imageUrl && (
                    <div className="bg-gray-100 rounded-lg p-4">
                      <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="w-full max-h-64 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
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
                        <AvatarImage src={comment.userImageUrl} />
                        <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{comment.name}</h3>
                        <p className="text-sm text-gray-600">{formatDate(comment.time)} • Post ID: {comment.postId}</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Reported</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-800">{comment.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{comment.reactionsNumber} reactions</span>
                    </div>
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
                      <Badge variant="secondary" className="mr-2">#{index + 1}</Badge>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.userProgilePictureUrl} />
                        <AvatarFallback>{post.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.name}</h3>
                        <p className="text-sm text-gray-600">{formatDate(post.time)} • ID: {post.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Top Post</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-800">{post.content}</p>
                  {post.imageUrl && (
                    <div className="bg-gray-100 rounded-lg p-4">
                      <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="w-full max-h-64 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
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
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{post.commentsCount + post.reactionsCount} total engagement</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Top Posts</h3>
                <p className="text-gray-600">No posts with high engagement at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
