export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_path: string
          sort_order: number
          wedding_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_path: string
          sort_order?: number
          wedding_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_path?: string
          sort_order?: number
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          link_or_info: string | null
          sort_order: number
          title: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          link_or_info?: string | null
          sort_order?: number
          title: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          link_or_info?: string | null
          sort_order?: number
          title?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gifts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          attending: boolean
          created_at: string
          guest_count: number
          guest_name: string
          guest_phone: string | null
          id: string
          message: string | null
          wedding_id: string
        }
        Insert: {
          attending?: boolean
          created_at?: string
          guest_count?: number
          guest_name: string
          guest_phone?: string | null
          id?: string
          message?: string | null
          wedding_id: string
        }
        Update: {
          attending?: boolean
          created_at?: string
          guest_count?: number
          guest_name?: string
          guest_phone?: string | null
          id?: string
          message?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule: {
        Row: {
          created_at: string
          description: string | null
          id: string
          sort_order: number
          time_label: string | null
          title: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          time_label?: string | null
          title: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          time_label?: string | null
          title?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weddings: {
        Row: {
          bank_account: string | null
          bank_holder: string | null
          bank_name: string | null
          bank_nib: string | null
          bride_father_name: string | null
          bride_mother_name: string | null
          bride_name: string | null
          ceremony_address: string | null
          ceremony_time: string | null
          ceremony_venue: string | null
          civil_ceremony_address: string | null
          civil_ceremony_time: string | null
          civil_ceremony_venue: string | null
          contact_1_name: string | null
          contact_1_phone: string | null
          contact_2_name: string | null
          contact_2_phone: string | null
          cover_image_path: string | null
          created_at: string
          display_names: string | null
          groom_father_name: string | null
          groom_mother_name: string | null
          groom_name: string | null
          hashtag: string | null
          id: string
          music_path: string | null
          reception_address: string | null
          reception_time: string | null
          reception_venue: string | null
          rsvp_deadline: string | null
          slug: string
          template: string
          verse_2_reference: string | null
          verse_2_text: string | null
          verse_reference: string | null
          verse_text: string | null
          wedding_date: string | null
        }
        Insert: {
          bank_account?: string | null
          bank_holder?: string | null
          bank_name?: string | null
          bank_nib?: string | null
          bride_father_name?: string | null
          bride_mother_name?: string | null
          bride_name?: string | null
          ceremony_address?: string | null
          ceremony_time?: string | null
          ceremony_venue?: string | null
          civil_ceremony_address?: string | null
          civil_ceremony_time?: string | null
          civil_ceremony_venue?: string | null
          contact_1_name?: string | null
          contact_1_phone?: string | null
          contact_2_name?: string | null
          contact_2_phone?: string | null
          cover_image_path?: string | null
          created_at?: string
          display_names?: string | null
          groom_father_name?: string | null
          groom_mother_name?: string | null
          groom_name?: string | null
          hashtag?: string | null
          id?: string
          music_path?: string | null
          reception_address?: string | null
          reception_time?: string | null
          reception_venue?: string | null
          rsvp_deadline?: string | null
          slug: string
          template?: string
          verse_2_reference?: string | null
          verse_2_text?: string | null
          verse_reference?: string | null
          verse_text?: string | null
          wedding_date?: string | null
        }
        Update: {
          bank_account?: string | null
          bank_holder?: string | null
          bank_name?: string | null
          bank_nib?: string | null
          bride_father_name?: string | null
          bride_mother_name?: string | null
          bride_name?: string | null
          ceremony_address?: string | null
          ceremony_time?: string | null
          ceremony_venue?: string | null
          civil_ceremony_address?: string | null
          civil_ceremony_time?: string | null
          civil_ceremony_venue?: string | null
          contact_1_name?: string | null
          contact_1_phone?: string | null
          contact_2_name?: string | null
          contact_2_phone?: string | null
          cover_image_path?: string | null
          created_at?: string
          display_names?: string | null
          groom_father_name?: string | null
          groom_mother_name?: string | null
          groom_name?: string | null
          hashtag?: string | null
          id?: string
          music_path?: string | null
          reception_address?: string | null
          reception_time?: string | null
          reception_venue?: string | null
          rsvp_deadline?: string | null
          slug?: string
          template?: string
          verse_2_reference?: string | null
          verse_2_text?: string | null
          verse_reference?: string | null
          verse_text?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
