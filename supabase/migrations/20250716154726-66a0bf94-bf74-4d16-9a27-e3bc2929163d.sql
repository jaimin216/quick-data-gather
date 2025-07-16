
-- Fix the RLS policy for form_responses to properly handle anonymous submissions
DROP POLICY IF EXISTS "Enable anonymous form submissions" ON public.form_responses;

CREATE POLICY "Enable anonymous form submissions" ON public.form_responses
FOR INSERT
WITH CHECK (
  -- Allow insertion if the form exists and is published
  EXISTS (
    SELECT 1 FROM forms 
    WHERE forms.id = form_responses.form_id 
    AND forms.status = 'published'::form_status
  )
);

-- Also ensure the quiz_attempts table allows anonymous submissions
DROP POLICY IF EXISTS "Users can create quiz attempts" ON public.quiz_attempts;

CREATE POLICY "Users can create quiz attempts" ON public.quiz_attempts
FOR INSERT
WITH CHECK (
  -- Allow insertion if the form exists and is published
  EXISTS (
    SELECT 1 FROM forms 
    WHERE forms.id = quiz_attempts.form_id 
    AND forms.status = 'published'::form_status
  )
);
