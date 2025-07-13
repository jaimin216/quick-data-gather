
-- First, let's check if we need to update the policies for form submissions
-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Allow anonymous submissions to published forms" ON public.form_responses;
DROP POLICY IF EXISTS "Allow anonymous question responses for published forms" ON public.question_responses;

-- Create updated policy for form responses that properly allows anonymous submissions
CREATE POLICY "Enable anonymous form submissions" 
  ON public.form_responses 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = form_responses.form_id 
      AND forms.status = 'published'
    )
  );

-- Create updated policy for question responses that allows anonymous responses
CREATE POLICY "Enable anonymous question responses" 
  ON public.question_responses 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM form_responses fr
      JOIN forms f ON fr.form_id = f.id
      WHERE fr.id = question_responses.form_response_id 
      AND f.status = 'published'
    )
  );
