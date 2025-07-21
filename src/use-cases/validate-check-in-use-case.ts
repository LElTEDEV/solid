import { CheckInsRespository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

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

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes"
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);

    return { checkIn };
  }
}
