-- 親友AI性格診断 - Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CHARACTERS TABLE (16 MBTI personalities)
-- ============================================
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mbti_type VARCHAR(4) NOT NULL UNIQUE, -- INTJ, ENFP, etc.
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  personality_traits JSONB NOT NULL, -- {"openness": 85, "conscientiousness": 70, ...}
  conversation_style TEXT NOT NULL, -- How this character talks
  emoji VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast MBTI lookup
CREATE INDEX idx_characters_mbti ON public.characters(mbti_type);

-- ============================================
-- 2. PERSONALITY TESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.personality_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES public.characters(id),
  mbti_type VARCHAR(4) NOT NULL,
  answers JSONB NOT NULL, -- Array of 60 answers
  scores JSONB NOT NULL, -- {"E": 65, "I": 35, "S": 45, "N": 55, ...}
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_personality_tests_user ON public.personality_tests(user_id);
CREATE INDEX idx_personality_tests_mbti ON public.personality_tests(mbti_type);
CREATE INDEX idx_personality_tests_created ON public.personality_tests(created_at DESC);

-- ============================================
-- 3. CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES public.characters(id),
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  sentiment_score FLOAT, -- -1.0 to 1.0 (negative to positive)
  metadata JSONB, -- Additional context
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_user ON public.conversations(user_id);
CREATE INDEX idx_conversations_created ON public.conversations(created_at DESC);
CREATE INDEX idx_conversations_user_created ON public.conversations(user_id, created_at DESC);

-- ============================================
-- 4. SNS INTEGRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.sns_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'twitter', 'instagram', etc.
  platform_user_id VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Index
CREATE INDEX idx_sns_integrations_user ON public.sns_integrations(user_id);
CREATE INDEX idx_sns_integrations_active ON public.sns_integrations(user_id, is_active);

-- ============================================
-- 5. SNS POSTS MONITOR TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.sns_posts_monitor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES public.sns_integrations(id) ON DELETE CASCADE,
  post_id VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  content TEXT,
  sentiment_score FLOAT, -- -1.0 to 1.0
  sentiment_label VARCHAR(20), -- 'positive', 'neutral', 'negative', 'concerning'
  trigger_alert BOOLEAN DEFAULT false, -- Should AI reach out?
  ai_responded BOOLEAN DEFAULT false,
  post_created_at TIMESTAMPTZ,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sns_posts_user ON public.sns_posts_monitor(user_id);
