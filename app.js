const express = require("express");
//const bodyParser = require('body-parser');
const path = require('path');
const appConfig = require("./appConfig");
const app = express();

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

app.use(express.static(path.join(__dirname, 'public')));

//config commonresult
const returnvalue = require("./middleware/returnvalue");
app.use(returnvalue.returnvalue);




//config josn body
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// config Swagger
const swaggerDocument = require("./common/swagger");
const swaggerUi = require("swagger-ui-express");
// config'/api-docs'  Path to access Swagger UI
const swaggerUiOptions = {
  explorer: true,
};
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerUiOptions)
);

//config jwt
const { jwtConfig } = require("./appConfig");
let { expressjwt: jwt } = require("express-jwt");
app.use(
  jwt({ secret: jwtConfig.secret, algorithms: jwtConfig.algorithms }).unless({
    path: ["/", , "/api-docs", "/api/auth/login", "/api/auth/loginOut"],
  })
);

app.get("/", (req, res) => {
  res.send("server running " + new Date().toLocaleString());
});

//config authrouter
const authrouter = require("./router/authrouter");
app.use("/api/auth", authrouter);

//config userrouter
const userrouter = require("./router/userrouter");
app.use("/api/users", userrouter);

//config demorouter
const demorouter = require("./router/demorouter");
app.use("/api/demos", demorouter);

//config erorhandle
const erorhandle = require("./middleware/errorhandling");
app.use(erorhandle.errorhandling);

module.exports = app;
