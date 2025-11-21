import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateMBTIScores, determineMBTIType, scoresToPercentages, Answer } from '@/lib/mbti-calculator';
import { z } from 'zod';

const submitTestSchema = z.object({
  userId: z.string().uuid(),
  answers: z.array(z.object({
    questionId: z.number().int().min(1).max(60),
    value: z.number().int().min(1).max(5),
  })).length(60),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = submitTestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { userId, answers } = validation.data;

    // Calculate MBTI scores
    const scores = calculateMBTIScores(answers as Answer[]);
    const mbtiType = determineMBTIType(scores);
    const percentages = scoresToPercentages(scores);

    // Get character for this MBTI type
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('mbti_type', mbtiType)
      .single();

    if (characterError || !character) {
      return NextResponse.json(
        { error: 'Character not found for MBTI type', mbtiType },
        { status: 404 }
      );
    }

    // Save test result
    const { data: testResult, error: saveError } = await supabase
      .from('personality_tests')
      .insert({
        user_id: userId,
        character_id: character.id,
        mbti_type: mbtiType,
        answers: answers,
        scores: {
          raw: scores,
          percentages: percentages,
        },
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving test result:', saveError);
      return NextResponse.json(
        { error: 'Failed to save test result' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testId: testResult.id,
      mbtiType,
      scores: percentages,
      character: {
        id: character.id,
        name: character.name,
        description: character.description,
        emoji: character.emoji,
        conversationStyle: character.conversation_style,
        personalityTraits: character.personality_traits,
      },
    });

  } catch (error) {
    console.error('Error in /api/test/submit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
