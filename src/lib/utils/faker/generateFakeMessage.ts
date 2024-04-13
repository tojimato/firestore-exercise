import { Message } from "../../models";
import { faker } from "@faker-js/faker";

// Message için sahte veri üretme
export const generateFakeMessage = (): Message => {
  return {
    message: faker.lorem.sentence(), // Rastgele bir cümle üretir
  };
};
