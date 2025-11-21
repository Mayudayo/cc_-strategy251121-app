"use client";

import { motion } from "framer-motion";

interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    description: string;
    emoji: string;
    conversationStyle: string;
    personalityTraits?: any;
  };
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="mx-auto max-w-2xl overflow-hidden rounded-apple bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg"
    >
      <div className="mb-6 text-center text-8xl">{character.emoji}</div>

      <h3 className="mb-4 text-center text-3xl font-medium text-gray-900">
        {character.name}
      </h3>

      <p className="mb-6 text-center text-lg font-light leading-relaxed text-gray-600">
        {character.description}
      </p>

      <div className="rounded-apple bg-white/70 p-6 backdrop-blur-md">
        <h4 className="mb-3 text-center text-xl font-medium text-gray-900">
          対話スタイル
        </h4>
        <p className="text-center text-base font-light text-gray-700">
          {character.conversationStyle}
        </p>
      </div>
    </motion.div>
  );
}
