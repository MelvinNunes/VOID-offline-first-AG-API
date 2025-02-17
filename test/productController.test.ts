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

describe("Test Get All Products", () => {
  it("should return all products with 200 status", async () => {
    const loginData = {
      email: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };

    const loginRes = await request(app)
      .post("/v1/login")
      .set("Accept", "application/json")
      .send(loginData);

    const res = await request(app)
      .get("/v1/products")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return 401 status if no token is provided", async () => {
    const res = await request(app)
      .get("/v1/products")
      .set("Accept", "application/json");

    expect(res.status).toBe(401);
  });
});

describe("Test Get Product Details", () => {
  it("should return product details with 200 status", async () => {
    const loginData = {
      email: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };

    const loginRes = await request(app)
      .post("/v1/login")
      .set("Accept", "application/json")
      .send(loginData);

    const productId = "12345";
    const res = await request(app)
      .get(`/v1/products/${productId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it("should return 401 status if no token is provided", async () => {
    const productId = "12345";
    const res = await request(app)
      .get(`/v1/products/${productId}`)
      .set("Accept", "application/json");

    expect(res.status).toBe(401);
  });
});

describe("Test Delete Product", () => {
  it("should delete a product and return 200 status", async () => {
    const loginData = {
      email: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };

    const loginRes = await request(app)
      .post("/v1/login")
      .set("Accept", "application/json")
      .send(loginData);

    const productId = "12345";
    const res = await request(app)
      .delete(`/v1/products/${productId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
  });

  it("should return 401 status if no token is provided", async () => {
    const productId = "12345";
    const res = await request(app)
      .delete(`/v1/products/${productId}`)
      .set("Accept", "application/json");

    expect(res.status).toBe(401);
  });
});

describe("Test Invalid Product Data Submission", () => {
  it("should return 400 status for invalid product data", async () => {
    const loginData = {
      email: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };

    const loginRes = await request(app)
      .post("/v1/login")
      .set("Accept", "application/json")
      .send(loginData);

    const invalidProductData = {
      id: "12345",
      name: "",
      description: "This is a test product",
      price: 100,
      quantity: 10,
    };

    const res = await request(app)
      .post("/v1/products")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .send(invalidProductData);

    expect(res.status).toBe(400);
  });
});
