import { SearchHeadlinesByKeywordOutput } from "../../types/chat";

export interface HeadlineWarning {
  flag: "average" | "extreme_source";
  message: string;
  lean: number;
}

export function getPoliticalBiasWarnings(
  politicalLeans: SearchHeadlinesByKeywordOutput,
): Record<string, HeadlineWarning> {
  if (!politicalLeans.length) return {};

  const thresholds = {
    extremeLeft: -3.4,
    extremeRight: 3.4,
    biasWarning: 2,
  };

  const totalLean = politicalLeans.reduce(
    (sum, entry) => sum + entry.political_lean,
    0,
  );
  const averageLean = totalLean / politicalLeans.length;

  const warnings: Record<string, HeadlineWarning> = {};

  if (
    averageLean >= thresholds.biasWarning ||
    averageLean <= -thresholds.biasWarning
  ) {
    warnings["average"] = {
      flag: "average",
      message: `The articles analyzed by the AI have an average political bias of ${averageLean.toFixed(1)}/4.0 points toward the ${averageLean > 0 ? "right" : "left"}. Please take this bias into account.`,
      lean: averageLean,
    };
  }

  const extremeSources = politicalLeans.filter(
    (entry) =>
      entry.political_lean >= thresholds.extremeRight ||
      entry.political_lean <= thresholds.extremeLeft,
  );

  if (extremeSources.length) {
    extremeSources.forEach((entry) => {
      warnings[entry.matched_publication] = {
        flag: "extreme_source",
        message: `The AI referenced one or more articles from ${entry.matched_publication}, which has a political bias of ${entry.political_lean.toFixed(1)}/4.0 points toward the ${entry.political_lean > 0 ? "right" : "left"}. Please take this bias into account.`,
        lean: entry.political_lean,
      };
    });
  }

  return warnings;
}
