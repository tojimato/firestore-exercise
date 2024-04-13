import { User } from "../../models";
import { faker } from "@faker-js/faker";

export const generateFakeUser = (): User => {
  return {
    first: faker.person.firstName(),
    last: faker.person.lastName(),
    born: faker.date
      .between({ from: "1970-01-01", to: "2000-12-31" })
      .getFullYear(),
    additional: {
      email: faker.internet.email(),
      phone: faker.phone.number(),
    },
  };
};
