import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";

const { DB_TEST_HOST, PORT = 3000 } = process.env;

describe("test login function", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("test login function", async () => {
    const loginData = {
      email: "test@gmail.com",
      password: "123456",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);

    expect(body.token).not.toBeNull();

    expect(body.user).not.toBeNull();
    expect(body.user).toHaveProperty("email");
    expect(body.user).toHaveProperty("subscription");

    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.subscription).toBe("string");

    expect(body.user.email).toBe(loginData.email);
  });
});
