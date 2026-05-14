import { DeepSeekTravelAiProvider } from "@/server/ai/deepseek";
import type { TravelAiProvider } from "@/server/ai/types";

export function createTravelAiProvider(): TravelAiProvider {
  return new DeepSeekTravelAiProvider();
}
