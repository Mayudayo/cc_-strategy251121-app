import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateFriendResponse } from '@/lib/ai/friend-chat-engine';
import { z } from 'zod';

const chatRequestSchema = z.object({
  userId: z.string().uuid(),
  characterId: z.string().uuid(),
  message: z.string().min(1).max(5000),
  conversationLimit: z.number().int().min(1).max(50).optional().default(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = chatRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { userId, characterId, message, conversationLimit } = validation.data;

    // Get character information
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();

    if (characterError || !character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    // Get recent conversation history
    const { data: history, error: historyError } = await supabase
      .from('conversations')
      .select('role, content')
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .order('created_at', { ascending: false })
      .limit(conversationLimit);

    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
    }

    // Reverse to chronological order
    const conversationHistory = (history || []).reverse();

    // Generate AI response
    const aiResponse = await generateFriendResponse(
      character,
      conversationHistory,
      message
    );

    // Save user message
    const { error: saveUserError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        character_id: characterId,
        role: 'user',
        content: message,
      });

    if (saveUserError) {
      console.error('Error saving user message:', saveUserError);
    }

    // Save AI response
    const { data: savedResponse, error: saveAIError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        character_id: characterId,
        role: 'assistant',
        content: aiResponse,
      })
      .select()
      .single();

    if (saveAIError) {
      console.error('Error saving AI response:', saveAIError);
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageId: savedResponse?.id,
      character: {
        name: character.name,
        emoji: character.emoji,
      },
    });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
