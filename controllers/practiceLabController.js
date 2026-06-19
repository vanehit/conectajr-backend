import PracticeLabSession from "../models/PracticeLabSession.js";
import User from "../models/User.js";

const VALID_STACKS = ["HTML", "CSS", "JavaScript", "React", "TypeScript"];

const normalizeConcepts = (concepts = [], status) => {
  if (!Array.isArray(concepts)) return [];

  return concepts
    .filter((concept) => concept && typeof concept.concept === "string")
    .map((concept) => ({
      concept: concept.concept.trim(),
      score: Number(concept.score) || 0,
      status,
    }))
    .filter((concept) => concept.concept.length > 0);
};

const normalizeAnswers = (answers = []) => {
  if (!Array.isArray(answers)) return [];

  return answers
    .filter((answer) => answer && typeof answer.challengeId === "string")
    .map((answer) => ({
      challengeId: answer.challengeId.trim(),
      wasCorrect: Boolean(answer.wasCorrect),
      sourceConcepts: Array.isArray(answer.sourceConcepts)
        ? answer.sourceConcepts
            .filter((concept) => typeof concept === "string")
            .map((concept) => concept.trim())
            .filter(Boolean)
        : [],
    }))
    .filter((answer) => answer.challengeId.length > 0);
};

export const createPracticeLabSession = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const {
      stack,
      earnedXp,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      accuracyRate,
      dominantConcepts,
      improvementConcepts,
      seniorityGap,
      nextRecommendedTopic,
      answers,
      sessionSource,
    } = req.body;

    if (!stack || !VALID_STACKS.includes(stack)) {
      return res.status(400).json({ message: "Stack inválido" });
    }

    if (
      typeof earnedXp !== "number" ||
      typeof totalQuestions !== "number" ||
      typeof answeredQuestions !== "number" ||
      typeof correctAnswers !== "number" ||
      typeof accuracyRate !== "number"
    ) {
      return res.status(400).json({
        message: "Los datos numéricos de la sesión son inválidos",
      });
    }

    if (!seniorityGap || typeof seniorityGap !== "string") {
      return res.status(400).json({ message: "seniorityGap es requerido" });
    }

    if (!nextRecommendedTopic || typeof nextRecommendedTopic !== "string") {
      return res
        .status(400)
        .json({ message: "nextRecommendedTopic es requerido" });
    }

    const normalizedDominantConcepts = normalizeConcepts(
      dominantConcepts,
      "strong",
    );

    const normalizedImprovementConcepts = normalizeConcepts(
      improvementConcepts,
      "needs-work",
    );

    const normalizedAnswers = normalizeAnswers(answers);

    const session = await PracticeLabSession.create({
      userId,
      stack,
      earnedXp,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      accuracyRate,
      dominantConcepts: normalizedDominantConcepts,
      improvementConcepts: normalizedImprovementConcepts,
      seniorityGap: seniorityGap.trim(),
      nextRecommendedTopic: nextRecommendedTopic.trim(),
      answers: normalizedAnswers,
      sessionSource:
        typeof sessionSource === "string" && sessionSource.trim()
          ? sessionSource.trim()
          : "interview-simulator",
    });

    const strongestStacks = [stack];

    const focusConcepts = normalizedImprovementConcepts
      .map((concept) => concept.concept)
      .filter(Boolean)
      .slice(0, 5);

    await User.findByIdAndUpdate(userId, {
      $inc: {
        "practiceLabStats.totalSessions": 1,
        "practiceLabStats.totalXp": earnedXp,
      },
      $set: {
        "practiceLabStats.lastPracticeAt": new Date(),
        "practiceLabStats.strongestStacks": strongestStacks,
        "practiceLabStats.focusConcepts": focusConcepts,
      },
    });

    return res.status(201).json({
      message: "Sesión de Practice Lab guardada correctamente",
      sessionId: session._id,
    });
  } catch (error) {
    console.error("Error creating Practice Lab session", error);
    return res.status(500).json({
      message: "Error interno al guardar la sesión de Practice Lab",
    });
  }
};
