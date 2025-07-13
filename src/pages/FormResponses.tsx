
import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Calendar, Mail, User } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Form = Tables<'forms'>;
type Question = Tables<'questions'>;
type FormResponse = Tables<'form_responses'>;
type QuestionResponse = Tables<'question_responses'>;

interface FormResponseWithAnswers extends FormResponse {
  answers: { [questionId: string]: any };
}

export default function FormResponses() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [form, setForm] = useState<Form | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<FormResponseWithAnswers[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      loadFormData();
    }
  }, [user, id]);

  const loadFormData = async () => {
    if (!id) return;

    try {
      // Load form details
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
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

      // Load form responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('form_responses')
        .select('*')
        .eq('form_id', id)
        .order('submitted_at', { ascending: false });

      if (responsesError) throw responsesError;

      // Load question responses for each form response
      const responsesWithAnswers: FormResponseWithAnswers[] = [];
      
      for (const response of responsesData) {
        const { data: questionResponsesData, error: questionResponsesError } = await supabase
          .from('question_responses')
          .select('*')
          .eq('form_response_id', response.id);

        if (questionResponsesError) throw questionResponsesError;

        const answers: { [questionId: string]: any } = {};
        questionResponsesData.forEach((qr: QuestionResponse) => {
          answers[qr.question_id] = qr.answer;
        });

        responsesWithAnswers.push({
          ...response,
          answers
        });
      }

      setResponses(responsesWithAnswers);
    } catch (error) {
      console.error('Error loading form data:', error);
      toast({
        title: "Error",
        description: "Failed to load form responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const formatAnswer = (question: Question, answer: any) => {
    if (!answer) return 'No response';

    switch (question.type) {
      case 'checkbox':
        return Array.isArray(answer) ? answer.join(', ') : answer;
      case 'rating':
        return `${answer} / 5`;
      case 'date':
        return new Date(answer).toLocaleDateString();
      default:
        return answer.toString();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (dataLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading form data...</div>;
  }

  if (!form) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
            <p className="text-gray-600">This form doesn't exist or you don't have permission to view it.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{form.title} - Responses</h1>
          <p className="text-gray-600 mt-1">
            {responses.length} response{responses.length !== 1 ? 's' : ''} received
          </p>
        </div>
      </div>

      {responses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No responses yet</h3>
            <p className="text-gray-600 mb-6">
              Share your form to start collecting responses.
            </p>
            <Link to={`/forms/${id}/view`}>
              <Button>View Form</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Response Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{responses.length}</div>
                  <div className="text-sm text-gray-600">Total Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {responses.filter(r => r.respondent_email).length}
                  </div>
                  <div className="text-sm text-gray-600">With Email</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {responses.filter(r => !r.respondent_email).length}
                  </div>
                  <div className="text-sm text-gray-600">Anonymous</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responses Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      {form.collect_email && <TableHead>Email</TableHead>}
                      {questions.map((question) => (
                        <TableHead key={question.id} className="min-w-[150px]">
                          {question.title}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {new Date(response.submitted_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        {form.collect_email && (
                          <TableCell>
                            {response.respondent_email ? (
                              <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                {response.respondent_email}
                              </div>
                            ) : (
                              <Badge variant="secondary">Anonymous</Badge>
                            )}
                          </TableCell>
                        )}
                        {questions.map((question) => (
                          <TableCell key={question.id} className="max-w-[200px]">
                            <div className="truncate" title={formatAnswer(question, response.answers[question.id])}>
                              {formatAnswer(question, response.answers[question.id])}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
