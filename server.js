const app = require('./src/app');

const PORT = 3005;

const server = app.listen(PORT, () => {
    console.log("Server connect on PORT = ", PORT);
})


process.on('SIGINT', () => {
    server.close(() => { console.log("Exit Server Express", process.exit(1)) })
})
