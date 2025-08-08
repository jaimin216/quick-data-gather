-- Enable Row Level Security (idempotent)
ALTER TABLE IF EXISTS public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;

-- 1) Published forms are publicly viewable
DROP POLICY IF EXISTS "Published forms are viewable by everyone" ON public.forms;
CREATE POLICY "Published forms are viewable by everyone"
ON public.forms
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- 2) Questions of published forms are publicly viewable
DROP POLICY IF EXISTS "Published form questions are viewable by everyone" ON public.questions;
CREATE POLICY "Published form questions are viewable by everyone"
ON public.questions
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = questions.form_id AND f.status = 'published'
  )
);

-- 3) Allow anonymous submissions to forms that allow it (and are published)
DROP POLICY IF EXISTS "Anonymous can submit to published anonymous forms" ON public.form_responses;
CREATE POLICY "Anonymous can submit to published anonymous forms"
ON public.form_responses
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = form_id
      AND f.status = 'published'
      AND (f.allow_anonymous IS TRUE OR f.require_login IS FALSE)
  )
);

-- 4) Allow authenticated submissions to any published form
DROP POLICY IF EXISTS "Authenticated can submit to published forms" ON public.form_responses;
CREATE POLICY "Authenticated can submit to published forms"
ON public.form_responses
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = form_id
      AND f.status = 'published'
  )
);

-- 5) Allow inserting answers tied to a valid response on a published form
DROP POLICY IF EXISTS "Anyone can insert answers for a valid response" ON public.question_responses;
CREATE POLICY "Anyone can insert answers for a valid response"
ON public.question_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.form_responses fr
    JOIN public.forms f ON f.id = fr.form_id
    WHERE fr.id = form_response_id
      AND f.status = 'published'
  )
);
