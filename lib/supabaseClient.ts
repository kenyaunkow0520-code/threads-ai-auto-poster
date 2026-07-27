import { createClient } from '@supabase/supabase-js';

// Supabaseに接続するための共通クライアント
// URLと公開キーはNetlifyの環境変数から読み込む（コードには書かない）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
