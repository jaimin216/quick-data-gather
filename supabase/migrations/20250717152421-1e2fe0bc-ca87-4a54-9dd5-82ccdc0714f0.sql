
-- Fix the forms table RLS policy to prevent users from seeing other users' forms
DROP POLICY IF EXISTS "Anyone can view published forms for responses" ON public.forms;

-- Create a more restrictive policy that only allows viewing published forms for the purpose of form submission (not in dashboard)
-- This policy will be used by the form submission page, not the dashboard
CREATE POLICY "Allow viewing published forms for submission only" ON public.forms
FOR SELECT
USING (
  status = 'published'::form_status 
  AND auth.uid() IS NULL  -- Only allow anonymous users (form fillers) to see published forms
);

-- Ensure authenticated users can only see their own forms (this policy already exists but let's make sure it's correct)
-- The existing "Users can view their own forms" policy should handle authenticated users seeing only their own forms

-- Also fix the questions table policy to prevent cross-user data access
DROP POLICY IF EXISTS "Anyone can view questions of published forms" ON public.questions;

-- Create a more restrictive policy for questions
CREATE POLICY "Allow viewing questions for form submission only" ON public.questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM forms 
    WHERE forms.id = questions.form_id 
    AND forms.status = 'published'::form_status
  )
  AND auth.uid() IS NULL  -- Only allow anonymous users to see questions for form filling
);

-- The existing policy "Users can view questions of their own forms" should handle authenticated users
