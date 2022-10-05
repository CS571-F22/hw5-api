CREATE TABLE IF NOT EXISTS BadgerUser (
	id INTEGER PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	passwd TEXT NOT NULL,
	salt TEXT NOT NULL,
	refCode TEXT NOT NULL,
	wiscUsername TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS BadgerChatroom (
	id INTEGER PRIMARY KEY UNIQUE,
	roomName TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS BadgerMessage (
	id INTEGER PRIMARY KEY UNIQUE,
	title TEXT NOT NULL,
	content TEXT NOT NULL
);

INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("alpha");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("beta");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("charlie");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("delta");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("echo");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("foxtrot");
