import { describe, it, expect, beforeEach } from "vitest";

import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms-use-case";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "JavaScript GYM",
      latitude: -22.59815169206634,
      longitude: -46.52535095013803,
    });

    await gymsRepository.create({
      title: "TypeScript GYM",
      latitude: -22.59489025410714,
      longitude: -46.52989522041004,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.59815169206634,
      userLongitude: -46.52535095013803,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript GYM",
      }),
      expect.objectContaining({
        title: "TypeScript GYM",
      }),
    ]);
  });

  it("should not be able to search for gyms for a long time", async () => {
    await gymsRepository.create({
      title: "JavaScript GYM",
      latitude: -22.59815169206634,
      longitude: -46.52535095013803,
    });

    await gymsRepository.create({
      title: "TypeScript GYM",
      latitude: -22.59489025410714,
      longitude: -46.52989522041004,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.491192161064227,
      userLongitude: -47.015483851858086,
    });

    expect(gyms).toHaveLength(0);
  });
});
