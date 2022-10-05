
import express from 'express';
import { format } from 'path';
import { exit } from 'process';

import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import sqlite3 from 'sqlite3';
import sessions from 'express-session';
import errorHandler from 'errorhandler';
import morgan from 'morgan';

import bodyParser from 'body-parser';
import { readFileSync } from 'fs';

const app = express();
const port = 56935;

const SESSION_SECRET = readFileSync("C:/Users/ColeNelson/Desktop/cs571-git/homework/apis/hw5-api/secret-generation/session-secret.secret").toString()
const REFCODE_ASSOCIATIONS = Object.fromEntries(readFileSync("C:/Users/ColeNelson/Desktop/cs571-git/homework/apis/hw5-api/secret-generation/ref-codes.secret")
    .toString().split(/\r?\n/g).map(assoc => {
        const assocArr = assoc.split(',');
        return [assocArr[1], assocArr[0]]
    }))
const INIT_SQL = readFileSync("C:/Users/ColeNelson/Desktop/cs571-git/homework/apis/hw5-api/includes/init.sql").toString();

const REGISTER_SELECT_SQL = 'SELECT * FROM BadgerUser WHERE username = ?;'
const REGISTER_SQL = "INSERT INTO BadgerUser(username, passwd, salt, refCode, wiscUsername) VALUES(?, ?, ?, ?, ?);";
const POST_SQL = "INSERT INTO BadgerMessage(title, content) VALUES (?, ?);"

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
    INIT_SQL.replaceAll(/\t\r\n/g, ' ').split(';').filter(str => str).forEach((stmt) => db.run(stmt + ';'));
});

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

app.use(errorHandler());

// JSON Body Parser Configuration
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// // Request Throttler
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 500 // limit each IP to 500 requests per windowMs (minute)
});
app.use(limiter);

// Allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(sessions({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

app.post('/api/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const refCode = req.body.refCode;
    if (username && password && refCode) {
        if (refCode in REFCODE_ASSOCIATIONS) {
            db.prepare(REGISTER_SELECT_SQL).run(username).all((err, rows) => {
                if (err) {
                    res.status(500).send({
                        msg: "The operation failed. The error is provided below. This may be server malfunction; check that your request is valid, otherwise contact CS571 staff.",
                        error: err
                    });
                } else if (rows.length === 1) {
                    res.status(409).send({
                        msg: "The user already exists!",
                    });
                } else {
                    const salt = crypto.createHash('sha256').update(new Date().getTime().toString()).digest('hex');
                    const hashPass = crypto.createHmac('sha256', salt).update(password).digest('hex');
                    const wiscRef = REFCODE_ASSOCIATIONS[refCode];
                    db.prepare(REGISTER_SQL).run(username, hashPass, salt, refCode, wiscRef, (err: any) => {
                        if (err) {
                            res.status(500).send({
                                msg: "The operation failed. The error is provided below. This may be server malfunction; check that your request is valid, otherwise contact CS571 staff.",
                                error: err
                            });
                        } else {
                            db.prepare(REGISTER_SELECT_SQL).run(username).all((err, rows) => {
                                if (!err && rows.length === 1) {
                                    res.status(200).send({
                                        msg: "Successfully created user!",
                                        user: (({ id, username }) => ({ id, username }))(rows[0])
                                    });
                                } else {
                                    res.status(500).send({
                                        msg: "The operation failed. The error is provided below. This may be server malfunction; check that your request is valid, otherwise contact CS571 staff.",
                                        error: err
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            if (refCode.startsWith('bid_')) {
                res.status(401).send({
                    msg: 'An invalid refCode was provided.'
                });
            } else {
                res.status(401).send({
                    msg: 'An invalid refCode was provided. Did you forget to include \'bid_\'?'
                });
            }
        }
    } else {
        res.status(400).send({
            msg: 'A request must contain a \'username\', \'password\', and \'refCode\''
        });
    }
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
    console.log(err)
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