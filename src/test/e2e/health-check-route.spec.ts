import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../main.module";

describe("E2E - HealthCheckRoute", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should return a 200 status code", () => {
    return request(app.getHttpServer())
      .get("/health-check")
      .expect(200)
      .expect("Hello World!");
  });
});
