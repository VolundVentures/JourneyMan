export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      agent_events: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string;
          task_id: string | null;
          event_type: string;
          content: string;
          confidence: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id: string;
          task_id?: string | null;
          event_type: string;
          content: string;
          confidence?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string;
          task_id?: string | null;
          event_type?: string;
          content?: string;
          confidence?: number | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      agent_sessions: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string;
          task_id: string | null;
          sdk_session_id: string | null;
          status: string;
          started_at: string;
          completed_at: string | null;
          total_cost_usd: number;
          turns_used: number;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id: string;
          task_id?: string | null;
          sdk_session_id?: string | null;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          total_cost_usd?: number;
          turns_used?: number;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string;
          task_id?: string | null;
          sdk_session_id?: string | null;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          total_cost_usd?: number;
          turns_used?: number;
        };
      };
      episodic_memories: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string;
          event_type: string;
          content: string;
          significance_score: number;
          source_ref: Json | null;
          metadata: Json;
          is_archived: boolean;
          task_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id: string;
          event_type: string;
          content: string;
          significance_score?: number;
          source_ref?: Json | null;
          metadata?: Json;
          is_archived?: boolean;
          task_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string;
          event_type?: string;
          content?: string;
          significance_score?: number;
          source_ref?: Json | null;
          metadata?: Json;
          is_archived?: boolean;
          task_id?: string | null;
          created_at?: string;
        };
      };
      institutional_memories: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string | null;
          category: string;
          subject: string;
          content: string;
          confidence: number;
          source_count: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id?: string | null;
          category: string;
          subject: string;
          content: string;
          confidence?: number;
          source_count?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string | null;
          category?: string;
          subject?: string;
          content?: string;
          confidence?: number;
          source_count?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          plan?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          plan?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          org_id: string | null;
          email: string;
          name: string | null;
          role: string;
          avatar_url: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          org_id?: string | null;
          email: string;
          name?: string | null;
          role?: string;
          avatar_url?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string | null;
          email?: string;
          name?: string | null;
          role?: string;
          avatar_url?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          role_title: string;
          role_template_id: string | null;
          department: string;
          reports_to: string | null;
          reports_to_name: string | null;
          status: string;
          email_address: string | null;
          phone_number: string | null;
          slack_user_id: string | null;
          config: Json;
          autonomy_score: number;
          tasks_completed: number;
          escalation_rate: number;
          hired_at: string;
          onboarded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          role_title: string;
          role_template_id?: string | null;
          department: string;
          reports_to?: string | null;
          reports_to_name?: string | null;
          status?: string;
          email_address?: string | null;
          phone_number?: string | null;
          slack_user_id?: string | null;
          config?: Json;
          autonomy_score?: number;
          tasks_completed?: number;
          escalation_rate?: number;
          hired_at?: string;
          onboarded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          role_title?: string;
          role_template_id?: string | null;
          department?: string;
          reports_to?: string | null;
          reports_to_name?: string | null;
          status?: string;
          email_address?: string | null;
          phone_number?: string | null;
          slack_user_id?: string | null;
          config?: Json;
          autonomy_score?: number;
          tasks_completed?: number;
          escalation_rate?: number;
          hired_at?: string;
          onboarded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string;
          title: string;
          description: string | null;
          source: string;
          status: string;
          priority: number;
          confidence_score: number | null;
          plan: Json | null;
          result: Json | null;
          assigned_by: string | null;
          assigned_by_name: string | null;
          due_at: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id: string;
          title: string;
          description?: string | null;
          source?: string;
          status?: string;
          priority?: number;
          confidence_score?: number | null;
          plan?: Json | null;
          result?: Json | null;
          assigned_by?: string | null;
          assigned_by_name?: string | null;
          due_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string;
          title?: string;
          description?: string | null;
          source?: string;
          status?: string;
          priority?: number;
          confidence_score?: number | null;
          plan?: Json | null;
          result?: Json | null;
          assigned_by?: string | null;
          assigned_by_name?: string | null;
          due_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      approvals: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string;
          employee_name: string | null;
          employee_role: string | null;
          task_id: string | null;
          action_type: string;
          proposed_action: Json;
          reasoning: string;
          confidence_score: number;
          context: Json | null;
          status: string;
          resolved_by: string | null;
          resolution_feedback: string | null;
          resolved_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id: string;
          employee_name?: string | null;
          employee_role?: string | null;
          task_id?: string | null;
          action_type: string;
          proposed_action?: Json;
          reasoning: string;
          confidence_score: number;
          context?: Json | null;
          status?: string;
          resolved_by?: string | null;
          resolution_feedback?: string | null;
          resolved_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string;
          employee_name?: string | null;
          employee_role?: string | null;
          task_id?: string | null;
          action_type?: string;
          proposed_action?: Json;
          reasoning?: string;
          confidence_score?: number;
          context?: Json | null;
          status?: string;
          resolved_by?: string | null;
          resolution_feedback?: string | null;
          resolved_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      escalations: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string;
          employee_name: string | null;
          employee_role: string | null;
          task_id: string | null;
          reason: string;
          context: Json;
          recommendation: string | null;
          urgency: string;
          status: string;
          resolved_by: string | null;
          resolution: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id: string;
          employee_name?: string | null;
          employee_role?: string | null;
          task_id?: string | null;
          reason: string;
          context?: Json;
          recommendation?: string | null;
          urgency?: string;
          status?: string;
          resolved_by?: string | null;
          resolution?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string;
          employee_name?: string | null;
          employee_role?: string | null;
          task_id?: string | null;
          reason?: string;
          context?: Json;
          recommendation?: string | null;
          urgency?: string;
          status?: string;
          resolved_by?: string | null;
          resolution?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string;
          channel: string;
          direction: string;
          thread_id: string | null;
          from_address: string | null;
          to_address: string | null;
          subject: string | null;
          body: string;
          metadata: Json;
          task_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id: string;
          channel: string;
          direction: string;
          thread_id?: string | null;
          from_address?: string | null;
          to_address?: string | null;
          subject?: string | null;
          body: string;
          metadata?: Json;
          task_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string;
          channel?: string;
          direction?: string;
          thread_id?: string | null;
          from_address?: string | null;
          to_address?: string | null;
          subject?: string | null;
          body?: string;
          metadata?: Json;
          task_id?: string | null;
          created_at?: string;
        };
      };
      knowledge_items: {
        Row: {
          id: string;
          org_id: string;
          source_type: string;
          source_ref: string | null;
          title: string;
          content: string;
          content_hash: string;
          chunk_index: number;
          metadata: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          source_type: string;
          source_ref?: string | null;
          title: string;
          content: string;
          content_hash: string;
          chunk_index?: number;
          metadata?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          source_type?: string;
          source_ref?: string | null;
          title?: string;
          content?: string;
          content_hash?: string;
          chunk_index?: number;
          metadata?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          org_id: string;
          employee_id: string | null;
          provider: string;
          scopes: Json;
          status: string;
          last_synced_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          employee_id?: string | null;
          provider: string;
          scopes?: Json;
          status?: string;
          last_synced_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          employee_id?: string | null;
          provider?: string;
          scopes?: Json;
          status?: string;
          last_synced_at?: string | null;
          created_at?: string;
        };
      };
      handoffs: {
        Row: {
          id: string;
          org_id: string;
          task_id: string;
          from_employee_id: string;
          from_employee_name: string;
          to_employee_id: string;
          to_employee_name: string;
          reason: string;
          context_package: Json;
          status: string;
          approved_by: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          org_id: string;
          task_id: string;
          from_employee_id: string;
          from_employee_name: string;
          to_employee_id: string;
          to_employee_name: string;
          reason: string;
          context_package?: Json;
          status?: string;
          approved_by?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          org_id?: string;
          task_id?: string;
          from_employee_id?: string;
          from_employee_name?: string;
          to_employee_id?: string;
          to_employee_name?: string;
          reason?: string;
          context_package?: Json;
          status?: string;
          approved_by?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      contacts: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          company: string | null;
          company_id: string | null;
          title: string | null;
          labels: Json;
          interaction_count: number;
          last_interaction_at: string | null;
          sentiment_score: number | null;
          assigned_employee_ids: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          company_id?: string | null;
          title?: string | null;
          labels?: Json;
          interaction_count?: number;
          last_interaction_at?: string | null;
          sentiment_score?: number | null;
          assigned_employee_ids?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          company_id?: string | null;
          title?: string | null;
          labels?: Json;
          interaction_count?: number;
          last_interaction_at?: string | null;
          sentiment_score?: number | null;
          assigned_employee_ids?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          domain: string | null;
          industry: string | null;
          size: string | null;
          contact_ids: Json;
          deal_value: number | null;
          stage: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          domain?: string | null;
          industry?: string | null;
          size?: string | null;
          contact_ids?: Json;
          deal_value?: number | null;
          stage?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          domain?: string | null;
          industry?: string | null;
          size?: string | null;
          contact_ids?: Json;
          deal_value?: number | null;
          stage?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          org_id: string;
          actor_type: string;
          actor_id: string;
          actor_name: string;
          action: string;
          resource_type: string;
          resource_id: string;
          resource_name: string | null;
          details: Json;
          previous_state: Json | null;
          new_state: Json | null;
          ip_address: string | null;
          severity: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          actor_type: string;
          actor_id: string;
          actor_name: string;
          action: string;
          resource_type: string;
          resource_id: string;
          resource_name?: string | null;
          details?: Json;
          previous_state?: Json | null;
          new_state?: Json | null;
          ip_address?: string | null;
          severity?: string;
          timestamp?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          actor_type?: string;
          actor_id?: string;
          actor_name?: string;
          action?: string;
          resource_type?: string;
          resource_id?: string;
          resource_name?: string | null;
          details?: Json;
          previous_state?: Json | null;
          new_state?: Json | null;
          ip_address?: string | null;
          severity?: string;
          timestamp?: string;
        };
      };
    };
  };
}
