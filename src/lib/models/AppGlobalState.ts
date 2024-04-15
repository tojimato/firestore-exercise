import { User } from "./User";

export type AppGlobalState = {
  theme: "light" | "dark";
  language: "en" | "tr";
  currentUser?: User
};
