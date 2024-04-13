import DefaultDataReference from "../database/DefaultDataReference";

export type User = {
  first: string;
  last: string;
  born: number;
  additional: {
    email: string;
    phone: string;
  };
} & DefaultDataReference;

