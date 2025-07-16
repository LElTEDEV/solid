import { hash } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";

import { GetUserProfileUseCase } from "./get-user-profile-use-case";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

let inMemoryRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(inMemoryRepository);
  });

  it("should be able get user profile", async () => {
    const createdUser = await inMemoryRepository.create({
      name: "John Doe",
      email: "jhondoe@gmail.com",
      password_hash: await hash("123123", 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
  });

  it("should not be able get user profile with wrong id", async () => {
    expect(async () => {
      await sut.execute({ userId: "user-0202" });
    }).rejects.instanceOf(ResourceNotFoundError);
  });
});
