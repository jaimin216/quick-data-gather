
-- Create enum types for form and question types
CREATE TYPE public.question_type AS ENUM (
  'text',
  'textarea',
  'multiple_choice',
  'checkbox',
  'dropdown',
  'number',
  'email',
  'date',
  'rating'
);

CREATE TYPE public.form_status AS ENUM (
  'draft',
  'published',
  'closed'
);

-- Create forms table
CREATE TABLE public.forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status form_status NOT NULL DEFAULT 'draft',
  allow_anonymous BOOLEAN NOT NULL DEFAULT true,
  require_login BOOLEAN NOT NULL DEFAULT false,
  collect_email BOOLEAN NOT NULL DEFAULT false,
  custom_thank_you_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  type question_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  required BOOLEAN NOT NULL DEFAULT false,
  options JSONB, -- For multiple choice, checkbox, dropdown options
  validation_rules JSONB, -- For custom validation
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create form responses table
CREATE TABLE public.form_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  respondent_email TEXT,
  respondent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create question responses table
CREATE TABLE public.question_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_response_id UUID REFERENCES public.form_responses(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  answer JSONB NOT NULL, -- Flexible storage for different answer types
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;

-- Forms policies
CREATE POLICY "Users can view their own forms" 
  ON public.forms FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own forms" 
  ON public.forms FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms" 
  ON public.forms FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms" 
  ON public.forms FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published forms for responses"
  ON public.forms FOR SELECT
  USING (status = 'published');

-- Questions policies
CREATE POLICY "Users can view questions of their own forms" 
  ON public.questions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = questions.form_id 
    AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Users can create questions for their own forms" 
  ON public.questions FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = questions.form_id 
    AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Users can update questions of their own forms" 
  ON public.questions FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = questions.form_id 
    AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete questions of their own forms" 
  ON public.questions FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = questions.form_id 
    AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view questions of published forms"
  ON public.questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = questions.form_id 
    AND forms.status = 'published'
  ));

-- Form responses policies
CREATE POLICY "Form owners can view responses to their forms" 
  ON public.form_responses FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = form_responses.form_id 
    AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can create responses to published forms" 
  ON public.form_responses FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = form_responses.form_id 
    AND forms.status = 'published'
  ));

-- Question responses policies
CREATE POLICY "Form owners can view question responses" 
  ON public.question_responses FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.form_responses fr
    JOIN public.forms f ON fr.form_id = f.id
    WHERE fr.id = question_responses.form_response_id 
    AND f.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can create question responses for published forms" 
  ON public.question_responses FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.form_responses fr
    JOIN public.forms f ON fr.form_id = f.id
    WHERE fr.id = question_responses.form_response_id 
    AND f.status = 'published'
  ));

-- Create indexes for better performance
CREATE INDEX idx_forms_user_id ON public.forms(user_id);
CREATE INDEX idx_forms_status ON public.forms(status);
CREATE INDEX idx_questions_form_id ON public.questions(form_id);
CREATE INDEX idx_questions_order ON public.questions(form_id, order_index);
CREATE INDEX idx_form_responses_form_id ON public.form_responses(form_id);
CREATE INDEX idx_question_responses_form_response_id ON public.question_responses(form_response_id);
CREATE INDEX idx_question_responses_question_id ON public.question_responses(question_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to forms table
CREATE TRIGGER forms_updated_at
  BEFORE UPDATE ON public.forms
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
