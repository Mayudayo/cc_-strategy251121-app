import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface SentimentAnalysisResult {
  score: number; // -1.0 (very negative) to 1.0 (very positive)
  label: 'positive' | 'neutral' | 'negative' | 'concerning';
  triggerAlert: boolean; // Should AI reach out proactively?
  reason?: string; // Why alert was triggered
  emotions?: string[]; // Detected emotions
}

/**
 * SNS投稿のセンチメント分析
 * Claude Sonnet 4を使用して高精度な感情分析を実行
 */
export async function analyzeSentiment(
  postContent: string,
  platform: string
): Promise<SentimentAnalysisResult> {
  const systemPrompt = `あなたは感情分析の専門家です。SNS投稿を分析し、投稿者の感情状態を判定してください。

以下のJSON形式で回答してください:
{
  "score": -1.0から1.0の数値,
  "label": "positive" | "neutral" | "negative" | "concerning",
  "triggerAlert": true or false,
  "reason": "アラートをトリガーする理由（triggerAlert=trueの場合）",
  "emotions": ["検出された感情のリスト"]
}

判定基準:
- **concerning**: 深刻な悩み、自傷・自殺のほのめかし、孤独感、絶望感
- **negative**: 落ち込み、不満、疲労、軽度のストレス
- **neutral**: 日常的な報告、事実の共有
- **positive**: 喜び、感謝、達成感、楽しみ

triggerAlert判定:
- concerning レベルは必ずtrue
- negative で深刻な兆候がある場合true
- それ以外はfalse

投稿内容を深く分析し、表面的な言葉だけでなく、文脈や暗示も考慮してください。`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `プラットフォーム: ${platform}\n投稿: "${postContent}"\n\nこの投稿を分析してください。`,
      }],
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Claude');
    }

    const result: SentimentAnalysisResult = JSON.parse(jsonMatch[0]);

    // Validate result
    if (typeof result.score !== 'number' ||
        !['positive', 'neutral', 'negative', 'concerning'].includes(result.label)) {
      throw new Error('Invalid sentiment analysis result');
    }

    return result;

  } catch (error) {
    console.error('Error in sentiment analysis:', error);

    // Fallback: 簡易な分析
    const lowerContent = postContent.toLowerCase();
    const negativeKeywords = ['辛い', 'しんどい', '疲れた', '消えたい', '死にたい', '孤独', '寂しい', '辞めたい', 'つらい'];
    const concerningKeywords = ['死にたい', '消えたい', '自殺', '生きてる意味', '価値がない'];

    const hasNegative = negativeKeywords.some(kw => lowerContent.includes(kw));
    const hasConcerning = concerningKeywords.some(kw => lowerContent.includes(kw));

    if (hasConcerning) {
      return {
        score: -0.9,
        label: 'concerning',
        triggerAlert: true,
        reason: '深刻な感情表現を検出',
        emotions: ['絶望', '孤独'],
      };
    } else if (hasNegative) {
      return {
        score: -0.5,
        label: 'negative',
        triggerAlert: true,
        reason: 'ネガティブな感情表現を検出',
        emotions: ['疲労', 'ストレス'],
      };
    } else {
      return {
        score: 0.0,
        label: 'neutral',
        triggerAlert: false,
        emotions: [],
      };
    }
  }
}

/**
 * 複数の投稿を一括分析
 */
export async function analyzeBatchSentiment(
  posts: Array<{ id: string; content: string; platform: string }>
): Promise<Map<string, SentimentAnalysisResult>> {
  const results = new Map<string, SentimentAnalysisResult>();

  // 並列処理で高速化
  const analyses = await Promise.all(
    posts.map(async post => {
      try {
        const result = await analyzeSentiment(post.content, post.platform);
        return { id: post.id, result };
      } catch (error) {
        console.error(`Error analyzing post ${post.id}:`, error);
        return null;
      }
    })
  );

  // 結果をMapに格納
  analyses.forEach(analysis => {
    if (analysis) {
      results.set(analysis.id, analysis.result);
    }
  });

  return results;
}
