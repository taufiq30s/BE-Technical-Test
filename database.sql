CREATE TABLE member (
	code VARCHAR(30) NOT NULL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	penalized_until DATETIME
);

CREATE TABLE book (
	code VARCHAR(30) NOT NULL PRIMARY KEY,
	title VARCHAR(200) NOT NULL,
	author VARCHAR(255) NOT NULL,
	stock INT NOT NULL
);

CREATE TABLE borrow (
	id VARCHAR(36) NOT NULL PRIMARY KEY,
	member_code VARCHAR(30) NOT NULL,
	book_code VARCHAR(30) NOT NULL,
	borrowed_at DATETIME NOT NULL,
	due_at DATETIME NOT NULL,
	returned_at DATETIME DEFAULT NULL,
	FOREIGN KEY (member_code) REFERENCES member(code),
	FOREIGN KEY (book_code) REFERENCES book(code)
);

INSERT INTO member (code, name, penalized_until) VALUES
('M001', 'Angga', NULL),
('M002', 'Ferry', NULL),
('M003', 'Putri', NULL);

INSERT INTO book (code, title, author, stock) VALUES
('JK-45', 'Harry Potter', 'J.K Rowling', 1),
('SHR-1', 'A Study in Scarlet', 'Arthur Conan Doyle', 1),
('TW-11', 'Twilight', 'Stephenie Meyer', 1),
('HOB-83', 'The Hobbit, or There and Back Again', 'J.R.R. Tolkien', 1),
('NRN-7', 'The Lion, the Witch and the Wardrobe', 'C.S. Lewis', 1);