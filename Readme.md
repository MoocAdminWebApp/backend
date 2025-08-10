# xinyan set up system

# ChangeLog

## 2025-06-25 by Michael

### Added

- COOKIE_MAX_AGE=86400000 in ".env.development"
- cookieConfig: "appConfig.js"
- npm install cookieParser
- npm install express-jwt

## 2025-07-11 by Michael

### Added

- npm install nodemailer
- in env.development add following:

```bash
  # Jwt config
  JWT_RESET_PASSWORD_EXPIRES_IN="15m"

  # Reset email
  GMAIL_USER="mooc.course001@gmail.com"
  GMAIL_APP_PWD="ktrxzdzgzlqooynr"
  FE_URL="localhost:9005"
```

- in appConfig.js

```bash
    jwtConfig:
    {
    resetPasswordExpiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    },
    resetPwdConfig:
    {
    userEmail: process.env.GMAIL_USER,
    appPwd: process.env.GMAIL_APP_PWD,
    frontendURL: process.env.FE_URL,
    },
```
