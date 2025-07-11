import { hash } from "bcryptjs";
import { describe, it, expect } from "vitest";

import { AuthenticateUseCase } from "./authenticate-use-case";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate Use Case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    expect(async () => {
      await sut.execute({ email: "johndoe@gmail.com", password: "123123" });
    }).rejects.instanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

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
