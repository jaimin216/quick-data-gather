
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
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = (responses: FormData): ExamResult => {
    let score = 0;
    let totalPoints = 0;

    questions.forEach(question => {
      const points = question.points || 1;
      totalPoints += points;

      const userAnswer = responses[question.id];
      const correctAnswers = question.correct_answers as string[] | string | null;

      if (!correctAnswers || !userAnswer) return;

      let isCorrect = false;

      if (question.type === 'multiple_choice' || question.type === 'dropdown') {
        isCorrect = userAnswer === correctAnswers;
      } else if (question.type === 'checkbox') {
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        const correctAnswerArray = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
        isCorrect = userAnswerArray.length === correctAnswerArray.length &&
          userAnswerArray.every(answer => correctAnswerArray.includes(answer));
      } else if (question.type === 'rating' || question.type === 'number') {
        isCorrect = Number(userAnswer) === Number(correctAnswers);
      } else {
        isCorrect = String(userAnswer).toLowerCase().trim() === String(correctAnswers).toLowerCase().trim();
      }

      if (isCorrect) {
        score += points;
      }
    });

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = form?.passing_score ? percentage >= form.passing_score : percentage >= 60;

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

    // Skip confirmation modal if time is up
    if (e && form.is_quiz) {
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
            <p className="text-gray-600">This form doesn't exist or is not published.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted || showResultModal) {
    return (
      <>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
              <p className="text-gray-600 mb-6">
                {form.custom_thank_you_message || 'Your response has been submitted successfully.'}
              </p>
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
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {form.title}
            </CardTitle>
            {form.description && (
              <p className="text-gray-600 text-lg">{form.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Exam Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Questions:</span> {questions.length}
                </div>
                <div>
                  <span className="font-medium">Total Points:</span> {form.total_points || questions.reduce((sum, q) => sum + (q.points || 1), 0)}
                </div>
                {form.time_limit_minutes && (
                  <div className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    <span className="font-medium">Time Limit:</span> {form.time_limit_minutes} minutes
                  </div>
                )}
                {form.passing_score && (
                  <div>
                    <span className="font-medium">Passing Score:</span> {form.passing_score}%
                  </div>
                )}
              </div>
            </div>

            {form.collect_email && (
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">Important Instructions:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Read each question carefully before answering</li>
                <li>• You can navigate between questions, but cannot change answers after submission</li>
                {form.time_limit_minutes && <li>• Your exam will auto-submit when time runs out</li>}
                {!form.allow_retake && <li>• You only have one attempt for this exam</li>}
              </ul>
            </div>

            <Button 
              onClick={() => setExamStarted(true)}
              className="w-full py-3 text-lg font-semibold"
              size="lg"
            >
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const answeredQuestions = getAnsweredQuestions();
  const unansweredCount = getUnansweredCount();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Timer for quizzes */}
      {form.is_quiz && form.time_limit_minutes && examStarted && (
        <ExamTimer
          timeLimitMinutes={form.time_limit_minutes}
          onTimeUp={handleTimeUp}
          isActive={!submitted && !submitting}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            {form.is_quiz ? (
              <>
                <FileText className="h-6 w-6 text-blue-600" />
                {form.title}
              </>
            ) : (
              form.title
            )}
          </CardTitle>
          {form.description && (
            <p className="text-gray-600 mt-2">{form.description}</p>
          )}
        </CardHeader>
        <CardContent>
          {/* Progress indicator for quizzes */}
          {form.is_quiz && (
            <ExamProgressIndicator
              currentQuestion={currentQuestionIndex}
              totalQuestions={questions.length}
              answeredQuestions={answeredQuestions}
              questionIds={questions.map(q => q.id)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.collect_email && !form.is_quiz && (
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {questions.map((question, index) => (
              <ExamQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                totalQuestions={questions.length}
                value={formData[question.id]}
                onChange={(value) => handleInputChange(question.id, value)}
                disabled={submitted}
              />
            ))}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                type="submit" 
                className="flex-1 py-3 text-lg font-semibold" 
                disabled={submitting}
                size="lg"
              >
                {submitting ? 'Submitting...' : form.is_quiz ? 'Submit Exam' : 'Submit Response'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
