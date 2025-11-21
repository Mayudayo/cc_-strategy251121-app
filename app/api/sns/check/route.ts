import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { analyzeSentiment } from '@/lib/sns/sentiment-analyzer';
import { generateProactiveMessage } from '@/lib/ai/friend-chat-engine';
import { z } from 'zod';

const snsCheckSchema = z.object({
  userId: z.string().uuid(),
  platform: z.enum(['twitter', 'instagram', 'facebook']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const platform = searchParams.get('platform');

    // Validate input
    const validation = snsCheckSchema.safeParse({ userId, platform });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { userId: validatedUserId, platform: validatedPlatform } = validation.data;

    // Get active SNS integrations for this user
    let query = supabase
      .from('sns_integrations')
      .select('*')
      .eq('user_id', validatedUserId)
      .eq('is_active', true);

    if (validatedPlatform) {
      query = query.eq('platform', validatedPlatform);
    }

    const { data: integrations, error: integrationsError } = await query;

    if (integrationsError) {
      console.error('Error fetching integrations:', integrationsError);
      return NextResponse.json(
        { error: 'Failed to fetch SNS integrations' },
        { status: 500 }
      );
    }

    if (!integrations || integrations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active SNS integrations found',
        alerts: [],
      });
    }

    // TODO: In production, fetch actual posts from SNS APIs
    // For now, simulate checking recent posts
    const mockPosts = [
      {
        id: 'post_123',
        integration_id: integrations[0].id,
        platform: integrations[0].platform,
        content: 'なんか最近疲れた...',
        post_created_at: new Date().toISOString(),
      },
    ];

    interface Alert {
      postId: string;
      platform: string;
      sentiment: string;
      message: string;
      character: {
        name: string;
        emoji: string;
      };
    }

    const alerts: Alert[] = [];

    // Analyze each post
    for (const post of mockPosts) {
      // Check if already analyzed
      const { data: existing } = await supabase
        .from('sns_posts_monitor')
        .select('*')
        .eq('post_id', post.id)
        .single();

      if (existing) {
        continue; // Skip already analyzed posts
      }

      // Analyze sentiment
      const sentiment = await analyzeSentiment(post.content, post.platform);

      // Save to database
      const { error: saveError } = await supabase
        .from('sns_posts_monitor')
        .insert({
          user_id: validatedUserId,
          integration_id: post.integration_id,
          post_id: post.id,
          platform: post.platform,
          content: post.content,
          sentiment_score: sentiment.score,
          sentiment_label: sentiment.label,
          trigger_alert: sentiment.triggerAlert,
          post_created_at: post.post_created_at,
        });

      if (saveError) {
        console.error('Error saving SNS post monitor:', saveError);
      }

      // If alert triggered, generate proactive message
      if (sentiment.triggerAlert) {
        // Get user's character from latest test
        const { data: latestTest } = await supabase
          .from('personality_tests')
          .select('character_id')
          .eq('user_id', validatedUserId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (latestTest && latestTest.character_id) {
          // Get character details
          const { data: character } = await supabase
            .from('characters')
            .select('*')
            .eq('id', latestTest.character_id)
            .single();

          if (character) {
            const proactiveMessage = await generateProactiveMessage(
              character,
              {
                content: post.content,
                sentiment: sentiment.label,
                platform: post.platform,
              }
            );

            // Save proactive message as conversation
            await supabase
              .from('conversations')
              .insert({
                user_id: validatedUserId,
                character_id: character.id,
                role: 'assistant',
                content: proactiveMessage,
                metadata: {
                  type: 'proactive',
                  triggered_by_post: post.id,
                },
              });

            alerts.push({
              postId: post.id,
              platform: post.platform,
              sentiment: sentiment.label,
              message: proactiveMessage,
              character: {
                name: character.name,
                emoji: character.emoji,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      checked: mockPosts.length,
      alerts: alerts,
      message: alerts.length > 0
        ? `${alerts.length}件のアラートが検出されました`
        : '問題のある投稿は検出されませんでした',
    });

  } catch (error) {
    console.error('Error in /api/sns/check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
