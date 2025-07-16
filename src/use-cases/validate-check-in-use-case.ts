import { CheckInsRespository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidadeCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidadeCheckInUseCase {
  constructor(private checkInRepository: CheckInsRespository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidadeCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) throw new ResourceNotFoundError();

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);

    return { checkIn };
  }
}
