/**
 * MBTI診断ロジック
 * 60問の回答から4文字のMBTIタイプを判定
 */

export interface Answer {
  questionId: number;
  value: number; // 1-5 (1=強く反対, 5=強く賛成)
}

export interface MBTIScores {
  E: number; // Extraversion
  I: number; // Introversion
  S: number; // Sensing
  N: number; // Intuition
  T: number; // Thinking
  F: number; // Feeling
  J: number; // Judging
  P: number; // Perceiving
}

/**
 * 質問IDから対応するMBTI軸を返す
 * 1-15: E/I, 16-30: S/N, 31-45: T/F, 46-60: J/P
 */
function getAxisForQuestion(questionId: number): keyof MBTIScores {
  if (questionId <= 15) {
    return questionId % 2 === 1 ? 'E' : 'I';
  } else if (questionId <= 30) {
    return questionId % 2 === 1 ? 'S' : 'N';
  } else if (questionId <= 45) {
    return questionId % 2 === 1 ? 'T' : 'F';
  } else {
    return questionId % 2 === 1 ? 'J' : 'P';
  }
}

/**
 * 60問の回答からMBTIスコアを計算
 */
export function calculateMBTIScores(answers: Answer[]): MBTIScores {
  const scores: MBTIScores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  answers.forEach(answer => {
    const axis = getAxisForQuestion(answer.questionId);
    scores[axis] += answer.value;
  });

  return scores;
}

/**
 * スコアから4文字のMBTIタイプを決定
 */
export function determineMBTIType(scores: MBTIScores): string {
  const type = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P',
  ].join('');

  return type;
}

/**
 * スコアをパーセンテージに変換（表示用）
 */
export function scoresToPercentages(scores: MBTIScores) {
  const total_EI = scores.E + scores.I;
  const total_SN = scores.S + scores.N;
  const total_TF = scores.T + scores.F;
  const total_JP = scores.J + scores.P;

  return {
    E: Math.round((scores.E / total_EI) * 100),
    I: Math.round((scores.I / total_EI) * 100),
    S: Math.round((scores.S / total_SN) * 100),
    N: Math.round((scores.N / total_SN) * 100),
    T: Math.round((scores.T / total_TF) * 100),
    F: Math.round((scores.F / total_TF) * 100),
    J: Math.round((scores.J / total_JP) * 100),
    P: Math.round((scores.P / total_JP) * 100),
  };
}
