const { login } = require("../service/authService");
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("login service", () => {
  const mockUser = {
    id: 1,
    email: "alice@example.com",
    password: "hashed-password",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully", async () => {
    db.User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-jwt-token");

    const result = await login("alice@example.com", "password123");

    expect(result.isSuccess).toBe(true);
    expect(result.data.token).toBe("fake-jwt-token");
    expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: "alice@example.com" } });
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashed-password");
  });

  it("should fail on invalid password", async () => {
    db.User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const result = await login("alice@example.com", "wrong-password");

    expect(result.isSuccess).toBe(false);
    expect(result.message).toBe("Invalid username or password");
  });

  it("should throw error if user not found", async () => {
    db.User.findOne.mockResolvedValue(null);
    await expect(login("notfound@example.com", "password")).rejects.toThrow("User not exists");
  });
});
