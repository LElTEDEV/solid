import { describe, it, expect, beforeEach } from "vitest";

import { CreateGymUseCase } from "./create-gym-use-case";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "Equipe Sette GYM",
      description: null,
      phone: null,
      latitude: -22.585800903457386,
      longitude: -46.52676550564235,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
