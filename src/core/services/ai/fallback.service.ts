import type { TimelineEvent } from "@/modules/timeline/repository/timeline.repository";
import { logger } from "@/core/utils/logger";

export interface MisinformationResult {
  verdict: "true" | "false" | "uncertain";
  confidence: number;
  explanation: string;
}

export const fallbackAiService = {
  buildLearningJourney(input: { age: number; isFirstTimeVoter: boolean; location: string }): {
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    steps: {
      order: number;
      title: string;
      description: string;
      isCompleted: boolean;
    }[];
  } {
    const level: "beginner" | "intermediate" | "advanced" =
      input.age < 22 || input.isFirstTimeVoter ? "beginner" : "intermediate";
    return {
      title: `Election readiness plan for ${input.location}`,
      description:
        "A practical step-by-step path to complete registration, understand voting day flow, and avoid common mistakes.",
      difficulty: level,
      steps: [
        {
          order: 1,
          title: "Check voter eligibility and constituency",
          description:
            "Confirm age eligibility, address, and constituency details before starting registration.",
          isCompleted: false,
        },
        {
          order: 2,
          title: "Complete registration and document verification",
          description:
            "Prepare ID/address documents and submit your voter registration application.",
          isCompleted: false,
        },
        {
          order: 3,
          title: "Track election timeline and preparation checklist",
          description: "Save key deadlines and prepare travel/documents needed on voting day.",
          isCompleted: false,
        },
        {
          order: 4,
          title: "Practice polling-day workflow",
          description: "Review booth process, EVM flow, and what to do if voter list issues occur.",
          isCompleted: false,
        },
      ],
    };
  },

  buildTimelineSummary(events: TimelineEvent[]) {
    if (events.length === 0) {
      return {
        title: "No timeline available",
        description: "No election timeline is currently configured. Please check back later.",
      };
    }

    const sorted = [...events].sort((a, b) => (a.date < b.date ? -1 : 1));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    return {
      title: "Election timeline summary",
      description: `The timeline starts with "${first.title}" and concludes with "${last.title}". Focus first on registration and document readiness.`,
    };
  },

  buildChatReply(message: string) {
    logger.info({ message }, "Demo chat");
    const lower = message.toLowerCase();
    if (lower.includes("document")) {
      return "For most cases, keep a valid photo ID, address proof, and any constituency-specific document requirements ready. Verify official local election guidance before submission.";
    }
    if (lower.includes("moved") || lower.includes("shift")) {
      return "If you recently moved, update your voter registration to the new constituency as early as possible and track correction deadlines.";
    }
    if (lower.includes("register")) {
      return "Start registration early, keep your identity/address proof ready, and monitor status updates to avoid deadline pressure.";
    }

    return "I can help with eligibility, registration, timelines, polling-day process, and misinformation checks. Ask a specific election-process question and I’ll guide you step by step.";
  },

  checkMisinformation(content: string): MisinformationResult {
    const lower = content.toLowerCase();
    if (lower.includes("anyone can vote without id")) {
      return {
        verdict: "false",
        confidence: 0.93,
        explanation:
          "Voting requires identity verification and eligibility checks; blanket claims that no ID is needed are misleading.",
      };
    }
    if (lower.includes("voting date changed") && !lower.includes("official")) {
      return {
        verdict: "uncertain",
        confidence: 0.66,
        explanation:
          "Date-change claims must be verified from official election authority notifications before sharing.",
      };
    }

    return {
      verdict: "uncertain",
      confidence: 0.58,
      explanation:
        "This claim cannot be conclusively verified from local context alone. Cross-check with the official election authority source before acting.",
    };
  },

  getSimulationSteps() {
    return [
      {
        id: "identity-verification",
        title: "Identity verification",
        instruction:
          "Present your valid voter identification and confirm your polling station details.",
      },
      {
        id: "evm-instructions",
        title: "EVM usage",
        instruction:
          "Review how to locate your candidate and cast your vote correctly on the machine.",
      },
      {
        id: "vote-submission",
        title: "Vote submission",
        instruction: "Complete voting, confirm acknowledgement, and follow post-vote procedure.",
      },
    ];
  },

  evaluateSimulationStep(stepId: string, response: string) {
    if (response.trim().length < 5) {
      return {
        success: false,
        feedback: "Add a bit more detail so we can confirm your understanding.",
      };
    }

    return {
      success: true,
      feedback: `Step "${stepId}" understood. You can move to the next stage.`,
    };
  },
};
