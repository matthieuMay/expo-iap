---
title: Core Methods
sidebar_label: Core Methods
sidebar_position: 1
---

import AdFitTopFixed from "@site/src/uis/AdFitTopFixed";

# Core Methods

<AdFitTopFixed />

This section covers the core methods available in expo-iap for managing in-app purchases.

Note: expo-iap aligns with the OpenIAP API surface. For canonical cross-SDK API docs, see:

- [OpenIAP APIs](https://www.openiap.dev/docs/apis)

## Unified APIs

These cross‑platform methods work on both iOS and Android. For StoreKit/Play‑specific helpers, see the Platform‑specific APIs section below.

- `initConnection()` — Initialize the store connection
- `endConnection()` — End the store connection and cleanup
- `fetchProducts()` — Fetch product and subscription metadata
- `requestPurchase()` — Start a purchase for products or subscriptions
- `finishTransaction()` — Complete a transaction after validation
- `getAvailablePurchases()` — Restore non‑consumables and subscriptions
- `deepLinkToSubscriptions()` — Open native subscription management UI
- `getStorefront()` — Get current storefront country code
- `hasActiveSubscriptions()` — Check if user has active subscriptions

## initConnection()

Initializes the connection to the store. This method must be called before any other store operations.

```tsx
import {initConnection} from 'expo-iap';

const initialize = async () => {
  try {
    await initConnection();
    console.log('Store connection initialized');
  } catch (error) {
    console.error('Failed to initialize connection:', error);
  }
};
```

**Returns:** `Promise<boolean>`

**Note:** When using the `useIAP` hook, connection is automatically managed.

## endConnection()

Ends the connection to the store and cleans up resources.

```tsx
import {endConnection} from 'expo-iap';

const cleanup = async () => {
  try {
    await endConnection();
    console.log('Store connection ended');
  } catch (error) {
    console.error('Failed to end connection:', error);
  }
};
```

**Returns:** `Promise<void>`

**Note:** When using the `useIAP` hook, connection cleanup is automatic.

## fetchProducts()

Fetches product or subscription information from the store.

```tsx
import {fetchProducts} from 'expo-iap';

// Fetch in-app products
const loadProducts = async () => {
  try {
    const products = await fetchProducts({
      skus: ['com.example.product1', 'com.example.product2'],
      type: 'inapp',
    });

    console.log('Products:', products);
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

// Fetch subscriptions
const loadSubscriptions = async () => {
  try {
    const subscriptions = await fetchProducts({
      skus: ['com.example.premium_monthly', 'com.example.premium_yearly'],
      type: 'subs',
    });

    console.log('Subscriptions:', subscriptions);
    return subscriptions;
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
  }
};
```

**Parameters:**

- `params` (object):
  - `skus` (string[]): Array of product or subscription IDs to fetch
  - `type` ('inapp' | 'subs'): Product type - 'inapp' for products, 'subs' for subscriptions

**Returns:** `Promise<Product[]>`

[**Product Interface**](../types.md#product)

## requestPurchase()

Initiates a purchase request for products or subscriptions.

> **⚠️ Platform Differences:**
>
> - **iOS**: Can only purchase one product at a time (uses `sku: string`)
> - **Android**: Can purchase multiple products at once (uses `skus: string[]`)
>
> This exists because the iOS App Store processes purchases individually, while Google Play supports batch purchases.

### Recommended usage (no Platform checks)

```tsx
import {requestPurchase} from 'expo-iap';

// Product purchase
const buyProduct = async (productId: string) => {
  try {
    await requestPurchase({
      request: {
        ios: {
          sku: productId,
          quantity: 1,
        },
        android: {
          skus: [productId],
        },
      },
      type: 'inapp',
    });
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};

// Subscription purchase
const buySubscription = async (subscriptionId: string, subscription?: any) => {
  try {
    await requestPurchase({
      request: {
        ios: {
          sku: subscriptionId,
          appAccountToken: 'user-123',
        },
        android: {
          skus: [subscriptionId],
          subscriptionOffers:
            subscription?.subscriptionOfferDetails?.map((offer) => ({
              sku: subscriptionId,
              offerToken: offer.offerToken,
            })) || [],
        },
      },
      type: 'subs',
    });
  } catch (error) {
    console.error('Subscription failed:', error);
  }
};
```

### Detailed Platform Examples

#### iOS Only

```tsx
await requestPurchase({
  request: {
    sku: productId,
    quantity: 1,
    appAccountToken: 'user-account-token',
  },
  type: 'inapp',
});
```

#### Android Only

```tsx
await requestPurchase({
  request: {
    skus: [productId],
    obfuscatedAccountIdAndroid: 'user-account-id',
    obfuscatedProfileIdAndroid: 'user-profile-id',
  },
  type: 'inapp',
});
```

**Parameters:**

- `params` (object):
  - `request` (object): Purchase request configuration
    - **iOS**: `sku` (string) - Product ID to purchase
    - **Android**: `skus` (string[]) - Array of product IDs to purchase
    - **Cross-platform**: Include both `sku` and `skus` for compatibility
    - `quantity?` (number, iOS only): Purchase quantity
    - `appAccountToken?` (string, iOS only): User identifier for receipt validation
    - `obfuscatedAccountIdAndroid?` (string, Android only): Obfuscated account ID
    - `obfuscatedProfileIdAndroid?` (string, Android only): Obfuscated profile ID
    - `isOfferPersonalized?` (boolean, Android only): Whether offer is personalized
  - `type?` ('inapp' | 'subs'): Purchase type, defaults to 'inapp'

**Returns:** `Promise<Purchase | Purchase[] | void>`

**Note:** The actual purchase result is delivered through purchase listeners or the `useIAP` hook callbacks, not as a return value.

#### Important Subscription Properties

For subscription status checks after a purchase or when listing entitlements:

- iOS: Check `expirationDateIOS` to determine if the subscription is still active
- Android: Check `autoRenewingAndroid` to see if auto‑renewal has been canceled

## finishTransaction()

Completes a purchase transaction. Must be called after successful receipt validation.

```tsx
import {finishTransaction} from 'expo-iap';

const completePurchase = async (purchase) => {
  try {
    // Validate receipt on your server first
    const isValid = await validateReceiptOnServer(purchase);

    if (isValid) {
      // Grant purchase to user
      await grantPurchaseToUser(purchase);

      // Finish the transaction
      await finishTransaction({
        purchase,
        isConsumable: true, // Set to true for consumable products
      });

      console.log('Transaction completed');
    }
  } catch (error) {
    console.error('Failed to finish transaction:', error);
  }
};
```

**Parameters:**

- `params` (object):
  - `purchase` (Purchase): The purchase object to finish
  - `isConsumable?` (boolean): Whether the product is consumable (Android)

**Returns:** `Promise<VoidResult | boolean>`

## getAvailablePurchases()

Retrieves available purchases for restoration (non-consumable products and subscriptions).

```tsx
import {getAvailablePurchases} from 'expo-iap';

const restorePurchases = async () => {
  try {
    const purchases = await getAvailablePurchases();

    for (const purchase of purchases) {
      // Validate and restore each purchase
      const isValid = await validateReceiptOnServer(purchase);
      if (isValid) {
        await grantPurchaseToUser(purchase);
      }
    }

    console.log('Purchases restored');
  } catch (error) {
    console.error('Failed to restore purchases:', error);
  }
};
```

**Parameters:**

- `options?` (iOS only):
  - `alsoPublishToEventListenerIOS?`: boolean
  - `onlyIncludeActiveItemsIOS?`: boolean

**Returns:** `Promise<Purchase[]>`

## deepLinkToSubscriptions()

Opens the platform-specific subscription management UI.

```tsx
import {deepLinkToSubscriptions} from 'expo-iap';

const openSubscriptionSettings = () => {
  try {
    deepLinkToSubscriptions({skuAndroid: 'your_subscription_sku'});
  } catch (error) {
    console.error('Failed to open subscription settings:', error);
  }
};
```

**Returns:** `Promise<void>`

## getStorefront()

Return the storefront in ISO 3166-1 alpha-2 or ISO 3166-1 alpha-3 format

```tsx
import {getStorefront} from 'expo-iap';

const storeFront = await getStorefront();
```

**Returns:** `Promise<string>`

## getActiveSubscriptions()

Retrieves all active subscriptions with detailed status information. This method follows the OpenIAP specification for cross-platform subscription management.

```tsx
import {getActiveSubscriptions} from 'expo-iap';

const checkSubscriptions = async () => {
  try {
    // Get all active subscriptions
    const allActiveSubscriptions = await getActiveSubscriptions();

    // Or filter by specific subscription IDs
    const specificSubscriptions = await getActiveSubscriptions([
      'premium_monthly',
      'premium_yearly',
    ]);

    for (const subscription of allActiveSubscriptions) {
      console.log('Product ID:', subscription.productId);
      console.log('Is Active:', subscription.isActive);

      if (Platform.OS === 'ios') {
        console.log('Expiration Date:', subscription.expirationDateIOS);
        console.log(
          'Days until expiration:',
          subscription.daysUntilExpirationIOS,
        );
        console.log('Environment:', subscription.environmentIOS);
      } else if (Platform.OS === 'android') {
        console.log('Auto Renewing:', subscription.autoRenewingAndroid);
      }

      console.log('Will expire soon:', subscription.willExpireSoon);
    }
  } catch (error) {
    console.error('Failed to get active subscriptions:', error);
  }
};
```

**Parameters:**

- `subscriptionIds?` (string[]): Optional array of subscription product IDs to filter. If not provided, returns all active subscriptions.

**Returns:** `Promise<ActiveSubscription[]>`

**ActiveSubscription Interface:**

```typescript
interface ActiveSubscription {
  productId: string;
  isActive: boolean;
  expirationDateIOS?: Date;
  autoRenewingAndroid?: boolean;
  environmentIOS?: string;
  willExpireSoon?: boolean;
  daysUntilExpirationIOS?: number;
}
```

**Platform Behavior:**

- **iOS**: Uses `expirationDateIos` to determine subscription status. Includes expiration date and days until expiration.
- **Android**: Uses purchase list presence and `autoRenewingAndroid` flag to determine status.

## hasActiveSubscriptions()

Checks if the user has any active subscriptions. This is a convenience method that returns a boolean result.

```tsx
import {hasActiveSubscriptions} from 'expo-iap';

const checkIfUserHasSubscription = async () => {
  try {
    // Check if user has any active subscriptions
    const hasAny = await hasActiveSubscriptions();

    // Or check for specific subscriptions
    const hasPremium = await hasActiveSubscriptions([
      'premium_monthly',
      'premium_yearly',
    ]);

    if (hasAny) {
      console.log('User has active subscriptions');
    }

    if (hasPremium) {
      console.log('User has premium subscription');
    }
  } catch (error) {
    console.error('Failed to check subscription status:', error);
  }
};
```

**Parameters:**

- `subscriptionIds?` (string[]): Optional array of subscription product IDs to check. If not provided, checks all subscriptions.

**Returns:** `Promise<boolean>` - Returns true if user has at least one active subscription

## Purchase Interface

```tsx
interface Purchase {
  id: string; // Transaction identifier
  productId: string;
  transactionDate: number;
  purchaseToken?: string; // Unified token (iOS JWS or Android token)

  // iOS-specific properties
  originalTransactionDateIOS?: number;
  originalTransactionIdentifierIOS?: string;
  expirationDateIOS?: number;
  environmentIOS?: 'Production' | 'Sandbox';

  // Android-specific properties
  dataAndroid?: string;
  signatureAndroid?: string;
  purchaseStateAndroid?: number;
  isAcknowledgedAndroid?: boolean;
  packageNameAndroid?: string;
  developerPayloadAndroid?: string;
  obfuscatedAccountIdAndroid?: string;
  obfuscatedProfileIdAndroid?: string;
  autoRenewingAndroid?: boolean;
}
```

## Platform-specific APIs

### iOS Specific

The following iOS‑only helpers expose StoreKit and App Store specific capabilities. Most day‑to‑day flows are covered by the cross‑platform Core Methods above; use these only when you need iOS features.

### clearTransactionIOS()

Clears all pending transactions from the iOS payment queue. Useful if your app previously crashed or missed finishing transactions.

```ts
import {clearTransactionIOS, getPendingTransactionsIOS} from 'expo-iap';

// Inspect then clear
const pending = await getPendingTransactionsIOS();
if (pending.length) {
  await clearTransactionIOS();
}
```

Returns: `Promise<void>`

### getStorefrontIOS()

Returns the current App Store storefront country code (for example, "US", "GB").

```ts
import {getStorefrontIOS} from 'expo-iap';

const storefront = await getStorefrontIOS();
```

Returns: `Promise<string>`

### getPromotedProductIOS()

Gets the currently promoted product, if any. Requires iOS 11+.

```ts
import {getPromotedProductIOS} from 'expo-iap';

const promoted = await getPromotedProductIOS();
if (promoted) {
  // Show your purchase UI for the promoted product
}
```

Returns: `Promise<Product | null>`

### requestPurchaseOnPromotedProductIOS()

Initiates the purchase flow for the currently promoted product. Requires iOS 11+.

```ts
import {requestPurchaseOnPromotedProductIOS} from 'expo-iap';

await requestPurchaseOnPromotedProductIOS();
// Purchase result is delivered via purchase listeners/useIAP callbacks
```

Returns: `Promise<void>`

### getPendingTransactionsIOS()

Returns all transactions that are pending completion in the StoreKit payment queue.

```ts
import {getPendingTransactionsIOS} from 'expo-iap';

const pending = await getPendingTransactionsIOS();
```

Returns: `Promise<Purchase[]>`

### isEligibleForIntroOfferIOS()

Checks if the user is eligible for an introductory offer for a subscription group. Requires iOS 12.2+.

```ts
import {isEligibleForIntroOfferIOS, fetchProducts} from 'expo-iap';

// Example: derive group ID from a fetched subscription product
const [sub] = await fetchProducts({skus: ['your_sub_sku'], type: 'subs'});
const groupId = sub?.subscriptionInfoIOS?.subscriptionGroupId ?? '';
const eligible = groupId ? await isEligibleForIntroOfferIOS(groupId) : false;
```

Returns: `Promise<boolean>`

### subscriptionStatusIOS()

Returns detailed subscription status information using StoreKit 2. Requires iOS 15+.

```ts
import {subscriptionStatusIOS} from 'expo-iap';

const statuses = await subscriptionStatusIOS('your_sub_sku');
```

Returns: `Promise<SubscriptionStatusIOS[]>`

### currentEntitlementIOS()

Returns the current entitlement for a given SKU using StoreKit 2. Requires iOS 15+.

```ts
import {currentEntitlementIOS} from 'expo-iap';

const entitlement = await currentEntitlementIOS('your_sub_or_product_sku');
```

Returns: `Promise<Purchase | null>`

### latestTransactionIOS()

Returns the most recent transaction for a given SKU using StoreKit 2. Requires iOS 15+.

```ts
import {latestTransactionIOS} from 'expo-iap';

const last = await latestTransactionIOS('your_sku');
```

Returns: `Promise<Purchase | null>`

### showManageSubscriptionsIOS()

Opens the native subscription management interface and returns purchases for subscriptions whose auto‑renewal status changed while the sheet was open. Requires iOS 15+.

```ts
import {showManageSubscriptionsIOS} from 'expo-iap';

const changed = await showManageSubscriptionsIOS();
if (changed.length > 0) {
  // Update your UI / server using returned purchases
}
```

Returns: `Promise<Purchase[]>`

### beginRefundRequestIOS()

Presents the refund request sheet for a specific SKU. Requires iOS 15+.

```ts
import {beginRefundRequestIOS} from 'expo-iap';

const status = await beginRefundRequestIOS('your_sku');
// status: 'success' | 'userCancelled'
```

Returns: `Promise<'success' | 'userCancelled'>`

### isTransactionVerifiedIOS()

Verifies the latest transaction for a given SKU using StoreKit 2. Requires iOS 15+.

```ts
import {isTransactionVerifiedIOS} from 'expo-iap';

const ok = await isTransactionVerifiedIOS('your_sku');
```

Returns: `Promise<boolean>`

### getTransactionJwsIOS()

Returns the JSON Web Signature (JWS) for a transaction derived from a given SKU. Use this for server‑side validation. Requires iOS 15+.

```ts
import {getTransactionJwsIOS} from 'expo-iap';

const jws = await getTransactionJwsIOS('your_sku');
```

Returns: `Promise<string>`

### getReceiptDataIOS()

Returns the base64‑encoded receipt data for server validation.

```ts
import {getReceiptDataIOS} from 'expo-iap';

const receipt = await getReceiptDataIOS();
```

Returns: `Promise<string>`

### syncIOS()

Forces a sync with StoreKit to ensure all transactions are up to date. Requires iOS 15+.

```ts
import {syncIOS} from 'expo-iap';

await syncIOS();
```

Returns: `Promise<void>`

### presentCodeRedemptionSheetIOS()

Presents the system sheet for redeeming App Store promo/offer codes.

```ts
import {presentCodeRedemptionSheetIOS} from 'expo-iap';

await presentCodeRedemptionSheetIOS();
```

Returns: `Promise<boolean>`

### getAppTransactionIOS()

Gets app transaction information for iOS apps (iOS 16.0+). AppTransaction represents the initial purchase that unlocked the app, useful for premium apps or apps that were previously paid.

> Runtime: iOS 16.0+; Build: Xcode 15.0+ with iOS 16.0 SDK. Older SDKs will throw.

```tsx
import {getAppTransactionIOS} from 'expo-iap';

const fetchAppTransaction = async () => {
  try {
    const appTransaction = await getAppTransactionIOS();
    if (appTransaction) {
      console.log('App Transaction ID:', appTransaction.appTransactionId);
      console.log(
        'Original Purchase Date:',
        new Date(appTransaction.originalPurchaseDate),
      );
      console.log('Device Verification:', appTransaction.deviceVerification);
    }
  } catch (error) {
    console.error('Failed to get app transaction:', error);
  }
};
```

**Returns:** `Promise<AppTransaction | null>`

```ts
interface AppTransaction {
  appTransactionId?: string; // iOS 18.4+
  originalPlatform?: string; // iOS 18.4+
  bundleId: string;
  appVersion: string;
  originalAppVersion: string;
  originalPurchaseDate: number; // ms since epoch
  deviceVerification: string;
  deviceVerificationNonce: string;
  environment: string;
  signedDate: number;
  appId?: number;
  appVersionId?: number;
  preorderDate?: number;
}
```

### Android Specific

#### acknowledgePurchaseAndroid

Acknowledge a non‑consumable purchase or subscription on Android.

```ts
import {acknowledgePurchaseAndroid} from 'expo-iap';

await acknowledgePurchaseAndroid({token: purchase.purchaseToken!});
```

Notes:

- finishTransaction() calls this automatically when `isConsumable` is false. You typically do not need to call it directly.

#### consumePurchaseAndroid

Consume a purchase (consumables only). This marks an item as consumed so it can be purchased again.

Notes:

- finishTransaction() calls Android consumption automatically when `isConsumable` is true.
- A direct JS helper is not exposed; consumption is handled internally via the native module.

#### flushFailedPurchasesCachedAsPendingAndroid (Removed)

This legacy helper from older libraries has been removed. The modern flow is:

```ts
// On app startup (Android)
const purchases = await getAvailablePurchases();

for (const p of purchases) {
  if (/* consumable */) {
    // finishTransaction will consume on Android when isConsumable is true
    await finishTransaction({ purchase: p, isConsumable: true });
  } else {
    // finishTransaction will acknowledge on Android when isConsumable is false
    await finishTransaction({ purchase: p, isConsumable: false });
  }
}
```

This ensures pending transactions are surfaced and properly resolved without a separate “flush” API.

## Removed APIs

- `requestProducts()` — Removed in v3.0.0. Use `fetchProducts({ skus, type })` instead.
- `getProducts()` — Removed in v3.0.0. Use `fetchProducts({ skus, type: 'inapp' })` instead.
- `getSubscriptions()` — Removed in v3.0.0. Use `fetchProducts({ skus, type: 'subs' })` instead.
- `requestSubscription()` — Removed in v3.0.0. Use `requestPurchase({ ..., type: 'subs' })` and supply Android `subscriptionOffers`.
