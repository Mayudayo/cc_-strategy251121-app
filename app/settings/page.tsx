"use client";

import Link from "next/link";
import SNSConnector from "@/components/SNSConnector";

export default function SettingsPage() {
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
            <Link href="/chat" className="text-sm hover:text-apple-blue">
              対話
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-6 py-12">
        <div className="mb-12">
          <h1 className="mb-4 text-5xl font-thin text-gray-900">設定</h1>
          <p className="text-lg font-light text-gray-600">
            SNSアカウントを連携して、親友AIがあなたを見守ります
          </p>
        </div>

        <SNSConnector />

        {/* Info Section */}
        <div className="mt-16 rounded-apple bg-gray-50 p-8">
          <h2 className="mb-6 text-3xl font-thin text-gray-900">
            SNS連携でできること
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">✓</div>
              <div>
                <h3 className="mb-1 text-lg font-medium text-gray-900">
                  感情分析
                </h3>
                <p className="text-base font-light text-gray-600">
                  最近ネガティブな投稿が増えている時、AIが「大丈夫？」と声をかけます
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">✓</div>
              <div>
                <h3 className="mb-1 text-lg font-medium text-gray-900">
                  炎上予防
                </h3>
                <p className="text-base font-light text-gray-600">
                  炎上リスクのある投稿を検知し、警告と修正提案をします
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">✓</div>
              <div>
                <h3 className="mb-1 text-lg font-medium text-gray-900">
                  SNS依存対策
                </h3>
                <p className="text-base font-light text-gray-600">
                  長時間SNSを見続けている時、AIが休憩を促します
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 rounded-apple border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-lg font-medium text-gray-900">
            プライバシーについて
          </h3>
          <ul className="space-y-2 text-sm font-light text-gray-600">
            <li>• すべての会話は暗号化され、第三者は閲覧できません</li>
            <li>• SNS連携データも暗号化保存されます</li>
            <li>• 退会時はすべてのデータを完全削除します</li>
            <li>
              • 個人情報保護法およびGDPRに準拠したセキュリティ対策を実施しています
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
