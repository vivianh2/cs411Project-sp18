CREATE SCHEMA uiuc;
CREATE TYPE cond AS ENUM('New', 'Like New', 'Good', 'Acceptable', 'Unacceptable');
CREATE TABLE uiuc.Transaction (
    TID serial PRIMARY KEY,
    SellTime timestamp,
    Condition cond,
    PostTime timestamp,
    Price money,
    BuyerID varchar(10),
    SellerID varchar(10),
    ISBN char(13)
);
SELECT * FROM uiuc.Transaction;
CREATE TABLE uiuc.Book(
    ISBN char(13) PRIMARY KEY,
    Name text
);
SELECT * FROM uiuc.Book;
CREATE TABLE uiuc.User(
    NETID varchar(10) PRIMARY KEY,
    Rating smallint
);
SELECT * FROM uiuc.User;
CREATE TABLE uiuc.Class(
    Subject varchar(5),
    Number smallint,
    CourseName text,
    CONSTRAINT subject_number PRIMARY KEY(subject, number)
);
SELECT * FROM uiuc.Class;
CREATE TABLE uiuc.Dept(
    Code varchar(5) PRIMARY KEY,
    Name text
);
SELECT * FROM uiuc.Dept;
ALTER TABLE uiuc.Class ADD isbn_list char(13) ARRAY;
INSERT INTO uiuc.Class VALUES('RHET',105, 'Writing and Research', '{"9780321964267","9780134701332","9780385480017"}');
INSERT INTO uiuc.Transaction VALUES(DEFAULT, CURRENT_TIMESTAMP, 'Good', CURRENT_TIMESTAMP, 19.98, 'flyu2', 'vivianh2', '9780321964267');
INSERT INTO uiuc.Book VALUES('9780321964267','Perspectives On Argument');
INSERT INTO uiuc.User (netid, rating) VALUES('vivianh2', 1),('flyu2', 3), ('chenq2', 5), ('haonan3', 4);
UPDATE uiuc.Transaction SET sell_time = NULL WHERE tid = 1;
INSERT INTO uiuc.Dept VALUES('CS', 'Computer Science');
SELECT * FROM uiuc.dept WHERE code LIKE 'E%';
