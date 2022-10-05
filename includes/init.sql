CREATE TABLE IF NOT EXISTS BadgerUser (
	id INTEGER PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	passwd TEXT NOT NULL,
	salt TEXT NOT NULL,
	refCode TEXT NOT NULL,
	wiscUsername TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS BadgerMessage (
	id INTEGER PRIMARY KEY UNIQUE,
	title TEXT NOT NULL,
	content TEXT NOT NULL,
	chatroom TEXT NOT NULL
);

INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("Arboretum");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("Capitol");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("Chazen");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("Epic");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("HenryVilas");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("MemorialTerrace");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("Mendota");
INSERT OR IGNORE INTO BadgerChatroom(roomName) VALUES("Olbrich");
