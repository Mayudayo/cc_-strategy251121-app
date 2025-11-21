"use client";

import { useState } from "react";

interface PersonalityTestProps {
  onComplete: (answers: Array<{ questionId: number; value: number }>) => void;
  isSubmitting: boolean;
}

// 60 MBTI questions (simplified version)
const questions = [
  // E vs I (Extraversion vs Introversion) - Questions 1-15
  { id: 1, text: "パーティーや集まりに参加するのが好きですか？", dimension: "EI" },
  { id: 2, text: "一人で過ごす時間を大切にしていますか？", dimension: "IE" },
  { id: 3, text: "新しい人と会うことに積極的ですか？", dimension: "EI" },
  { id: 4, text: "静かな環境で本を読むのが好きですか？", dimension: "IE" },
  { id: 5, text: "グループでの活動を楽しみますか？", dimension: "EI" },
  { id: 6, text: "深い一対一の会話を好みますか？", dimension: "IE" },
  { id: 7, text: "活気のある場所でエネルギーを得ますか？", dimension: "EI" },
  { id: 8, text: "独りで考える時間が必要ですか？", dimension: "IE" },
  { id: 9, text: "多くの友人と交流するのが好きですか？", dimension: "EI" },
  { id: 10, text: "少数の親しい友人を大切にしますか？", dimension: "IE" },
  { id: 11, text: "人前で話すことに抵抗がありませんか？", dimension: "EI" },
  { id: 12, text: "じっくり考えてから行動しますか？", dimension: "IE" },
  { id: 13, text: "すぐに打ち解けることができますか？", dimension: "EI" },
  { id: 14, text: "初対面の人と話すのに時間がかかりますか？", dimension: "IE" },
  { id: 15, text: "社交的な場面で疲れを感じにくいですか？", dimension: "EI" },

  // S vs N (Sensing vs Intuition) - Questions 16-30
  { id: 16, text: "具体的な事実やデータを重視しますか？", dimension: "SN" },
  { id: 17, text: "将来の可能性や抽象的なアイデアに魅力を感じますか？", dimension: "NS" },
  { id: 18, text: "五感で感じる現実を大切にしますか？", dimension: "SN" },
  { id: 19, text: "直感やひらめきを信じますか？", dimension: "NS" },
  { id: 20, text: "詳細な説明を好みますか？", dimension: "SN" },
  { id: 21, text: "全体像やパターンを見るのが得意ですか？", dimension: "NS" },
  { id: 22, text: "実践的で現実的なアプローチを好みますか？", dimension: "SN" },
  { id: 23, text: "理論的で革新的なアイデアに興味がありますか？", dimension: "NS" },
  { id: 24, text: "経験と実績を重視しますか？", dimension: "SN" },
  { id: 25, text: "未来の可能性を探るのが好きですか？", dimension: "NS" },
  { id: 26, text: "具体的な手順に従うのが好きですか？", dimension: "SN" },
  { id: 27, text: "創造的で独創的な方法を試すのが好きですか？", dimension: "NS" },
  { id: 28, text: "目の前の現実に集中しますか？", dimension: "SN" },
  { id: 29, text: "隠れた意味や象徴を見つけるのが好きですか？", dimension: "NS" },
  { id: 30, text: "実用性を重視しますか？", dimension: "SN" },

  // T vs F (Thinking vs Feeling) - Questions 31-45
  { id: 31, text: "論理的な分析を重視しますか？", dimension: "TF" },
  { id: 32, text: "人の気持ちを優先して考えますか？", dimension: "FT" },
  { id: 33, text: "客観的な基準で判断しますか？", dimension: "TF" },
  { id: 34, text: "共感と調和を大切にしますか？", dimension: "FT" },
  { id: 35, text: "公平性と正義を重視しますか？", dimension: "TF" },
  { id: 36, text: "思いやりと優しさを大切にしますか？", dimension: "FT" },
  { id: 37, text: "事実に基づいて決断しますか？", dimension: "TF" },
  { id: 38, text: "感情や価値観を考慮して決断しますか？", dimension: "FT" },
  { id: 39, text: "批判的思考を得意としますか？", dimension: "TF" },
  { id: 40, text: "人間関係の調和を保つことを優先しますか？", dimension: "FT" },
  { id: 41, text: "効率性を重視しますか？", dimension: "TF" },
  { id: 42, text: "人々の幸福を考えますか？", dimension: "FT" },
  { id: 43, text: "論理的な議論を楽しみますか？", dimension: "TF" },
  { id: 44, text: "相手の立場に立って考えますか？", dimension: "FT" },
  { id: 45, text: "原則と一貫性を重視しますか？", dimension: "TF" },

  // J vs P (Judging vs Perceiving) - Questions 46-60
  { id: 46, text: "計画を立てて行動するのが好きですか？", dimension: "JP" },
  { id: 47, text: "柔軟に状況に応じて行動するのが好きですか？", dimension: "PJ" },
  { id: 48, text: "締め切りを守ることを重視しますか？", dimension: "JP" },
  { id: 49, text: "最後の最後まで選択肢を残しておきたいですか？", dimension: "PJ" },
  { id: 50, text: "整理整頓された環境を好みますか？", dimension: "JP" },
  { id: 51, text: "自然な流れに任せるのが好きですか？", dimension: "PJ" },
  { id: 52, text: "決断を早く下したいですか？", dimension: "JP" },
  { id: 53, text: "即興で対応するのが得意ですか？", dimension: "PJ" },
  { id: 54, text: "リストやスケジュールを使いますか？", dimension: "JP" },
  { id: 55, text: "臨機応変に対応するのが好きですか？", dimension: "PJ" },
  { id: 56, text: "計画通りに進めたいですか？", dimension: "JP" },
  { id: 57, text: "予定は柔軟に変更できる方が良いですか？", dimension: "PJ" },
  { id: 58, text: "事前に準備するのが好きですか？", dimension: "JP" },
  { id: 59, text: "その場その場で対応するのが好きですか？", dimension: "PJ" },
  { id: 60, text: "明確な目標とゴールを持ちたいですか？", dimension: "JP" },
];

