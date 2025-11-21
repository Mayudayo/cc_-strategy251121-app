# 親友AI性格診断 - API仕様書

## 概要
親友AI性格診断アプリのバックエンドAPI仕様

**技術スタック**:
- Next.js 16 API Routes
- Supabase (PostgreSQL + Auth)
- Claude Sonnet 4 (Anthropic)
- TypeScript + Zod (バリデーション)

---

## 1. POST /api/test/submit

MBTI性格診断の60問回答を受け取り、判定結果を返す

### Request
```typescript
{
  userId: string (UUID),
  answers: Array<{
    questionId: number (1-60),
    value: number (1-5)
  }> (length: 60)
}
```

### Response (200 OK)
```typescript
{
  success: true,
  testId: string (UUID),
  mbtiType: string ("INTJ", "ENFP", etc.),
  scores: {
    E: number (0-100),
    I: number (0-100),
    S: number (0-100),
    N: number (0-100),
    T: number (0-100),
    F: number (0-100),
    J: number (0-100),
    P: number (0-100)
  },
  character: {
    id: string (UUID),
    name: string,
    description: string,
    emoji: string,
    conversationStyle: string,
    personalityTraits: object
  }
}
```

### Error (400/404/500)
```typescript
{
  error: string,
  details?: any
}
```

---

## 2. GET /api/character/[type]

MBTIタイプから対応するキャラクター情報を取得

### URL Parameters
- `type`: MBTI type (INTJ, ENFP, etc.)

### Response (200 OK)
```typescript
{
  id: string (UUID),
  mbtiType: string,
  name: string,
  description: string,
  emoji: string,
  conversationStyle: string,
  personalityTraits: {
    openness: number,
    conscientiousness: number,
    extraversion: number,
    agreeableness: number,
    neuroticism: number
  }
}
```

### Error (400/404/500)
```typescript
{
  error: string,
  mbtiType?: string
}
```

---

## 3. POST /api/chat

親友AIとの対話を実行

### Request
```typescript
{
  userId: string (UUID),
  characterId: string (UUID),
  message: string (1-5000 chars),
  conversationLimit?: number (1-50, default: 20)
}
```

### Response (200 OK)
```typescript
{
  success: true,
  response: string,
  messageId: string (UUID),
  character: {
    name: string,
    emoji: string
  }
}
```

### Error (400/404/500)
```typescript
{
  error: string,
  details?: any
}
```

---

## 4. GET /api/sns/check

SNS投稿を監視し、センチメント分析を実行

### Query Parameters
- `userId`: string (UUID) - 必須
- `platform`: "twitter" | "instagram" | "facebook" - オプション

### Response (200 OK)
```typescript
{
  success: true,
  checked: number,
  alerts: Array<{
    postId: string,
    platform: string,
    sentiment: "positive" | "neutral" | "negative" | "concerning",
    message: string,
    character: {
      name: string,
      emoji: string
    }
  }>,
  message: string
}
```

### Error (400/500)
```typescript
{
  error: string,
  details?: any
}
```

---

## 5. POST /api/sns/connect

SNSアカウントを連携

### Request
```typescript
{
  userId: string (UUID),
  platform: "twitter" | "instagram" | "facebook",
  platformUserId: string,
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number (seconds)
}
```

### Response (200 OK)
```typescript
{
  success: true,
  integration: {
    id: string (UUID),
    platform: string,
    platformUserId: string,
    isActive: boolean,
    connectedAt: string (ISO 8601)
  },
  message: string
}
```

### Error (400/500)
```typescript
{
  error: string,
  details?: any
}
```

---

## 5a. GET /api/sns/connect

連携済みSNSアカウント一覧を取得

### Query Parameters
- `userId`: string (UUID) - 必須

### Response (200 OK)
```typescript
{
  success: true,
  integrations: Array<{
    id: string (UUID),
    platform: string,
    platformUserId: string,
    isActive: boolean,
    connectedAt: string (ISO 8601),
    updatedAt: string (ISO 8601)
  }>
}
```

---

## 5b. DELETE /api/sns/connect

SNS連携を解除

### Query Parameters
- `integrationId`: string (UUID) - 必須
- `userId`: string (UUID) - 必須

### Response (200 OK)
```typescript
{
  success: true,
  message: string
}
```

---

## データベーススキーマ

詳細は `/schema.sql` を参照

### テーブル一覧
1. **characters** - 16 MBTI personalities
2. **personality_tests** - 診断結果
3. **conversations** - AI対話履歴
4. **sns_integrations** - SNS連携情報
5. **sns_posts_monitor** - SNS投稿監視ログ

### RLS (Row Level Security)
- すべてのテーブルでRLS有効化
- ユーザーは自分のデータのみアクセス可能
- キャラクター情報は全員が閲覧可能

---

## セキュリティ

- **認証**: Supabase Auth (RLS)
- **バリデーション**: Zod schema
- **トークン暗号化**: SNSトークンはDB暗号化推奨
- **レート制限**: プロダクションでは実装推奨

---

## エラーハンドリング

全エンドポイントで以下のHTTPステータスコードを使用:
- `200`: 成功
- `400`: バリデーションエラー
- `404`: リソースが見つからない
- `500`: サーバーエラー

---

## Claude統合

### 親友AI対話 (`/lib/ai/friend-chat-engine.ts`)
- Model: `claude-sonnet-4-20250514`
- Max Tokens: 1024
- 役割: 共感的な親友としてユーザーをサポート

### センチメント分析 (`/lib/sns/sentiment-analyzer.ts`)
- Model: `claude-sonnet-4-20250514`
- Max Tokens: 1024
- 役割: SNS投稿の感情分析、アラート判定

---

## 次のステップ

1. Supabaseプロジェクト作成
2. `/schema.sql` をSupabase SQL Editorで実行
3. `.env.example` をコピーして `.env.local` を作成
4. 環境変数を設定
5. `npm run dev` でローカル開発サーバー起動
6. Frontend Engineerへ連携

---

**Backend Engineer業務完了**
- 全5エンドポイント実装完了
- Claude統合完了
- データベーススキーマ完成
- TypeScript型安全
- エラーハンドリング完備
