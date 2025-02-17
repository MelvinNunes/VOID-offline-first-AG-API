import request from "supertest";
const app = require("../src/application/index");

describe("Test API No Token Authenticated Route", () => {
  it("responds to /v1/me", async () => {
    const res = await request(app)
      .get("/v1/me")
      .set("Accept", "application/json");
    expect(res.status).toBe(401);
  });
});
