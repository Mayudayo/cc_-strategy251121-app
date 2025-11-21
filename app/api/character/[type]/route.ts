import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const mbtiType = type.toUpperCase();

    // Validate MBTI type format (4 characters)
    if (!/^[EI][SN][TF][JP]$/.test(mbtiType)) {
      return NextResponse.json(
        { error: 'Invalid MBTI type format. Expected format: INTJ, ENFP, etc.' },
        { status: 400 }
      );
    }

    // Fetch character from database
    const { data: character, error } = await supabase
      .from('characters')
      .select('*')
      .eq('mbti_type', mbtiType)
      .single();

    if (error || !character) {
      return NextResponse.json(
        { error: 'Character not found', mbtiType },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: character.id,
      mbtiType: character.mbti_type,
      name: character.name,
      description: character.description,
      emoji: character.emoji,
      conversationStyle: character.conversation_style,
      personalityTraits: character.personality_traits,
    });

  } catch (error) {
    console.error('Error in /api/character/[type]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
