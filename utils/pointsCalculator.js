export const calculatePoints = (correctAnswers, totalQuestions) => {
  return Math.round((correctAnswers / totalQuestions) * 100);
};
