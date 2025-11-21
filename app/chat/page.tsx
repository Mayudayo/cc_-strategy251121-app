"use client";

import Link from "next/link";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
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
            <Link href="/settings" className="text-sm hover:text-apple-blue">
              設定
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <ChatInterface />
      </main>
    </div>
  );
}
