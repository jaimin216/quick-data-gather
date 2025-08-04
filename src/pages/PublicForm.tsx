import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, Mail, FileText, Timer } from 'lucide-react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { ExamQuestion } from '@/components/exam/ExamQuestion';
import { ExamResultModal } from '@/components/exam/ExamResultModal';
import { ConfirmSubmitModal } from '@/components/exam/ConfirmSubmitModal';
import { ExamProgressIndicator } from '@/components/exam/ExamProgressIndicator';

type Form = Tables<'forms'>;
type Question = Tables<'questions'>;

interface FormData {
  [questionId: string]: any;
}

interface ExamResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
}

export default function PublicForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    if (!id) return;

    try {
      // Load form details
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (formError) throw formError;
      setForm(formData);

      // Load questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('form_id', id)
        .order('order_index');

      if (questionsError) throw questionsError;
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading form:', error);
      toast({
        title: "Error",
        description: "Failed to load form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    console.log('Answer changed for question:', questionId, 'Value:', value);
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = (responses: FormData): ExamResult => {
    console.log('Calculating score with responses:', responses);
    console.log('Questions:', questions);
    
    let score = 0;
    let totalPoints = 0;
    let correctMcqs = 0;
    let totalMcqs = 0;

    questions.forEach(question => {
      const points = question.points || 1;
      totalPoints += points;

      const userAnswer = responses[question.id];
      const correctAnswers = question.correct_answers;

      console.log(`Question ${question.id}:`, {
        userAnswer,
        correctAnswers,
        questionType: question.type,
        points
      });

      // Count MCQs
      if (['multiple_choice', 'checkbox', 'dropdown'].includes(question.type)) {
        totalMcqs++;
      }

      if (!correctAnswers || userAnswer === undefined || userAnswer === null || userAnswer === '') {
        console.log(`Skipping question ${question.id} - no correct answer or user answer`);
        return;
      }

      let isCorrect = false;

      try {
        if (question.type === 'multiple_choice' || question.type === 'dropdown') {
          // For single choice questions, compare directly
          const correctAnswer = Array.isArray(correctAnswers) ? correctAnswers[0] : correctAnswers;
          isCorrect = String(userAnswer).trim() === String(correctAnswer).trim();
          console.log(`Single choice comparison: "${userAnswer}" === "${correctAnswer}" = ${isCorrect}`);
        } else if (question.type === 'checkbox') {
          // For multiple choice questions, compare arrays
          const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
          const correctAnswerArray = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
          
          console.log('Checkbox comparison:', {
            userAnswerArray,
            correctAnswerArray
          });
          
          // Sort both arrays and compare
          const sortedUserAnswers = userAnswerArray.sort();
          const sortedCorrectAnswers = correctAnswerArray.sort();
          
          isCorrect = sortedUserAnswers.length === sortedCorrectAnswers.length &&
            sortedUserAnswers.every((answer, index) => 
              String(answer).trim() === String(sortedCorrectAnswers[index]).trim()
            );
        } else if (question.type === 'rating' || question.type === 'number') {
          // For numeric questions
          const correctAnswer = Array.isArray(correctAnswers) ? correctAnswers[0] : correctAnswers;
          isCorrect = Number(userAnswer) === Number(correctAnswer);
          console.log(`Numeric comparison: ${Number(userAnswer)} === ${Number(correctAnswer)} = ${isCorrect}`);
        } else {
          // For text questions, case-insensitive comparison
          const correctAnswer = Array.isArray(correctAnswers) ? correctAnswers[0] : correctAnswers;
          isCorrect = String(userAnswer).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
          console.log(`Text comparison: "${userAnswer}" === "${correctAnswer}" = ${isCorrect}`);
        }

        if (isCorrect) {
          score += points;
          if (['multiple_choice', 'checkbox', 'dropdown'].includes(question.type)) {
            correctMcqs++;
          }
          console.log(`Question ${question.id} is CORRECT. Score += ${points}`);
        } else {
          console.log(`Question ${question.id} is INCORRECT`);
        }
      } catch (error) {
        console.error(`Error evaluating question ${question.id}:`, error);
      }
    });

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    
    console.log('Final scoring calculation:', {
      score,
      totalPoints,
      percentage,
      correctMcqs,
      totalMcqs,
      formConfig: {
        usePercentageCriteria: form?.use_percentage_criteria,
        useMcqCriteria: form?.use_mcq_criteria,
        passingScore: form?.passing_score,
        minCorrectMcqs: form?.min_correct_mcqs
      }
    });
    
    // Determine if student passed based on criteria
    let passed = false;
    
    if (form?.use_percentage_criteria && form?.use_mcq_criteria) {
      // Both criteria must be met
      const percentagePassed = percentage >= (form.passing_score || 60);
      const mcqPassed = correctMcqs >= (form.min_correct_mcqs || Math.ceil(totalMcqs / 2));
      passed = percentagePassed && mcqPassed;
      console.log('Dual criteria check:', { percentagePassed, mcqPassed, passed });
    } else if (form?.use_percentage_criteria) {
      // Only percentage criteria
      passed = percentage >= (form.passing_score || 60);
      console.log('Percentage criteria check:', { percentage, required: form.passing_score || 60, passed });
    } else if (form?.use_mcq_criteria) {
      // Only MCQ criteria
      passed = correctMcqs >= (form.min_correct_mcqs || Math.ceil(totalMcqs / 2));
      console.log('MCQ criteria check:', { correctMcqs, required: form.min_correct_mcqs || Math.ceil(totalMcqs / 2), passed });
    } else {
      // Default to percentage-based (60%)
      passed = percentage >= 60;
      console.log('Default criteria check:', { percentage, passed });
    }

    console.log('Final result:', { score, totalPoints, percentage, passed });

    return { score, totalPoints, percentage, passed };
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Your exam will be submitted automatically.",
      variant: "destructive",
    });
    handleSubmit();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form) return;

    // Show confirmation modal for quiz submissions (but not when time runs out)
    if (e && form.is_quiz && !submitting) {
      setShowConfirmModal(true);
      return;
    }

    setSubmitting(true);

    try {
      // Validate required fields
      const requiredQuestions = questions.filter(q => q.required);
      for (const question of requiredQuestions) {
        if (!formData[question.id] || (Array.isArray(formData[question.id]) && formData[question.id].length === 0)) {
          toast({
            title: "Required field missing",
            description: `Please answer: ${question.title}`,
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
      }

      // Create form response
      const formResponseData: TablesInsert<'form_responses'> = {
        form_id: form.id,
      };

      if (form.collect_email && email.trim()) {
        formResponseData.respondent_email = email.trim();
      }

      const { data: responseData, error: responseError } = await supabase
        .from('form_responses')
        .insert(formResponseData)
        .select()
        .single();

      if (responseError) throw responseError;

      // Create question responses
      const questionResponses = questions.map(question => ({
        form_response_id: responseData.id,
        question_id: question.id,
        answer: formData[question.id] || null
      }));

      const { error: questionsError } = await supabase
        .from('question_responses')
        .insert(questionResponses);

      if (questionsError) throw questionsError;

      // Handle quiz scoring
      if (form.is_quiz) {
        const result = calculateScore(formData);
        setExamResult(result);

        // Save quiz attempt
        const { error: attemptError } = await supabase
          .from('quiz_attempts')
          .insert({
            form_id: form.id,
            form_response_id: responseData.id,
            score: result.score,
            total_points: result.totalPoints,
            percentage: result.percentage,
            passed: result.passed,
            completed_at: new Date().toISOString()
          });

        if (attemptError) {
          console.error('Quiz attempt error:', attemptError);
        }

        setShowResultModal(true);
      } else {
        setSubmitted(true);
      }

      toast({
        title: "Success",
        description: form.is_quiz ? "Your exam has been submitted!" : "Your response has been submitted successfully!",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const getAnsweredQuestions = (): Set<string> => {
    return new Set(Object.keys(formData).filter(key => {
      const value = formData[key];
      return value !== undefined && value !== null && value !== '' && 
        (Array.isArray(value) ? value.length > 0 : true);
    }));
  };

  const getUnansweredCount = (): number => {
    const requiredQuestions = questions.filter(q => q.required);
    return requiredQuestions.filter(q => {
      const value = formData[q.id];
      return !value || (Array.isArray(value) && value.length === 0);
    }).length;
  };

  const handleRetake = () => {
    setFormData({});
    setEmail('');
    setSubmitted(false);
    setExamResult(null);
    setShowResultModal(false);
    setExamStarted(false);
    setCurrentQuestionIndex(1);
    
    toast({
      title: "Exam Reset",
      description: "You can now retake the exam.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Loading form...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your form</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 pt-16">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="mb-6">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Form ID</h1>
            <p className="text-gray-600 mb-6">This form doesn't exist or is not published.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted || showResultModal) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 pt-16">
          <Card className="w-full max-w-lg">
            <CardContent className="text-center py-12">
              <div className="animate-scale-in">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {form.custom_thank_you_message || 'Your response has been submitted successfully.'}
                </p>
                <div className="text-xs text-gray-500 mt-8 pt-6 border-t border-gray-200">
                  Powered by FormCraft
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {examResult && (
          <ExamResultModal
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            score={examResult.score}
            totalPoints={examResult.totalPoints}
            percentage={examResult.percentage}
            passed={examResult.passed}
            passingScore={form.passing_score || undefined}
            canRetake={form.allow_retake}
            onRetake={handleRetake}
          />
        )}
      </>
    );
  }

  // Exam start screen
  if (form.is_quiz && !examStarted) {
    const estimatedTime = Math.ceil(questions.length * 1.5); // 1.5 minutes per question estimate
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 pt-16">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              {form.title}
            </CardTitle>
            {form.description && (
              <p className="text-gray-600 text-xl leading-relaxed">{form.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5" />
                Exam Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Questions:</span> 
                  <span className="text-blue-600 font-semibold">{questions.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Total Points:</span> 
                  <span className="text-green-600 font-semibold">{form.total_points || questions.reduce((sum, q) => sum + (q.points || 1), 0)}</span>
                </div>
                {form.time_limit_minutes && (
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-gray-700">Time Limit:</span> 
                    <span className="text-orange-600 font-semibold">{form.time_limit_minutes} minutes</span>
                  </div>
                )}
                {form.passing_score && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Passing Score:</span> 
                    <span className="text-purple-600 font-semibold">{form.passing_score}%</span>
                  </div>
                )}
                <div className="flex items-center gap-2 col-span-full">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Estimated Time:</span> 
                  <span className="text-gray-600 font-semibold">{estimatedTime} minutes</span>
                </div>
              </div>
            </div>

            {form.collect_email && (
              <div className="space-y-3">
                <Label htmlFor="email" className="flex items-center gap-2 text-lg font-medium">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="py-3 px-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <h4 className="font-semibold text-amber-800 mb-3 text-lg">📋 Important Instructions</h4>
              <ul className="text-amber-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Read each question carefully before answering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>You can navigate between questions, but cannot change answers after submission</span>
                </li>
                {form.time_limit_minutes && (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Your exam will auto-submit when time runs out</span>
                  </li>
                )}
                {!form.allow_retake && (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>You only have one attempt for this exam</span>
                  </li>
                )}
              </ul>
            </div>

            <Button 
              onClick={() => setExamStarted(true)}
              className="w-full py-4 text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
            >
              🚀 Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const answeredQuestions = getAnsweredQuestions();
  const unansweredCount = getUnansweredCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      {/* Timer for quizzes */}
      {form.is_quiz && form.time_limit_minutes && examStarted && (
        <ExamTimer
          timeLimitMinutes={form.time_limit_minutes}
          onTimeUp={handleTimeUp}
          isActive={!submitted && !submitting}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              {form.is_quiz ? (
                <>
                  <FileText className="h-8 w-8" />
                  {form.title}
                </>
              ) : (
                form.title
              )}
            </CardTitle>
            {form.description && (
              <p className="text-blue-100 mt-3 text-lg leading-relaxed">{form.description}</p>
            )}
          </CardHeader>
          <CardContent className="p-8">
            {/* Progress indicator for quizzes */}
            {form.is_quiz && (
              <div className="mb-8">
                <ExamProgressIndicator
                  currentQuestion={currentQuestionIndex}
                  totalQuestions={questions.length}
                  answeredQuestions={answeredQuestions}
                  questionIds={questions.map(q => q.id)}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {form.collect_email && !form.is_quiz && (
                <div className="space-y-3 bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <Label htmlFor="email" className="flex items-center gap-2 text-lg font-medium text-blue-900">
                    <Mail className="h-5 w-5" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="py-3 px-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="animate-fade-in">
                    <ExamQuestion
                      question={question}
                      questionNumber={index + 1}
                      totalQuestions={questions.length}
                      value={formData[question.id]}
                      onChange={(value) => handleInputChange(question.id, value)}
                      disabled={submitted}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-8 space-y-4">
                <Button 
                  type="submit" 
                  className="w-full py-4 text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl" 
                  disabled={submitting}
                  size="lg"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </div>
                  ) : (
                    `✨ ${form.is_quiz ? 'Submit Exam' : 'Submit Response'}`
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <p>Secured and powered by FormCraft</p>
                  <p className="mt-1">Estimated time: {Math.ceil(questions.length * 1.5)} minutes</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ConfirmSubmitModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleSubmit()}
        unansweredCount={unansweredCount}
        isSubmitting={submitting}
      />

      {examResult && (
        <ExamResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          score={examResult.score}
          totalPoints={examResult.totalPoints}
          percentage={examResult.percentage}
          passed={examResult.passed}
          passingScore={form.passing_score || undefined}
          canRetake={form.allow_retake}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}
