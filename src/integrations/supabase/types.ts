export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      form_responses: {
        Row: {
          form_id: string
          id: string
          ip_address: unknown | null
          respondent_email: string | null
          respondent_id: string | null
          submitted_at: string
          user_agent: string | null
        }
        Insert: {
          form_id: string
          id?: string
          ip_address?: unknown | null
          respondent_email?: string | null
          respondent_id?: string | null
          submitted_at?: string
          user_agent?: string | null
        }
        Update: {
          form_id?: string
          id?: string
          ip_address?: unknown | null
          respondent_email?: string | null
          respondent_id?: string | null
          submitted_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          allow_anonymous: boolean
          allow_retake: boolean | null
          auto_save_enabled: boolean | null
          collect_email: boolean
          created_at: string
          custom_thank_you_message: string | null
          description: string | null
          id: string
          is_quiz: boolean | null
          min_correct_mcqs: number | null
          passing_score: number | null
          require_login: boolean
          show_results: boolean | null
          status: Database["public"]["Enums"]["form_status"]
          time_limit_minutes: number | null
          title: string
          total_mcqs: number | null
          total_points: number | null
          updated_at: string
          use_mcq_criteria: boolean | null
          use_percentage_criteria: boolean | null
          user_id: string
        }
        Insert: {
          allow_anonymous?: boolean
          allow_retake?: boolean | null
          auto_save_enabled?: boolean | null
          collect_email?: boolean
          created_at?: string
          custom_thank_you_message?: string | null
          description?: string | null
          id?: string
          is_quiz?: boolean | null
          min_correct_mcqs?: number | null
          passing_score?: number | null
          require_login?: boolean
          show_results?: boolean | null
          status?: Database["public"]["Enums"]["form_status"]
          time_limit_minutes?: number | null
          title: string
          total_mcqs?: number | null
          total_points?: number | null
          updated_at?: string
          use_mcq_criteria?: boolean | null
          use_percentage_criteria?: boolean | null
          user_id: string
        }
        Update: {
          allow_anonymous?: boolean
          allow_retake?: boolean | null
          auto_save_enabled?: boolean | null
          collect_email?: boolean
          created_at?: string
          custom_thank_you_message?: string | null
          description?: string | null
          id?: string
          is_quiz?: boolean | null
          min_correct_mcqs?: number | null
          passing_score?: number | null
          require_login?: boolean
          show_results?: boolean | null
          status?: Database["public"]["Enums"]["form_status"]
          time_limit_minutes?: number | null
          title?: string
          total_mcqs?: number | null
          total_points?: number | null
          updated_at?: string
          use_mcq_criteria?: boolean | null
          use_percentage_criteria?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      question_responses: {
        Row: {
          answer: Json
          created_at: string
          form_response_id: string
          id: string
          question_id: string
        }
        Insert: {
          answer: Json
          created_at?: string
          form_response_id: string
          id?: string
          question_id: string
        }
        Update: {
          answer?: Json
          created_at?: string
          form_response_id?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_responses_form_response_id_fkey"
            columns: ["form_response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answers: Json | null
          created_at: string
          description: string | null
          explanation: string | null
          form_id: string
          id: string
          options: Json | null
          order_index: number
          points: number | null
          required: boolean
          title: string
          type: Database["public"]["Enums"]["question_type"]
          validation_rules: Json | null
        }
        Insert: {
          correct_answers?: Json | null
          created_at?: string
          description?: string | null
          explanation?: string | null
          form_id: string
          id?: string
          options?: Json | null
          order_index: number
          points?: number | null
          required?: boolean
          title: string
          type: Database["public"]["Enums"]["question_type"]
          validation_rules?: Json | null
        }
        Update: {
          correct_answers?: Json | null
          created_at?: string
          description?: string | null
          explanation?: string | null
          form_id?: string
          id?: string
          options?: Json | null
          order_index?: number
          points?: number | null
          required?: boolean
          title?: string
          type?: Database["public"]["Enums"]["question_type"]
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          completed_at: string | null
          created_at: string
          form_id: string
          form_response_id: string
          id: string
          passed: boolean
          percentage: number
          score: number
          started_at: string
          time_taken_seconds: number | null
          total_points: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          form_id: string
          form_response_id: string
          id?: string
          passed?: boolean
          percentage?: number
          score?: number
          started_at?: string
          time_taken_seconds?: number | null
          total_points?: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          form_id?: string
          form_response_id?: string
          id?: string
          passed?: boolean
          percentage?: number
          score?: number
          started_at?: string
          time_taken_seconds?: number | null
          total_points?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_form_response_id_fkey"
            columns: ["form_response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      form_status: "draft" | "published" | "closed"
      question_type:
        | "text"
        | "textarea"
        | "multiple_choice"
        | "checkbox"
        | "dropdown"
        | "number"
        | "email"
        | "date"
        | "rating"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      form_status: ["draft", "published", "closed"],
      question_type: [
        "text",
        "textarea",
        "multiple_choice",
        "checkbox",
        "dropdown",
        "number",
        "email",
        "date",
        "rating",
      ],
    },
  },
} as const
