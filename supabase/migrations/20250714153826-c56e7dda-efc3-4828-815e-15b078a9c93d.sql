
-- Add quiz-specific fields to the forms table
ALTER TABLE public.forms 
ADD COLUMN is_quiz BOOLEAN DEFAULT FALSE,
ADD COLUMN time_limit_minutes INTEGER,
ADD COLUMN passing_score INTEGER,
ADD COLUMN total_points INTEGER DEFAULT 0,
ADD COLUMN show_results BOOLEAN DEFAULT TRUE,
ADD COLUMN allow_retake BOOLEAN DEFAULT TRUE,
ADD COLUMN auto_save_enabled BOOLEAN DEFAULT TRUE;

-- Add quiz-specific fields to the questions table
ALTER TABLE public.questions 
ADD COLUMN points INTEGER DEFAULT 1,
ADD COLUMN correct_answers JSONB,
ADD COLUMN explanation TEXT;

-- Create a table to store quiz attempts and scores
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  form_response_id UUID REFERENCES public.form_responses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  score INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  time_taken_seconds INTEGER,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies for quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own quiz attempts
CREATE POLICY "Users can view their own quiz attempts" 
  ON public.quiz_attempts 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Policy for anonymous users to view their quiz attempts (by form_response_id)
CREATE POLICY "Anonymous users can view their quiz attempts" 
  ON public.quiz_attempts 
  FOR SELECT 
  USING (user_id IS NULL);

-- Policy for form owners to view quiz attempts on their forms
CREATE POLICY "Form owners can view quiz attempts on their forms" 
  ON public.quiz_attempts 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = quiz_attempts.form_id 
    AND forms.user_id = auth.uid()
  ));

-- Policy for creating quiz attempts
CREATE POLICY "Users can create quiz attempts" 
  ON public.quiz_attempts 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = quiz_attempts.form_id 
      AND forms.status = 'published'
    )
  );

-- Add trigger to update the updated_at timestamp for forms
CREATE OR REPLACE FUNCTION update_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forms_updated_at_trigger
  BEFORE UPDATE ON public.forms
  FOR EACH ROW
  EXECUTE FUNCTION update_forms_updated_at();
