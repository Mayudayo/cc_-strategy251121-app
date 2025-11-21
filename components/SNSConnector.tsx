"use client";

import { useState, useEffect } from "react";
import { Twitter, Instagram, CheckCircle, XCircle } from "lucide-react";

interface Integration {
  id: string;
  platform: string;
  platformUserId: string;
  isActive: boolean;
  connectedAt: string;
}

export default function SNSConnector() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  // Fetch existing integrations
  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      // TODO: Replace with actual userId from auth
      const userId = "demo-user-id";

      const response = await fetch(`/api/sns/connect?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.integrations || []);
      }
    } catch (error) {
      console.error("Error fetching integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    setConnecting(platform);

    try {
      // TODO: Implement OAuth flow
      // For now, show a placeholder message
      alert(
        `${platform}連携は現在準備中です。\n\nOAuth認証フローを実装後に利用可能になります。`
      );
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      alert("連携に失敗しました。もう一度お試しください。");
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm("本当に連携を解除しますか？")) {
      return;
    }

    try {
      // TODO: Replace with actual userId from auth
      const userId = "demo-user-id";

      const response = await fetch(
        `/api/sns/connect?integrationId=${integrationId}&userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setIntegrations((prev) =>
          prev.filter((int) => int.id !== integrationId)
        );
        alert("連携を解除しました");
      } else {
        throw new Error("Failed to disconnect");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
      alert("連携解除に失敗しました。もう一度お試しください。");
    }
  };

  const getIntegrationStatus = (platform: string) => {
    return integrations.find((int) => int.platform === platform);
  };

  const platforms = [
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      hoverColor: "hover:bg-sky-600",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg font-light text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {platforms.map((platform) => {
        const integration = getIntegrationStatus(platform.id);
        const isConnected = !!integration;
        const Icon = platform.icon;

        return (
          <div
            key={platform.id}
            className="flex items-center justify-between rounded-apple border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${platform.color} text-white`}
              >
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {platform.name}
                </h3>
                {isConnected ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle size={16} />
                    <span>連携済み</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <XCircle size={16} />
                    <span>未連携</span>
                  </div>
                )}
              </div>
            </div>

            {isConnected ? (
              <button
                onClick={() => handleDisconnect(integration.id)}
                className="rounded-apple border border-red-300 px-6 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
              >
                連携解除
              </button>
            ) : (
              <button
                onClick={() => handleConnect(platform.id)}
                disabled={connecting === platform.id}
                className={`rounded-apple ${platform.color} ${platform.hoverColor} px-6 py-2 text-sm font-medium text-white transition-all disabled:opacity-50`}
              >
                {connecting === platform.id ? "接続中..." : "連携する"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
