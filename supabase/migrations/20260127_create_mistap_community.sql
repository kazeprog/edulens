-- Mistap Community Posts Table

CREATE TABLE IF NOT EXISTS public.mistap_community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_name TEXT, -- キャッシュ用のユーザー名（表示用）
  likes_count INT DEFAULT 0
);

-- RLS Enable
ALTER TABLE public.mistap_community_posts ENABLE ROW LEVEL SECURITY;

-- Policies

-- 誰でも閲覧可能
CREATE POLICY "Public profiles are viewable by everyone" ON public.mistap_community_posts
  FOR SELECT USING (true);

-- ログインユーザーのみ投稿可能
CREATE POLICY "Users can insert their own posts" ON public.mistap_community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分の投稿のみ削除可能
CREATE POLICY "Users can delete their own posts" ON public.mistap_community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Create profile update trigger to sync user_name if needed (optional for now)
-- For simplicity, we trust the client to send user_name or fetch it from profiles join
