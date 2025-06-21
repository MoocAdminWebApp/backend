const authService = require("../service/authService");
const { cookieConfig } = require("../appConfig");
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login(email, password);
    const token = result.data;
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict", //prevent CSRF attack
      maxAge: cookieConfig.maxAge,
    });
    res.sendCommonValue(200, "success", result.data);
  } catch (err) {
    res.sendCommonValue(400, "fail",{});
  }
};

module.exports = { loginUser };
