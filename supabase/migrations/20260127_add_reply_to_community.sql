-- Add parent_id to mistap_community_posts for replies

ALTER TABLE public.mistap_community_posts
ADD COLUMN parent_id UUID REFERENCES public.mistap_community_posts(id) ON DELETE CASCADE;

-- Index for faster lookups of replies
CREATE INDEX idx_mistap_community_posts_parent_id ON public.mistap_community_posts(parent_id);
