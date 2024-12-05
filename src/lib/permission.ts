import { SubscriptionLevel } from "./subscription";

export function canCreateResume(
  subscriptionLevel: SubscriptionLevel,
  currentResumeCount: number,
) {
  const maxResumeMap: Record<SubscriptionLevel, number> = {
    free: 2,
    pro: 5,
    pro_plus: Infinity,
  };

  const maxResume = maxResumeMap[subscriptionLevel];

  return currentResumeCount < maxResume;
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
  return subscriptionLevel !== "free";
}

export function canUseCustomization(subscriptionLevel: SubscriptionLevel) {
  return subscriptionLevel === "pro_plus";
}
