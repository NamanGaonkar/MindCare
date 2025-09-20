-- Drop existing policies and tables if they exist for a clean slate
-- This is destructive and will delete all data.
-- It's commented out by default for safety. If you want to start fresh,
-- you can run these DROP statements manually in your Supabase SQL editor.
/*
DROP POLICY IF EXISTS "Enable ALL for users based on user_id" ON "public"."peer_support_reactions";
DROP POLICY IF EXISTS "Enable ALL for users based on user_id" ON "public"."peer_support_posts";
DROP POLICY IF EXISTS "Enable ALL for users based on user_id" ON "public"."mood_entries";
DROP POLICY IF EXISTS "Enable ALL for users based on user_id" ON "public"."journal_entries";
DROP TABLE IF EXISTS public.peer_support_reactions;
DROP TABLE IF EXISTS public.peer_support_comments;
DROP TABLE IF EXISTS public.peer_support_posts;
DROP TABLE IF EXISTS public.journal_entries;
DROP TABLE IF EXISTS public.mood_entries;
DROP TABLE IF EXISTS public.mental_health_resources;
DROP TABLE IF EXISTS public.counseling_bookings;
DROP TABLE IF EXISTS public.chat_messages;
DROP TABLE IF EXISTS public.chat_sessions;
DROP TABLE IF EXISTS public.profiles;
*/

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger to run the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. CHAT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    title text DEFAULT 'New Chat'
);
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own chat sessions." ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);


-- 3. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id uuid NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_type text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
-- For users to view their messages
CREATE POLICY "Users can view messages in their sessions." ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
-- For users to insert their own messages
CREATE POLICY "Users can insert messages in their sessions." ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
-- This policy is crucial for the AI chatbot to work.
-- It allows server-side processes (like Supabase Functions) that use the service_role key to bypass RLS and insert messages.
-- Without this, the AI's replies would be blocked.
CREATE POLICY "Allow service_role to insert AI messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.role() = 'service_role');


-- 4. MOOD ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.mood_entries (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_value integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own mood entries." ON public.mood_entries FOR ALL USING (auth.uid() = user_id);


-- 5. JOURNAL ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own journal entries." ON public.journal_entries FOR ALL USING (auth.uid() = user_id);


-- 6. PEER SUPPORT POSTS TABLE
CREATE TABLE IF NOT EXISTS public.peer_support_posts (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    category text DEFAULT 'general',
    is_anonymous boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.peer_support_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view all posts." ON public.peer_support_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create their own posts." ON public.peer_support_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts." ON public.peer_support_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts." ON public.peer_support_posts FOR DELETE USING (auth.uid() = user_id);


-- 7. PEER SUPPORT COMMENTS TABLE (Corrected Name)
CREATE TABLE IF NOT EXISTS public.peer_support_comments (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id uuid NOT NULL REFERENCES public.peer_support_posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.peer_support_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view all comments." ON public.peer_support_comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create comments." ON public.peer_support_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments." ON public.peer_support_comments FOR DELETE USING (auth.uid() = user_id);


-- 8. PEER SUPPORT REACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.peer_support_reactions (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id uuid NOT NULL REFERENCES public.peer_support_posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type text DEFAULT 'like',
    UNIQUE (post_id, user_id)
);
ALTER TABLE public.peer_support_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view all reactions." ON public.peer_support_reactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create their own reactions." ON public.peer_support_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions." ON public.peer_support_reactions FOR DELETE USING (auth.uid() = user_id);

-- Dummy tables from original migration for completeness, though they are not causing the current errors
CREATE TABLE IF NOT EXISTS public.counseling_bookings (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.counseling_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bookings" ON public.counseling_bookings FOR ALL USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.mental_health_resources (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true
);
ALTER TABLE public.mental_health_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources are viewable by authenticated users" ON public.mental_health_resources FOR SELECT USING (auth.role() = 'authenticated' AND is_published = TRUE);

-- RPC for dashboard stats
CREATE OR REPLACE FUNCTION get_user_daily_activity(user_id_param uuid)
RETURNS TABLE(day text, type text, count bigint) AS $$
BEGIN
    RETURN QUERY
    WITH all_dates AS (
        SELECT generate_series(
            date_trunc('day', now()) - interval '6 days',
            date_trunc('day', now()),
            '1 day'
        )::date AS day
    ),
    chat_activity AS (
        SELECT date_trunc('day', created_at)::date AS day, 'AI Chats' as type, count(id) as count
        FROM chat_sessions
        WHERE user_id = user_id_param AND created_at >= now() - interval '7 days'
        GROUP BY 1
    ),
    post_activity AS (
        SELECT date_trunc('day', created_at)::date AS day, 'Posts' as type, count(id) as count
        FROM peer_support_posts
        WHERE user_id = user_id_param AND created_at >= now() - interval '7 days'
        GROUP BY 1
    ),
    all_activity AS (
        SELECT * FROM chat_activity
        UNION ALL
        SELECT * FROM post_activity
    )
    SELECT to_char(d.day, 'Mon DD') as day, COALESCE(aa.type, 'AI Chats') as type, COALESCE(aa.count, 0) as count
    FROM all_dates d
    LEFT JOIN all_activity aa ON d.day = aa.day
    ORDER BY d.day;
END;
$$ LANGUAGE plpgsql;