export default function PersonalityTest({ onComplete, isSubmitting }: PersonalityTestProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const progress = (answers.size / questions.length) * 100;

  const handleAnswer = (questionId: number, value: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, value);
    setAnswers(newAnswers);
  };

  const canGoNext = currentQuestions.every((q) => answers.has(q.id));
  const canSubmit = answers.size === questions.length;

  const handleNext = () => {
    if (canGoNext && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (canSubmit) {
      const answersArray = Array.from(answers.entries()).map(([questionId, value]) => ({
        questionId,
        value,
      }));
      onComplete(answersArray);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>進捗状況</span>
          <span>{answers.size} / {questions.length}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-apple-blue transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {currentQuestions.map((question, index) => (
          <div key={question.id} className="rounded-apple bg-gray-50 p-8">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              質問 {question.id}: {question.text}
            </h3>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">全く<br/>当てはまらない</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(question.id, value)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      answers.get(question.id) === value
                        ? "border-apple-blue bg-apple-blue text-white"
                        : "border-gray-300 bg-white hover:border-apple-blue"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-600">とても<br/>当てはまる</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className="rounded-apple border border-gray-300 px-8 py-3 text-base font-medium transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前のページ
        </button>

        <div className="text-sm text-gray-600">
          ページ {currentPage + 1} / {totalPages}
        </div>

        {currentPage < totalPages - 1 ? (
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="rounded-apple bg-apple-blue px-8 py-3 text-base font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次のページ
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="rounded-apple bg-apple-blue px-8 py-3 text-base font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "診断中..." : "診断結果を見る"}
          </button>
        )}
      </div>
    </div>
  );
}
