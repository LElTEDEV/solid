import { FetchUserCheckInsHistory } from "../fetch-user-check-ins-history-use-case";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHistory(checkInsRepository);

  return useCase;
}
