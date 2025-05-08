const app = require('./app');
const appConfig = require('./appConfig');

const port = appConfig.serverConfig.port;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port},http://localhost:${port}`);
    console.log(`Swagger is running on http://localhost:${port}/api-docs/`);
});
