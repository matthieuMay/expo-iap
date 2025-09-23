---
sidebar_position: 2
---

import AdFitTopFixed from "@site/src/uis/AdFitTopFixed";

# Error Codes

<AdFitTopFixed />

Expo IAP provides a centralized error handling system with platform-specific error code mapping. This ensures consistent error handling across iOS and Android platforms.

## Error Code Enum

### ErrorCode

The `ErrorCode` enum provides standardized error codes that map to platform-specific errors:

```tsx
import {ErrorCode} from 'expo-iap';

export enum ErrorCode {
  Unknown = 'Unknown',
  UserCancelled = 'UserCancelled',
  UserError = 'UserError',
  ItemUnavailable = 'ItemUnavailable',
  RemoteError = 'RemoteError',
  NetworkError = 'NetworkError',
  ServiceError = 'ServiceError',
  ReceiptFailed = 'ReceiptFailed',
  ReceiptFinished = 'ReceiptFinished',
  ReceiptFinishedFailed = 'ReceiptFinishedFailed',
  NotPrepared = 'NotPrepared',
  NotEnded = 'NotEnded',
  AlreadyOwned = 'AlreadyOwned',
  DeveloperError = 'DeveloperError',
  BillingResponseJsonParseError = 'BillingResponseJsonParseError',
  DeferredPayment = 'DeferredPayment',
  Interrupted = 'Interrupted',
  IapNotAvailable = 'IapNotAvailable',
  PurchaseError = 'PurchaseError',
  SyncError = 'SyncError',
  TransactionValidationFailed = 'TransactionValidationFailed',
  ActivityUnavailable = 'ActivityUnavailable',
  AlreadyPrepared = 'AlreadyPrepared',
  Pending = 'Pending',
  ConnectionClosed = 'ConnectionClosed',
  InitConnection = 'InitConnection',
  ServiceDisconnected = 'ServiceDisconnected',
  QueryProduct = 'QueryProduct',
  SkuNotFound = 'SkuNotFound',
  SkuOfferMismatch = 'SkuOfferMismatch',
  ItemNotOwned = 'ItemNotOwned',
  BillingUnavailable = 'BillingUnavailable',
  FeatureNotSupported = 'FeatureNotSupported',
  EmptySkuList = 'EmptySkuList',
}
```

## PurchaseError

A custom error class for purchase-related errors.

```tsx
export interface PurchaseErrorProps {
  message: string;
  responseCode?: number;
  debugMessage?: string;
  code?: ErrorCode;
  productId?: string;
  platform?: IapPlatform;
}

export type PurchaseError = Error & PurchaseErrorProps;
```

### createPurchaseError

Creates a `PurchaseError` instance.

```tsx
export const createPurchaseError = (
  props: PurchaseErrorProps,
): PurchaseError => {
  // ...
};
```

### createPurchaseErrorFromPlatform

Creates a `PurchaseError` from a platform-specific error.

```tsx
export const createPurchaseErrorFromPlatform = (
  errorData: PlatformErrorData,
  platform: IapPlatform,
): PurchaseError => {
  // ...
};
```

## ErrorCodeUtils

Utility functions for error code mapping and validation.

### getNativeErrorCode

Gets the native error code for the current platform:

```tsx
ErrorCodeUtils.getNativeErrorCode(errorCode: ErrorCode): string
```

### fromPlatformCode

Maps platform-specific error code to standardized ErrorCode:

```tsx
ErrorCodeUtils.fromPlatformCode(
  platformCode: string | number,
  platform: 'ios' | 'android',
): ErrorCode
```

### toPlatformCode

Maps ErrorCode to platform-specific code:

```tsx
ErrorCodeUtils.toPlatformCode(
  errorCode: ErrorCode,
  platform: 'ios' | 'android',
): string | number
```

### isValidForPlatform

Checks if error code is valid for the specified platform:

```tsx
ErrorCodeUtils.isValidForPlatform(
  errorCode: ErrorCode,
  platform: 'ios' | 'android',
): boolean
```

## Error Helper Functions

These functions help interpret error objects.

### isUserCancelledError

Returns `true` if the error is a user cancellation error.

```tsx
export function isUserCancelledError(error: unknown): boolean;
```

### isNetworkError

Returns `true` if the error is a network-related error.

```tsx
export function isNetworkError(error: unknown): boolean;
```

### isRecoverableError

Returns `true` if the error is a recoverable error.

```tsx
export function isRecoverableError(error: unknown): boolean;
```

### getUserFriendlyErrorMessage

Returns a user-friendly error message for a given error.

```tsx
export function getUserFriendlyErrorMessage(error: ErrorLike): string;
```

## User-Friendly Error Messages

The `getUserFriendlyErrorMessage` function provides localized and user-friendly messages for common errors.

| ErrorCode | Message |
| --- | --- |
| `UserCancelled` | 'Purchase was cancelled by user' |
| `NetworkError` | 'Network connection error. Please check your internet connection and try again.' |
| `ReceiptFinished` | 'Receipt already finished' |
| `ServiceDisconnected` | 'Billing service disconnected. Please try again.' |
| `BillingUnavailable` | 'Billing is unavailable on this device or account.' |
| `ItemUnavailable` | 'This item is not available for purchase' |
| `ItemNotOwned` | "You don't own this item" |
| `AlreadyOwned` | 'You already own this item' |
| `SkuNotFound` | 'Requested product could not be found' |
| `SkuOfferMismatch` | 'Selected offer does not match the SKU' |
| `DeferredPayment` | 'Payment is pending approval' |
| `NotPrepared` | 'In-app purchase is not ready. Please try again later.' |
| `ServiceError` | 'Store service error. Please try again later.' |
| `FeatureNotSupported` | 'This feature is not supported on this device.' |
| `TransactionValidationFailed` | 'Transaction could not be verified' |
| `ReceiptFailed` | 'Receipt processing failed' |
| `EmptySkuList` | 'No product IDs provided' |
| `InitConnection` | 'Failed to initialize billing connection' |
| `QueryProduct` | 'Failed to query products. Please try again later.' |
| _default_ | 'An unexpected error occurred' |

## See Also

- [Error Handling Guide](../guides/error-handling)
- [useIAP Hook](./use-iap)
- [Types Reference](./types)
- [Troubleshooting](../guides/troubleshooting)
