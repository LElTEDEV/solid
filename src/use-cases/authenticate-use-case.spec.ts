import { hash } from "bcryptjs";
import { describe, it, expect, beforeEach } from "vitest";

import { AuthenticateUseCase } from "./authenticate-use-case";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    usersRepository.create({
      name: "Jhoe Doe",
      email: "johndoe@gmail.com",
      password_hash: await hash("123123", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@gmail.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    expect(async () => {
      await sut.execute({ email: "johndoe@gmail.com", password: "123123" });
    }).rejects.instanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    usersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password_hash: await hash("123123", 6),
    });

    expect(async () => {
      await sut.execute({ email: "johndoe@gmail.com", password: "123123123" });
    }).rejects.instanceOf(InvalidCredentialsError);
  });
});
