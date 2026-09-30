export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      events: {
        Row: {
          contact_1_name: string | null;
          contact_1_phone: string | null;
          contact_2_name: string | null;
          contact_2_phone: string | null;
          cover_image_path: string | null;
          created_at: string;
          details: Json;
          display_names: string | null;
          event_date: string | null;
          event_type: string;
          hashtag: string | null;
          id: string;
          music_path: string | null;
          rsvp_deadline: string | null;
          slug: string;
          template: string;
        };
        Insert: {
          contact_1_name?: string | null;
          contact_1_phone?: string | null;
          contact_2_name?: string | null;
          contact_2_phone?: string | null;
          cover_image_path?: string | null;
          created_at?: string;
          details?: Json;
          display_names?: string | null;
          event_date?: string | null;
          event_type?: string;
          hashtag?: string | null;
          id?: string;
          music_path?: string | null;
          rsvp_deadline?: string | null;
          slug: string;
          template?: string;
        };
        Update: {
          contact_1_name?: string | null;
          contact_1_phone?: string | null;
          contact_2_name?: string | null;
          contact_2_phone?: string | null;
          cover_image_path?: string | null;
          created_at?: string;
          details?: Json;
          display_names?: string | null;
          event_date?: string | null;
          event_type?: string;
          hashtag?: string | null;
          id?: string;
          music_path?: string | null;
          rsvp_deadline?: string | null;
          slug?: string;
          template?: string;
        };
        Relationships: [];
      };
      event_media: {
        Row: {
          id: string;
          event_id: string;
          slot: string;
          media_type: string;
          storage_path: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          slot: string;
          media_type?: string;
          storage_path: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          slot?: string;
          media_type?: string;
          storage_path?: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_media_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      gallery: {
        Row: {
          caption: string | null;
          created_at: string;
          event_id: string;
          id: string;
          image_path: string;
          media_type: string;
          sort_order: number;
        };
        Insert: {
          caption?: string | null;
          created_at?: string;
          event_id: string;
          id?: string;
          image_path: string;
          media_type?: string;
          sort_order?: number;
        };
        Update: {
          caption?: string | null;
          created_at?: string;
          event_id?: string;
          id?: string;
          image_path?: string;
          media_type?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "gallery_wedding_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      gifts: {
        Row: {
          created_at: string;
          description: string | null;
          event_id: string;
          id: string;
          image_path: string | null;
          link_or_info: string | null;
          sort_order: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          event_id: string;
          id?: string;
          image_path?: string | null;
          link_or_info?: string | null;
          sort_order?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          event_id?: string;
          id?: string;
          image_path?: string | null;
          link_or_info?: string | null;
          sort_order?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gifts_wedding_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      couple_access_tokens: {
        Row: {
          created_at: string;
          event_id: string;
          token: string;
        };
        Insert: {
          created_at?: string;
          event_id: string;
          token?: string;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          token?: string;
        };
        Relationships: [
          {
            foreignKeyName: "couple_access_tokens_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: true;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      guestbook: {
        Row: {
          created_at: string;
          event_id: string;
          id: string;
          message: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          event_id: string;
          id?: string;
          message: string;
          name: string;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          id?: string;
          message?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "guestbook_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      guests: {
        Row: {
          created_at: string;
          event_id: string;
          phone: string | null;
          invite_type: string;
          table_label: string | null;
          id: string;
          invited_count: number;
          name: string;
          rsvp_status: string;
          token: string;
        };
        Insert: {
          created_at?: string;
          event_id: string;
          id?: string;
          invited_count?: number;
          name: string;
          rsvp_status?: string;
          token?: string;
          phone?: string | null;
          invite_type?: string;
          table_label?: string | null;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          id?: string;
          invited_count?: number;
          name?: string;
          rsvp_status?: string;
          token?: string;
          phone?: string | null;
          invite_type?: string;
          table_label?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      rsvps: {
        Row: {
          attending: boolean;
          created_at: string;
          event_id: string;
          guest_count: number;
          guest_name: string;
          guest_phone: string | null;
          id: string;
          message: string | null;
        };
        Insert: {
          attending?: boolean;
          created_at?: string;
          event_id: string;
          guest_count?: number;
          guest_name: string;
          guest_phone?: string | null;
          id?: string;
          message?: string | null;
        };
        Update: {
          attending?: boolean;
          created_at?: string;
          event_id?: string;
          guest_count?: number;
          guest_name?: string;
          guest_phone?: string | null;
          id?: string;
          message?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rsvps_wedding_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      schedule: {
        Row: {
          created_at: string;
          description: string | null;
          event_id: string;
          id: string;
          sort_order: number;
          time_label: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          event_id: string;
          id?: string;
          sort_order?: number;
          time_label?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          event_id?: string;
          id?: string;
          sort_order?: number;
          time_label?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_wedding_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_couple_rsvps: {
        Args: {
          _token: string;
        };
        Returns: Database["public"]["Tables"]["rsvps"]["Row"][];
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
