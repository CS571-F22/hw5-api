
import express from 'express';
import { format } from 'path';
import { exit } from 'process';

// import rateLimit from 'express-rate-limit';

import sqlite3 from 'sqlite3';
import sessions from 'express-session';
import errorHandler from 'errorhandler';
import morgan from 'morgan';

import bodyParser from 'body-parser';

const app = express();
const port = 56933;

const db = await new sqlite3.Database("./db.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err: any) => {
        if (err) {
            console.log("Failed to create/open SQL database!");
            exit(1);
        } else {
            console.log("Created/opened SQL database!")
        }
    });
db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err: any, row: any) => {
        console.log(row.id + ": " + row.info);
    });
});
db.close();

app.use(morgan(':date ":method :url" :status :res[content-length] - :response-time ms'));

morgan.token('date', function () {
    var p = new Date().toString().replace(/[A-Z]{3}\+/, '+').split(/ /);
    return (p[2] + '/' + p[1] + '/' + p[3] + ':' + p[4] + ' ' + p[5]);
});

process.on('uncaughtException', function (exception) {
    console.log(exception);
});

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

// app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// JSON Body Parser Configuration
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// // Request Throttler
// app.set('trust proxy', 1);
// const limiter = rateLimit({
//     windowMs: 60 * 1000, // 1 minute
//     max: 500 // limit each IP to 500 requests per windowMs (minute)
// });
// app.use(limiter);

// Allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

app.post('/api/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const refCode = req.body.refCode;
});

app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
});

app.post('/api/logout', (req: any, res) => {
    req.session.destroy();
});

app.get('/api/chatrooms', (req, res) => {

});

app.get('/api/chatroom/:chatroomName/messages', (req, res) => {

});

app.post('/api/chatroom/:chatroomName/messages', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
});

// Error Handling
app.use((err: any, req: any, res: any, next: any) => {
    let datetime: Date = new Date();
    let datetimeStr: string = `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()}`;
    console.log(`${datetimeStr}: Encountered an error processing ${JSON.stringify(req.body)}`);
    res.status(400).send({
        "error-msg": "Oops! Something went wrong. Check to make sure that you are sending a valid request. Your recieved request is provided below. If it is empty, then it was most likely not provided or malformed. If you have verified that your request is valid, please contact the CS571 staff.",
        "error-req": JSON.stringify(req.body),
        "date-time": datetimeStr
    })
});

// Open Server for Business
app.listen(port, () => {
    console.log(`CS571 API :${port}`)
});