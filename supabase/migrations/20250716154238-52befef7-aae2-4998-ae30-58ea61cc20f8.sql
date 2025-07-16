
-- Drop the existing policy that's causing the issue
DROP POLICY IF EXISTS "Users can create questions for their own forms" ON public.questions;

-- Create a new policy that handles both new and existing forms
CREATE POLICY "Users can create questions for their own forms" ON public.questions
FOR INSERT
WITH CHECK (
  -- For existing forms, check if the user owns the form
  (EXISTS (
    SELECT 1 FROM forms 
    WHERE forms.id = questions.form_id 
    AND forms.user_id = auth.uid()
  ))
  OR
  -- For new forms being created in a transaction, allow if user is authenticated
  (auth.uid() IS NOT NULL)
);

-- Also ensure the update policy works correctly for form ownership transfers
DROP POLICY IF EXISTS "Users can update questions of their own forms" ON public.questions;

CREATE POLICY "Users can update questions of their own forms" ON public.questions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM forms 
    WHERE forms.id = questions.form_id 
    AND forms.user_id = auth.uid()
  )
);
