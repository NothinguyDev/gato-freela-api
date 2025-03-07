import { randomUUID } from "node:crypto";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { FakeFactoryModule } from "../../modules/fake-factory.module";
import { FakeFactoryService } from "../../services/fake-factory.service";
import { PasswordLoginService } from "../../services/password-login.service";
import { PrismaService } from "../../services/prisma.service";
import { VerifyPasswordService } from "../../services/verify-password.service";
import { env } from "../../utils/config/env";

describe("Password LoginService", () => {
  let prismaService: PrismaService;
  let passwordLoginService: PasswordLoginService;
  let jwtService: JwtService;
  let fakeFactoryService: FakeFactoryService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FakeFactoryModule,
        JwtModule.register({
          secret: env.JWT_SECRET,
          secretOrPrivateKey: env.JWT_SECRET,
        }),
      ],
      providers: [PrismaService, PasswordLoginService, VerifyPasswordService],
    }).compile();

    passwordLoginService = moduleRef.get(PasswordLoginService);
    jwtService = moduleRef.get(JwtService);
    fakeFactoryService = moduleRef.get(FakeFactoryService);
  });

  it("should sign jwt", async () => {
    const { user } = await fakeFactoryService.generateUser({
      password: "password",
    });

    const { user: signedUser, jwt } = await passwordLoginService.execute({
      email: user.email,
      password: "password",
    });

    const decoded = jwtService.decode(jwt);
    expect(decoded).toHaveProperty("userId");
    expect(decoded).toHaveProperty("email");

    expect(signedUser.id).toBe(decoded.userId);
    expect(signedUser.email).toBe(decoded.email);

    expect(signedUser.password).toBeUndefined();
    expect(signedUser.salt).toBeUndefined();
  });
});
