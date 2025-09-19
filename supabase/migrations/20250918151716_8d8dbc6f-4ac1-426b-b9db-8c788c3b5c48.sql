-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  student_id TEXT,
  university TEXT,
  year_of_study INTEGER,
  preferred_language TEXT DEFAULT 'en',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create chat_sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat Session',
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  crisis_indicators JSONB DEFAULT '{}',
  session_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Chat sessions policies
CREATE POLICY "Users can view their own chat sessions" 
ON public.chat_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
ON public.chat_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
ON public.chat_sessions FOR UPDATE 
USING (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai')),
  sentiment_score DECIMAL(3,2),
  contains_crisis_keywords BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Users can view messages from their sessions" 
ON public.chat_messages FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages in their sessions" 
ON public.chat_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create counseling_bookings table
CREATE TABLE public.counseling_bookings (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  counselor_name TEXT,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('individual', 'group', 'crisis', 'follow_up')),
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('low', 'medium', 'high', 'crisis')) DEFAULT 'medium',
  topic_areas TEXT[] DEFAULT '{}',
  additional_notes TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on counseling_bookings
ALTER TABLE public.counseling_bookings ENABLE ROW LEVEL SECURITY;

-- Booking policies
CREATE POLICY "Users can view their own bookings" 
ON public.counseling_bookings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON public.counseling_bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.counseling_bookings FOR UPDATE 
USING (auth.uid() = user_id);

-- Create mental_health_resources table
CREATE TABLE public.mental_health_resources (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'audio', 'article', 'worksheet', 'guide')),
  category TEXT NOT NULL CHECK (category IN ('anxiety', 'depression', 'stress', 'relationships', 'academic', 'self_care', 'crisis')),
  language TEXT NOT NULL DEFAULT 'en',
  content_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mental_health_resources
ALTER TABLE public.mental_health_resources ENABLE ROW LEVEL SECURITY;

-- Resources policies (public read access)
CREATE POLICY "Resources are viewable by authenticated users" 
ON public.mental_health_resources FOR SELECT 
USING (auth.role() = 'authenticated' AND is_published = TRUE);

-- Create peer_support_posts table
CREATE TABLE public.peer_support_posts (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'academic_stress', 'anxiety', 'depression', 'relationships', 'self_care')),
  is_anonymous BOOLEAN DEFAULT TRUE,
  is_urgent BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('open', 'answered', 'closed')) DEFAULT 'open',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on peer_support_posts
ALTER TABLE public.peer_support_posts ENABLE ROW LEVEL SECURITY;

-- Peer support posts policies
CREATE POLICY "Posts are viewable by authenticated users" 
ON public.peer_support_posts FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create posts" 
ON public.peer_support_posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.peer_support_posts FOR UPDATE 
USING (auth.uid() = user_id);

-- Create peer_support_responses table
CREATE TABLE public.peer_support_responses (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.peer_support_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_helpful BOOLEAN DEFAULT FALSE,
  is_volunteer_response BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on peer_support_responses
ALTER TABLE public.peer_support_responses ENABLE ROW LEVEL SECURITY;

-- Peer support responses policies
CREATE POLICY "Responses are viewable by authenticated users" 
ON public.peer_support_responses FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create responses" 
ON public.peer_support_responses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" 
ON public.peer_support_responses FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_counseling_bookings_updated_at
    BEFORE UPDATE ON public.counseling_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mental_health_resources_updated_at
    BEFORE UPDATE ON public.mental_health_resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peer_support_posts_updated_at
    BEFORE UPDATE ON public.peer_support_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peer_support_responses_updated_at
    BEFORE UPDATE ON public.peer_support_responses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, student_id, university)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'student_id',
    NEW.raw_user_meta_data->>'university'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample mental health resources
INSERT INTO public.mental_health_resources (title, description, content_type, category, language, tags, is_featured) VALUES
('Managing Anxiety: Breathing Techniques', 'Learn effective breathing exercises to manage anxiety and panic attacks.', 'video', 'anxiety', 'en', ARRAY['breathing', 'techniques', 'calm'], TRUE),
('Study Stress Relief Guide', 'Comprehensive guide to managing academic pressure and exam anxiety.', 'article', 'academic', 'en', ARRAY['study', 'exams', 'pressure'], TRUE),
('Daily Mindfulness Practice', '10-minute guided meditation for students to practice daily mindfulness.', 'audio', 'self_care', 'en', ARRAY['meditation', 'mindfulness', 'daily'], FALSE),
('Building Healthy Relationships', 'Tips and strategies for maintaining healthy relationships in college.', 'guide', 'relationships', 'en', ARRAY['friends', 'communication', 'boundaries'], FALSE),
('Crisis Support Resources', 'Emergency contacts and immediate help resources for mental health crises.', 'article', 'crisis', 'en', ARRAY['emergency', 'crisis', 'help'], TRUE);