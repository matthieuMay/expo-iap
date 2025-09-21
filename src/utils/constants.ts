// Centralized product ID constants for examples and internal usage
// Rename guide: subscriptionIds -> SUBSCRIPTION_PRODUCT_IDS, PRODUCT_IDS remains the same name

// One-time purchase product IDs split by consumption behavior
export const CONSUMABLE_PRODUCT_IDS: string[] = [
  'dev.hyo.martie.10bulbs',
  'dev.hyo.martie.30bulbs',
];

export const NON_CONSUMABLE_PRODUCT_IDS: string[] = [
  'dev.hyo.martie.certified',
];

export const PRODUCT_IDS: string[] = [
  ...CONSUMABLE_PRODUCT_IDS,
  ...NON_CONSUMABLE_PRODUCT_IDS,
];

// Subscription product IDs
export const SUBSCRIPTION_PRODUCT_IDS: string[] = ['dev.hyo.martie.premium'];

// Optionally export a single default subscription for convenience
export const DEFAULT_SUBSCRIPTION_PRODUCT_ID = SUBSCRIPTION_PRODUCT_IDS[0];
