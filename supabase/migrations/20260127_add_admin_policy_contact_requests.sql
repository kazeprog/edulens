-- RLSを有効化（念のため）
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- 管理者がお問い合わせを閲覧できるようにするポリシー
CREATE POLICY "Admins can view contact requests"
ON contact_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
