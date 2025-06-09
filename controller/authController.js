const authService = require("../service/authService");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login(email, password);
    const { token } = result.data;
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000 * 24,
    });
    res.sendCommonValue(200, "success", result.data);
  } catch (err) {
    res.sendCommonValue(400, "fail");
  }
};

module.exports = { loginUser };