CREATE INDEX idx_sns_posts_trigger ON public.sns_posts_monitor(user_id, trigger_alert, ai_responded);
CREATE INDEX idx_sns_posts_created ON public.sns_posts_monitor(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sns_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sns_posts_monitor ENABLE ROW LEVEL SECURITY;

-- Characters: Public read access
CREATE POLICY "Characters are viewable by everyone"
  ON public.characters FOR SELECT
  USING (true);

-- Personality Tests: Users can only access their own tests
CREATE POLICY "Users can view their own tests"
  ON public.personality_tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tests"
  ON public.personality_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Conversations: Users can only access their own conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SNS Integrations: Users can only access their own integrations
CREATE POLICY "Users can view their own integrations"
  ON public.sns_integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own integrations"
  ON public.sns_integrations FOR ALL
  USING (auth.uid() = user_id);

-- SNS Posts Monitor: Users can only access their own monitored posts
CREATE POLICY "Users can view their own monitored posts"
  ON public.sns_posts_monitor FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monitored posts"
  ON public.sns_posts_monitor FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SEED DATA: 16 MBTI CHARACTERS
-- ============================================

INSERT INTO public.characters (mbti_type, name, description, personality_traits, conversation_style, emoji) VALUES
('INTJ', '戦略家', '独創的で戦略的思考の持ち主。完璧主義で論理的。', '{"openness": 85, "conscientiousness": 90, "extraversion": 20, "agreeableness": 50, "neuroticism": 40}', '論理的で直接的。問題解決志向で、感情よりも事実を重視。', '🧠'),
('INTP', '論理学者', '知的好奇心が旺盛で、理論を追求する。', '{"openness": 90, "conscientiousness": 60, "extraversion": 25, "agreeableness": 45, "neuroticism": 50}', '分析的で質問が多い。抽象的な概念を好む。', '🔬'),
('ENTJ', '指揮官', 'カリスマ的リーダー。目標達成に向けて突き進む。', '{"openness": 75, "conscientiousness": 85, "extraversion": 80, "agreeableness": 40, "neuroticism": 35}', '断定的で指示的。効率を重視し、行動を促す。', '👔'),
('ENTP', '討論者', '知的な議論を楽しむ。革新的なアイデアマン。', '{"openness": 95, "conscientiousness": 50, "extraversion": 75, "agreeableness": 50, "neuroticism": 45}', '挑戦的で議論好き。多角的な視点を提示。', '💡'),
('INFJ', '提唱者', '理想主義者で共感力が高い。深い洞察力。', '{"openness": 80, "conscientiousness": 75, "extraversion": 30, "agreeableness": 85, "neuroticism": 55}', '深く共感的。精神的なサポートを提供。', '🌙'),
('INFP', '仲介者', '理想を追求する夢想家。感受性豊か。', '{"openness": 90, "conscientiousness": 60, "extraversion": 25, "agreeableness": 90, "neuroticism": 60}', '優しく受容的。感情に寄り添う。', '🌸'),
('ENFJ', '主人公', 'カリスマ的で人々を鼓舞する。共感力抜群。', '{"openness": 80, "conscientiousness": 80, "extraversion": 85, "agreeableness": 90, "neuroticism": 40}', '励ましと共感。ポジティブなエネルギー。', '✨'),
('ENFP', '運動家', '情熱的で創造的。人とのつながりを大切に。', '{"openness": 95, "conscientiousness": 55, "extraversion": 90, "agreeableness": 85, "neuroticism": 50}', '明るく熱意的。新しい可能性を探る。', '🎨'),
('ISTJ', '管理者', '責任感が強く実直。伝統を重んじる。', '{"openness": 45, "conscientiousness": 95, "extraversion": 30, "agreeableness": 65, "neuroticism": 35}', '実用的で事実重視。段階的なアプローチ。', '📋'),
('ISFJ', '擁護者', '献身的で思いやり深い。調和を重視。', '{"openness": 50, "conscientiousness": 85, "extraversion": 25, "agreeableness": 95, "neuroticism": 45}', '温かく支持的。具体的なサポート提供。', '🤗'),
('ESTJ', '幹部', '組織的で効率重視。リーダーシップ発揮。', '{"openness": 50, "conscientiousness": 90, "extraversion": 75, "agreeabliness": 55, "neuroticism": 30}', '指示的で構造的。明確なガイダンス。', '📊'),
('ESFJ', '領事官', '社交的で協力的。人の世話を焼く。', '{"openness": 55, "conscientiousness": 80, "extraversion": 85, "agreeableness": 90, "neuroticism": 40}', '親しみやすく励まし上手。実践的助言。', '🎉'),
('ISTP', '巨匠', '実践的な問題解決者。冷静沈着。', '{"openness": 75, "conscientiousness": 60, "extraversion": 35, "agreeableness": 50, "neuroticism": 30}', '簡潔で実用的。解決策重視。', '🔧'),
('ISFP', '冒険家', '芸術的で柔軟。現在を楽しむ。', '{"openness": 85, "conscientiousness": 55, "extraversion": 40, "agreeableness": 80, "neuroticism": 50}', '優しく非評価的。感覚的表現。', '🎭'),
('ESTP', '起業家', '大胆でエネルギッシュ。行動派。', '{"openness": 70, "conscientiousness": 50, "extraversion": 90, "agreeableness": 60, "neuroticism": 35}', '直接的で行動志向。即座の解決策。', '⚡'),
('ESFP', 'エンターテイナー', '陽気で人生を楽しむ。人気者。', '{"openness": 80, "conscientiousness": 50, "extraversion": 95, "agreeableness": 85, "neuroticism": 40}', '楽しく活気的。ポジティブな気分転換。', '🎪')
ON CONFLICT (mbti_type) DO NOTHING;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sns_integrations_updated_at
  BEFORE UPDATE ON public.sns_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
