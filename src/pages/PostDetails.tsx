import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Heart, Trash2, Send } from 'lucide-react';
import Navigation from '@/components/Navigation';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPostAndComments = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: postData, error: postError } = await supabase
        .from('peer_support_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) throw postError;
      setPost(postData);

      const { data: commentsData, error: commentsError } = await supabase
        .from('peer_support_comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);
    } catch (error) {
      toast({ title: 'Error loading post', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    loadPostAndComments();
  }, [loadPostAndComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !id) return;

    try {
      const { error } = await supabase.from('peer_support_comments').insert({
        post_id: id,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;
      setNewComment('');
      loadPostAndComments(); // Refresh comments
      toast({ title: 'Comment added successfully' });
    } catch (error) {
      toast({ title: 'Failed to add comment', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { error } = await supabase.from('peer_support_comments').delete().eq('id', commentId);
      if (error) throw error;
      loadPostAndComments(); // Refresh comments
      toast({ title: 'Comment deleted' });
    } catch (error) {
      toast({ title: 'Failed to delete comment', description: error.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className='min-h-screen bg-background'>
        <Navigation />
        <main className='container mx-auto px-4 py-8'>
            <Link to='/peer-support' className='flex items-center text-sm text-muted-foreground hover:text-primary mb-4'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Forum
            </Link>
            <Card>
                <CardHeader>
                    <Badge variant='secondary' className='w-fit mb-2'>{post.category}</Badge>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                        Posted by {post.is_anonymous ? 'Anonymous' : 'user'} on {new Date(post.created_at).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='whitespace-pre-wrap'>{post.content}</p>
                </CardContent>
            </Card>

            <div className='mt-8'>
                <h2 className='text-2xl font-bold mb-4'>Comments ({comments.length})</h2>
                <div className='space-y-4'>
                    {comments.map((comment) => (
                        <Card key={comment.id} className='bg-muted/50'>
                            <CardContent className='p-4 flex justify-between items-start'>
                                <div>
                                    <p className='font-semibold text-sm'>Anonymous User</p>
                                    <p className='text-muted-foreground'>{comment.content}</p>
                                    <p className='text-xs text-muted-foreground mt-1'>
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                {comment.user_id === user?.id && (
                                    <Button variant='ghost' size='icon' onClick={() => handleDeleteComment(comment.id)}>
                                        <Trash2 className='w-4 h-4' />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* New Comment Form */}
                <div className='mt-6'>
                    <h3 className='font-semibold mb-2'>Add a Comment</h3>
                    <Textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder='Share your thoughts...'
                        className='mb-2'
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className='w-4 h-4 mr-2' />
                        Submit
                    </Button>
                </div>
            </div>
        </main>
    </div>
  )
}

export default PostDetails;
