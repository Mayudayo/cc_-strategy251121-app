"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CharacterCard from "@/components/CharacterCard";

interface TestResult {
  testId: string;
  mbtiType: string;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  character: {
    id: string;
    name: string;
    description: string;
    emoji: string;
    conversationStyle: string;
    personalityTraits: any;
  };
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem("testResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      // No result found, redirect to test page
      router.push("/test");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-xl font-light text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const { mbtiType, scores, character } = result;

  // Get personality type description
  const getTypeDescription = (type: string) => {
    const descriptions: Record<string, { title: string; description: string }> = {
      INTJ: {
        title: "建築家",
        description:
          "想像力が豊かで、戦略的な思考の持ち主です。あらゆる事象に対して計画を立てずにはいられません。",
      },
      INTP: {
        title: "論理学者",
        description:
          "貪欲な知識欲を持つ革新的な発明家です。論理的思考と創造性を兼ね備えています。",
      },
      ENTJ: {
        title: "指揮官",
        description:
          "大胆で想像力豊か、かつ強い意志を持つ指導者です。常に道を見つけるか、道を切り開きます。",
      },
      ENTP: {
        title: "討論者",
        description:
          "賢くて好奇心旺盛な思考家です。知的挑戦には抗えません。",
      },
      INFJ: {
        title: "提唱者",
        description:
          "物静かで神秘的ながらも、人々を勇気づける飽くなき理想主義者です。",
      },
      INFP: {
        title: "仲介者",
        description:
          "詩人肌で親切な利他主義者です。良い物事のためなら、いつでも懸命に手を差し伸べます。",
      },
      ENFJ: {
        title: "主人公",
        description:
          "カリスマ性があり、人々を励ますリーダーです。聞く人を魅了します。",
      },
      ENFP: {
        title: "広報運動家",
        description:
          "情熱的で独創力があり、かつ社交的な自由人です。常にほほ笑む理由を見つけられます。",
      },
      ISTJ: {
        title: "管理者",
        description:
          "実用的で事実に基づいた思考の持ち主です。その信頼性は紛れもなく、本物です。",
      },
      ISFJ: {
        title: "擁護者",
        description:
          "非常に献身的で温かい守護者です。いつでも大切な人を守る準備ができています。",
      },
      ESTJ: {
        title: "幹部",
        description:
          "優秀な管理者です。物事や人々を管理する能力にかけては、右に出る者はいません。",
      },
      ESFJ: {
        title: "領事官",
        description:
          "非常に思いやりがあり社交的で、人気者です。いつでも他人に手を差し伸べます。",
      },
      ISTP: {
        title: "巨匠",
        description:
          "大胆で実践的な思考の持ち主である実験者です。あらゆる道具を使いこなします。",
      },
      ISFP: {
        title: "冒険家",
        description:
          "柔軟性と魅力がある芸術家です。常に進んで経験や冒険をしようとします。",
      },
      ESTP: {
        title: "起業家",
        description:
          "賢くてエネルギッシュで、非常に鋭い知覚の持ち主です。危険と隣り合わせの人生を心から楽しみます。",
      },
      ESFP: {
        title: "エンターテイナー",
        description:
          "自発性がありエネルギッシュで熱心なエンターテイナーです。周りに退屈な瞬間を与えません。",
      },
    };
    return descriptions[type] || { title: "不明", description: "" };
  };

  const typeInfo = getTypeDescription(mbtiType);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-11 max-w-container items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold">
            親友AI
          </Link>
          <nav className="flex gap-8">
            <Link href="/" className="text-sm hover:text-apple-blue">
              ホーム
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-6 py-12">
        {/* Result Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 text-6xl">{character.emoji}</div>
          <h1 className="mb-4 text-6xl font-thin text-gray-900">
            {mbtiType}
          </h1>
          <h2 className="mb-6 text-3xl font-light text-gray-700">
            {typeInfo.title}
          </h2>
          <p className="mx-auto max-w-2xl text-xl font-light text-gray-600">
            {typeInfo.description}
          </p>
        </div>

        {/* Character Card */}
        <div className="mb-16">
          <h3 className="mb-8 text-center text-4xl font-thin text-gray-900">
            あなたの親友AI
          </h3>
          <CharacterCard character={character} />
        </div>

        {/* Personality Scores */}
        <div className="mb-16 rounded-apple bg-gray-50 p-8">
          <h3 className="mb-8 text-3xl font-thin text-gray-900">
            性格スコア
          </h3>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-base font-medium text-gray-700">
                  外向 (E) vs 内向 (I)
                </span>
                <span className="text-base text-gray-600">
                  {scores.E > scores.I ? `${scores.E}% 外向` : `${scores.I}% 内向`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-apple-blue transition-all"
                  style={{ width: `${scores.E}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-base font-medium text-gray-700">
                  感覚 (S) vs 直観 (N)
                </span>
                <span className="text-base text-gray-600">
                  {scores.S > scores.N ? `${scores.S}% 感覚` : `${scores.N}% 直観`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-apple-blue transition-all"
                  style={{ width: `${scores.S}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-base font-medium text-gray-700">
                  思考 (T) vs 感情 (F)
                </span>
                <span className="text-base text-gray-600">
                  {scores.T > scores.F ? `${scores.T}% 思考` : `${scores.F}% 感情`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-apple-blue transition-all"
                  style={{ width: `${scores.T}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-base font-medium text-gray-700">
                  判断 (J) vs 知覚 (P)
                </span>
                <span className="text-base text-gray-600">
                  {scores.J > scores.P ? `${scores.J}% 判断` : `${scores.P}% 知覚`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-apple-blue transition-all"
                  style={{ width: `${scores.J}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <Link
            href="/chat"
            className="inline-block rounded-apple bg-apple-blue px-12 py-4 text-lg font-medium text-white transition-all hover:bg-blue-700"
          >
            親友AIと対話を始める
          </Link>
          <Link
            href="/settings"
            className="inline-block rounded-apple border border-gray-300 px-12 py-4 text-lg font-medium transition-all hover:bg-gray-50"
          >
            SNS連携を設定する
          </Link>
        </div>
      </main>
    </div>
  );
}
