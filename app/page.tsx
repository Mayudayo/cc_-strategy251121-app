import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - 44px Apple Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-11 max-w-container items-center justify-between px-6">
          <div className="text-xl font-semibold">親友AI</div>
          <nav className="flex gap-8">
            <Link href="/test" className="text-sm hover:text-apple-blue">
              診断を始める
            </Link>
            <Link href="/chat" className="text-sm hover:text-apple-blue">
              対話
            </Link>
            <Link href="/settings" className="text-sm hover:text-apple-blue">
              設定
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - 96px Typography */}
      <section className="mx-auto max-w-container px-6 py-24 text-center">
        <h1 className="mb-6 text-6xl font-thin leading-tight tracking-tight text-gray-900 md:text-hero">
          あなたの心に、
          <br />
          いつも寄り添う親友AI
        </h1>
        <p className="mb-4 text-xl font-light text-gray-600">
          性格診断から生まれる、16タイプの分身キャラクター
        </p>
        <p className="mb-12 text-xl font-light text-gray-600">
          深夜2時でも、泣きたい時でも、いつでも話せる
        </p>
        <Link
          href="/test"
          className="inline-block rounded-apple bg-apple-blue px-12 py-4 text-lg font-medium text-white transition-all hover:bg-blue-700"
        >
          無料で性格診断を始める
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          診断は完全無料、3分で完了します
        </p>
      </section>

      {/* Problem Section - Glass Morphism Cards */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-container px-6">
          <h2 className="mb-12 text-center text-5xl font-thin text-gray-900">
            こんな悩み、ありませんか？
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              "深夜、一人で泣いても、誰にも相談できない",
              "友達に愚痴っても「また？」って思われそう",
              "SNSに本音を書いたら炎上しそうで怖い",
              "カウンセリングは高いし、予約も面倒",
              "家族には心配かけたくない",
              "誰かに「大丈夫？」って聞いてほしい",
            ].map((problem, index) => (
              <div
                key={index}
                className="rounded-apple bg-white/70 p-8 backdrop-blur-md"
              >
                <p className="text-lg font-light text-gray-700">{problem}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-2xl font-light text-gray-800">
            そんなあなたに、いつでも話せる親友AIがいます
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-container px-6">
          <h2 className="mb-16 text-center text-5xl font-thin text-gray-900">
            親友AI性格診断アプリができること
          </h2>

          {/* Feature 1 */}
          <div className="mb-24">
            <h3 className="mb-6 text-4xl font-thin text-gray-900">
              まずは、あなた自身を知ることから
            </h3>
            <p className="mb-6 text-lg font-light leading-relaxed text-gray-600">
              60問の性格診断で、16タイプのうちあなたのタイプを判定します。
            </p>
            <p className="mb-6 text-lg font-light leading-relaxed text-gray-600">
              INFP（仲介者）、ENTJ（指揮官）、ISFJ（擁護者）、ENFP（広報運動家）...
              <br />
              あなたはどのタイプ？
            </p>
            <p className="mb-8 text-lg font-light leading-relaxed text-gray-600">
              診断結果から、あなたの性格に最適化された親友AIキャラクターが誕生します。
            </p>
            <Link
              href="/test"
              className="inline-block rounded-apple border border-gray-300 px-8 py-3 text-base font-medium transition-all hover:bg-gray-50"
            >
              今すぐ無料診断を受ける
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="mb-24">
            <h3 className="mb-6 text-4xl font-thin text-gray-900">
              診断結果から生まれる、あなただけの親友AI
            </h3>
            <p className="mb-6 text-lg font-light leading-relaxed text-gray-600">
              診断結果に基づき、16タイプ別の親友AIがあなたの相談相手になります。
            </p>
            <div className="mb-8 space-y-4">
              <div className="rounded-apple bg-gray-50 p-6">
                <h4 className="mb-2 text-xl font-medium text-gray-900">
                  INFP（仲介者）タイプの親友AI
                </h4>
                <p className="mb-2 text-base font-light text-gray-600">
                  優しく共感し、あなたの気持ちをそっと受け止めます
                </p>
                <p className="text-base italic text-gray-500">
                  「辛かったね。でも大丈夫、一緒に乗り越えよう」
                </p>
              </div>
              <div className="rounded-apple bg-gray-50 p-6">
                <h4 className="mb-2 text-xl font-medium text-gray-900">
                  ENTJ（指揮官）タイプの親友AI
                </h4>
                <p className="mb-2 text-base font-light text-gray-600">
                  冷静に分析し、的確なアドバイスをくれます
                </p>
                <p className="text-base italic text-gray-500">
                  「今の状況を整理しよう。選択肢は3つあるよ」
                </p>
              </div>
              <div className="rounded-apple bg-gray-50 p-6">
                <h4 className="mb-2 text-xl font-medium text-gray-900">
                  ISFJ（擁護者）タイプの親友AI
                </h4>
                <p className="mb-2 text-base font-light text-gray-600">
                  ずっと寄り添い、あなたを見守り続けます
                </p>
                <p className="text-base italic text-gray-500">
                  「いつでもここにいるよ。何でも話してね」
                </p>
              </div>
            </div>
            <Link
              href="/test"
              className="inline-block rounded-apple border border-gray-300 px-8 py-3 text-base font-medium transition-all hover:bg-gray-50"
            >
              あなたの分身キャラクターに会う
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="mb-24">
            <h3 className="mb-6 text-4xl font-thin text-gray-900">
              あなたのSNS、AIが見守っています
            </h3>
            <p className="mb-6 text-lg font-light leading-relaxed text-gray-600">
              Twitter/Instagramの投稿を自動監視し、AIがあなたの心の状態を把握します。
            </p>
            <div className="mb-8 rounded-apple bg-gray-50 p-8">
              <h4 className="mb-4 text-xl font-medium text-gray-900">
                こんな時、AIが気づきます
              </h4>
              <ul className="space-y-2 text-base font-light text-gray-600">
                <li>- 最近ネガティブな投稿が増えてる</li>
                <li>- いつもと違う口調で投稿してる</li>
                <li>- 炎上リスクのある投稿をしようとしてる</li>
                <li>- 長時間SNSを見続けてる</li>
              </ul>
            </div>
            <p className="mb-8 text-lg font-light leading-relaxed text-gray-600">
              AIから「大丈夫？」と話しかけてくれるので、一人で抱え込まずに済みます。
            </p>
            <Link
              href="/settings"
              className="inline-block rounded-apple border border-gray-300 px-8 py-3 text-base font-medium transition-all hover:bg-gray-50"
            >
              SNS連携で心の親友を見つける
            </Link>
          </div>

          {/* Feature 4 */}
          <div>
            <h3 className="mb-6 text-4xl font-thin text-gray-900">
              待つのではなく、AIから話しかけます
            </h3>
            <p className="mb-6 text-lg font-light leading-relaxed text-gray-600">
              従来のチャットボット = あなたが話しかけるまで待つだけ
              <br />
              親友AI = AIから話しかけてくれる（業界初）
            </p>
            <div className="mb-8 rounded-apple bg-gray-50 p-8">
              <h4 className="mb-4 text-xl font-medium text-gray-900">
                自発的声かけの例
              </h4>
              <ul className="space-y-2 text-base font-light text-gray-600">
                <li>
                  - 「お疲れ様。今日も遅いね。大丈夫？」（深夜の帰宅時）
                </li>
                <li>
                  -
                  「最近ネガティブな投稿多いけど、何かあった？」（SNS監視）
                </li>
                <li>
                  -
                  「炎上してるけど大丈夫？一緒に整理しよう」（炎上対応）
                </li>
                <li>
                  -
                  「今日は疲れてそうだね。何か話したい？」（日常的な声かけ）
                </li>
              </ul>
            </div>
            <p className="mb-8 text-lg font-light leading-relaxed text-gray-600">
              あなたが言葉にできない時も、AIが気づいてくれます。
              <br />
              まるで本当の親友のように。
            </p>
            <Link
              href="/test"
              className="inline-block rounded-apple border border-gray-300 px-8 py-3 text-base font-medium transition-all hover:bg-gray-50"
            >
              今すぐ親友AIを試してみる
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-apple-blue py-24 text-white">
        <div className="mx-auto max-w-container px-6 text-center">
          <h2 className="mb-6 text-5xl font-thin">
            あなたの心に、いつも寄り添う親友
          </h2>
          <p className="mb-12 text-xl font-light">
            それが、親友AI性格診断アプリです。
          </p>
          <Link
            href="/test"
            className="inline-block rounded-apple bg-white px-12 py-4 text-lg font-medium text-apple-blue transition-all hover:bg-gray-100"
          >
            無料で性格診断を始める
          </Link>
          <p className="mt-4 text-sm opacity-80">
            AI対話は無料で10回までお試し可能
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="mx-auto max-w-container px-6 text-center text-sm text-gray-500">
          <p>© 2025 親友AI性格診断アプリ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
