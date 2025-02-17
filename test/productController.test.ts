import request from "supertest";
const app = require("../src/application/index");

describe("Test Product Creation", () => {
  it("should create a product and return 201 status", async () => {
    const loginData = {
      email: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };

    const loginRes = await request(app)
      .post("/v1/login")
      .set("Accept", "application/json")
      .send(loginData);

    const productData = {
      id: "12345",
      name: "Test Product",
      description: "This is a test product",
      price: 100,
      quantity: 10,
    };

    const res = await request(app)
      .post("/v1/products")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .send(productData);

    expect(res.status).toBe(201);
    expect(res.body.data).toBeNull();
  });

  it("should return 401 status if no token is provided", async () => {
    const productData = {
      id: "12345",
      name: "Test Product",
      description: "This is a test product",
      price: 100,
      quantity: 10,
    };

    const res = await request(app)
      .post("/v1/products")
      .set("Accept", "application/json")
      .send(productData);

    expect(res.status).toBe(401);
  });
});
