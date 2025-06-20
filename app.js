const express = require("express");
//const bodyParser = require('body-parser');
const path = require("path");
const appConfig = require("./appConfig");
const app = express();
const authRouter = require("./router/authRouter");
const cookiesParser = require("cookie-parser");
const { expressjwt: jwtMiddleware } = require("express-jwt");
//config cors
const cors = require("cors");

if (appConfig.corsConfig.origin) {
  app.use(
    cors({
      origin: appConfig.corsConfig.origin,
      credentials: true,
    })
  );
} else {
  app.use(cors());
}

app.use(express.static(path.join(__dirname, "public")));

//config commonresult
const returnvalue = require("./middleware/returnvalue");
app.use(returnvalue.returnvalue);

//config josn body
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//process token sent from the client
app.use(cookiesParser());

//jwt middleware, get token from cookie
app.use(
  jwtMiddleware({
    secret: appConfig.jwtConfig.secret,
    algorithms: appConfig.jwtConfig.algorithms,
    getToken: req => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}



  }).unless({
    path: ["/", /^\/api-docs/, "/api/login"], // login route
  })
);

//config Swagger
const swaggerDocument = require("./common/swagger");
const swaggerUi = require("swagger-ui-express");
// config'/api-docs' Path to access Swagger UI
const swaggerUiOptions = {
  explorer: true,
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

app.get("/", (req, res) => {
  res.send("server running " + new Date().toLocaleString());
});

//config demorouter
const demorouter = require("./router/demorouter");
app.use("/api/demos", demorouter);
const roleRoutes = require("./router/rolerouter");
app.use("/api/roles", roleRoutes);
//config courseofferingrouter
const courseofferingrouter = require("./router/courseofferingrouter");
app.use("/api/courseofferings", courseofferingrouter);
//config userRouter
const userRouter = require("./router/userRouter");
app.use("/api/users", userRouter);

//config authRouter
app.use("/api", authRouter);

//config erorhandle
const erorhandle = require("./middleware/errorhandling");
app.use(erorhandle.errorhandling);

module.exports = app;
