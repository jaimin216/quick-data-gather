
-- Drop the existing restrictive policy for form responses
DROP POLICY IF EXISTS "Anyone can create responses to published forms" ON public.form_responses;

-- Create a new policy that allows anonymous submissions to published forms
CREATE POLICY "Allow anonymous submissions to published forms" 
  ON public.form_responses 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = form_responses.form_id 
      AND forms.status = 'published'
      AND forms.allow_anonymous = true
    )
    OR
    (auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = form_responses.form_id 
      AND forms.status = 'published'
    ))
  );

-- Drop the existing restrictive policy for question responses
DROP POLICY IF EXISTS "Anyone can create question responses for published forms" ON public.question_responses;

-- Create a new policy that allows anonymous question responses
CREATE POLICY "Allow anonymous question responses for published forms" 
  ON public.question_responses 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM form_responses fr
      JOIN forms f ON fr.form_id = f.id
      WHERE fr.id = question_responses.form_response_id 
      AND f.status = 'published'
      AND f.allow_anonymous = true
    )
    OR
    EXISTS (
      SELECT 1 
      FROM form_responses fr
      JOIN forms f ON fr.form_id = f.id
      WHERE fr.id = question_responses.form_response_id 
      AND f.status = 'published'
      AND fr.respondent_id = auth.uid()
    )
  );
