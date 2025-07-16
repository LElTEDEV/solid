import { describe, it, expect, beforeEach } from "vitest";

import { GetUserMetricsUseCase } from "./get-user-metrics-use-case";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("sould be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkInsCount } = await sut.execute({ userId: "user-01" });

    expect(checkInsCount).toBe(1);
  });
});
