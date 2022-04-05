import * as request from "supertest";
import { APP } from "../../app";

describe("Server startup", () => {
  let a: string = "";

  it("should startup", () => {});

  it("Test Default Endpoint", () => {
    request(APP)
      .get("/")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined();
      });
  });

  afterEach(async () => {});
});
