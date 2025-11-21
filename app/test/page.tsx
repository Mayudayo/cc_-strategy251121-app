"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PersonalityTest from "@/components/PersonalityTest";

export default function TestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (answers: Array<{ questionId: number; value: number }>) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual userId from auth
      const userId = "demo-user-id";

      const response = await fetch("/api/test/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("診断の送信に失敗しました");
      }

      const result = await response.json();

      // Store result in sessionStorage for result page
      sessionStorage.setItem("testResult", JSON.stringify(result));

      // Navigate to result page
      router.push("/result");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("診断の送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-thin text-gray-900">
            性格診断
          </h1>
          <p className="text-lg font-light text-gray-600">
            60問の質問に答えて、あなたの性格タイプを判定します
          </p>
          <p className="mt-2 text-base text-gray-500">
            所要時間: 約3-5分
          </p>
        </div>

        <PersonalityTest onComplete={handleComplete} isSubmitting={isSubmitting} />
      </main>
    </div>
  );
}
