import { ValidadeCheckInUseCase } from "../validate-check-in-use-case";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeValidatedCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository();
  const useCase = new ValidadeCheckInUseCase(checkInRepository);

  return useCase;
}
