/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai_model from "../ai_model.js";
import type * as chunk from "../chunk.js";
import type * as conversations from "../conversations.js";
import type * as dashboard from "../dashboard.js";
import type * as documentHerbs from "../documentHerbs.js";
import type * as documents from "../documents.js";
import type * as herbs from "../herbs.js";
import type * as messages from "../messages.js";
import type * as research from "../research.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai_model: typeof ai_model;
  chunk: typeof chunk;
  conversations: typeof conversations;
  dashboard: typeof dashboard;
  documentHerbs: typeof documentHerbs;
  documents: typeof documents;
  herbs: typeof herbs;
  messages: typeof messages;
  research: typeof research;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
