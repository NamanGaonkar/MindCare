-- Create missing peer support tables
CREATE TABLE public.peer_support_reactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    reaction_type TEXT NOT NULL DEFAULT 'like',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.peer_support_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.peer_support_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_support_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reactions
CREATE POLICY "Users can view all reactions" 
ON public.peer_support_reactions 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create reactions" 
ON public.peer_support_reactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
ON public.peer_support_reactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Users can view all comments" 
ON public.peer_support_comments 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create comments" 
ON public.peer_support_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.peer_support_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.peer_support_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix booking_type constraint by dropping the old one and creating a new one
ALTER TABLE public.counseling_bookings DROP CONSTRAINT IF EXISTS counseling_bookings_booking_type_check;
ALTER TABLE public.counseling_bookings ADD CONSTRAINT counseling_bookings_booking_type_check 
CHECK (booking_type IN ('campus_counseling', 'crisis_support', 'group_therapy', 'consultation'));

-- Create trigger for comments updated_at
CREATE TRIGGER update_peer_support_comments_updated_at
BEFORE UPDATE ON public.peer_support_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();