
-- Add new columns to forms table for dual passing criteria
ALTER TABLE public.forms 
ADD COLUMN use_percentage_criteria boolean DEFAULT true,
ADD COLUMN use_mcq_criteria boolean DEFAULT false,
ADD COLUMN min_correct_mcqs integer DEFAULT NULL,
ADD COLUMN total_mcqs integer DEFAULT NULL;

-- Update existing forms to use percentage criteria by default
UPDATE public.forms 
SET use_percentage_criteria = true, 
    use_mcq_criteria = false 
WHERE use_percentage_criteria IS NULL;
