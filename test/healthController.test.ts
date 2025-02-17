import request from "supertest";
const app = require("../src/application/index");

describe("Test API Health", () => {
  it("responds to /v1/health", async () => {
    const res = await request(app)
      .get("/v1/health")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
  });
});
