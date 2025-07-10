const authService = require("../service/authService");
const { cookieConfig } = require("../appConfig");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login(email, password);
    if (result.isSuccess == false) {
      throw new Error(result.message);
    }
    const token = result.data;
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict", //prevent CSRF attack
      maxAge: cookieConfig.maxAge,
    });
    res.sendCommonValue(200, "Login successful", result.data);
  } catch (err) {
    res.sendCommonValue(400, err.message, {});
  }
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.signup(req.body);

    if (result.isSuccess == false) {
      throw new Error(result.message);
    }
    res.sendCommonValue(200, result.message, result.data);
  } catch (err) {
    res.sendCommonValue(400, err.message, {});
  }
};

module.exports = { loginUser, signupUser };
