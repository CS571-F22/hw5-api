
import crypto from 'crypto';
import {readFileSync, writeFileSync} from 'fs';

const users = readFileSync("users.txt").toString().split("\r\n");
const salt = readFileSync("secret-salt.txt").toString();

const refCodes = users.map(user => {
    const hash = crypto.createHash('sha256').update(user + salt).digest('hex');
    return {user: user, secret: hash};
});

const csv = refCodes.map(refCode => `${refCode.user}@wisc.edu,${refCode.secret.substring(0, 12)}`).join("\n");

writeFileSync("ref-codes.txt", csv);
