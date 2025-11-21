import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const snsConnectSchema = z.object({
  userId: z.string().uuid(),
  platform: z.enum(['twitter', 'instagram', 'facebook']),
  platformUserId: z.string().min(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  expiresIn: z.number().int().positive().optional(), // seconds
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = snsConnectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const {
      userId,
      platform,
      platformUserId,
      accessToken,
      refreshToken,
      expiresIn,
    } = validation.data;

    // Calculate token expiry
    const tokenExpiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    // Check if integration already exists
    const { data: existing } = await supabase
      .from('sns_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .single();

    let result;

    if (existing) {
      // Update existing integration
      const { data, error } = await supabase
        .from('sns_integrations')
        .update({
          platform_user_id: platformUserId,
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: tokenExpiresAt,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating SNS integration:', error);
        return NextResponse.json(
          { error: 'Failed to update SNS integration' },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new integration
      const { data, error } = await supabase
        .from('sns_integrations')
        .insert({
          user_id: userId,
          platform: platform,
          platform_user_id: platformUserId,
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: tokenExpiresAt,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating SNS integration:', error);
        return NextResponse.json(
          { error: 'Failed to create SNS integration' },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({
      success: true,
      integration: {
        id: result.id,
        platform: result.platform,
        platformUserId: result.platform_user_id,
        isActive: result.is_active,
        connectedAt: result.created_at,
      },
      message: `${platform}アカウントを連携しました`,
    });

  } catch (error) {
    console.error('Error in /api/sns/connect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve connected integrations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const { data: integrations, error } = await supabase
      .from('sns_integrations')
      .select('id, platform, platform_user_id, is_active, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching integrations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch integrations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      integrations: integrations.map(int => ({
        id: int.id,
        platform: int.platform,
        platformUserId: int.platform_user_id,
        isActive: int.is_active,
        connectedAt: int.created_at,
        updatedAt: int.updated_at,
      })),
    });

  } catch (error) {
    console.error('Error in GET /api/sns/connect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to disconnect an integration
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const integrationId = searchParams.get('integrationId');
    const userId = searchParams.get('userId');

    if (!integrationId || !userId) {
      return NextResponse.json(
        { error: 'integrationId and userId are required' },
        { status: 400 }
      );
    }

    // Deactivate integration (soft delete)
    const { error } = await supabase
      .from('sns_integrations')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', integrationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deactivating integration:', error);
      return NextResponse.json(
        { error: 'Failed to disconnect integration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'SNS連携を解除しました',
    });

  } catch (error) {
    console.error('Error in DELETE /api/sns/connect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
