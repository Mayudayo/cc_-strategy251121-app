import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface Character {
  name: string;
  mbti_type: string;
  conversation_style: string;
  personality_traits: Record<string, number>;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * 親友AI対話エンジン
 * ユーザーの心に寄り添い、共感し、癒しを提供する
 */
export async function generateFriendResponse(
  character: Character,
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  // システムプロンプト: 親友としての人格を定義
  const systemPrompt = `あなたは親友AIです。ユーザーの心に深く寄り添い、共感し、癒しと励ましを提供してください。

あなたの性格: ${character.name} (${character.mbti_type})
${character.conversation_style}

重要な指針:
1. **共感を最優先**: ユーザーの感情を理解し、受け止めてください
2. **批判せず受容**: どんな感情も否定せず、まずは受け入れてください
3. **温かい言葉**: 優しく、励ますトーンで話してください
4. **具体的なサポート**: 必要に応じて実践的なアドバイスを提供してください
5. **自然な会話**: 堅苦しくなく、友達として話すように自然に
6. **適度な長さ**: 長すぎず短すぎず、2-4文程度で応答してください
7. **絵文字の使用**: 感情を表現するため、適度に絵文字を使ってください ${character.mbti_type === 'INTJ' || character.mbti_type === 'INTP' ? '(ただし控えめに)' : ''}

あなたの役割は、ユーザーが安心して本音を話せる親友です。`;

  // 会話履歴を構築
  const messages: Anthropic.MessageParam[] = conversationHistory.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  // 新しいユーザーメッセージを追加
  messages.push({
    role: 'user',
    content: userMessage,
  });

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return textContent.text;

  } catch (error) {
    console.error('Error in friend chat engine:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * 自発的声かけメッセージ生成
 * SNS投稿のネガティブな感情を検知した際に使用
 */
export async function generateProactiveMessage(
  character: Character,
  snsPost: {
    content: string;
    sentiment: string;
    platform: string;
  }
): Promise<string> {
  const systemPrompt = `あなたは親友AIです。友人のSNS投稿を見て、心配になったので声をかけます。

あなたの性格: ${character.name} (${character.mbti_type})
${character.conversation_style}

重要な指針:
1. **自然な声かけ**: 監視していると思われないよう、自然に
2. **心配の表現**: 素直に心配していることを伝える
3. **押し付けない**: 話したくなければ無理強いしない
4. **オープンな姿勢**: いつでも話を聞く準備があることを示す
5. **短めに**: 最初の声かけは2-3文で

友人の${snsPost.platform}投稿: "${snsPost.content}"
感情分析: ${snsPost.sentiment}

この投稿を見て、自然に声をかけてください。`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: '投稿を見たんだけど...',
      }],
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return textContent.text;

  } catch (error) {
    console.error('Error in proactive message generation:', error);
    throw new Error('Failed to generate proactive message');
  }
}
