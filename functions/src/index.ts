import {
  decrementCountOnPhysicalDelete,
  decrementOrIncrementCountOnUpdate,
  incrementCountOnCreate,
} from "./groups/aggregatesCount";

//firestore document triggers
export const usersCountOnCreate = incrementCountOnCreate("users");
export const usersCountOnUpdate = decrementOrIncrementCountOnUpdate("users");
export const usersCountOnDelete = decrementCountOnPhysicalDelete("users");

//export const freightOffersCountOnCreate = incrementCountOnCreate("freightOffers");
//export const freightOffersCountOnUpdate = decrementOrIncrementCountOnUpdate("freightOffers");
//export const freightOffersCountOnDelete = decrementCountOnPhysicalDelete("freightOffers");
