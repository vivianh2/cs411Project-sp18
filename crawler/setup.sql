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



INSERT INTO uiuc.Book VALUES('9780824821524','Japanese Culture Updtd & Expd','https://www.bookstore.illinois.edu/textbooks/cover_image.asp?Key=9780824821524&Size=M&p=');
INSERT INTO uiuc.Book VALUES('9780679752691','Some Prefer Nettles','https://www.bookstore.illinois.edu/textbooks/cover_image.asp?Key=9780679752691&Size=M&p=');
UPDATE uiuc.Class SET isbn_list = ('{"9780824821524","9780679752691"}') WHERE subject = 'EALC' AND number = 250;
INSERT INTO uiuc.Transaction VALUES(DEFAULT, CURRENT_TIMESTAMP, 'New', TO_TIMESTAMP('2018-01-01 06:14:00.742000000', 'YYYY-MM-DD HH24:MI:SS.FF'), 19.98, 'vivianh2', 'chenq2', '9780824821524');
INSERT INTO uiuc.Transaction VALUES(DEFAULT, NULL, 'Acceptable', TO_TIMESTAMP('2018-02-21 10:59:00.742000000', 'YYYY-MM-DD HH24:MI:SS.FF'), 19.98, 'vivianh2', 'flyu2', '9780679752691');

UPDATE uiuc.Book SET pic_url = 'https://www.bookstore.illinois.edu/textbooks/cover_image.asp?Key=9780321964267&Size=M&p=' WHERE isbn = '9780321964267';


INSERT INTO uiuc.Book VALUES('9780134701332','Simon & Schuster Handbook For Writers 2016 Mla Update','https://www.bookstore.illinois.edu/textbooks/cover_image.asp?Key=9780134701332&Size=M&p=');
INSERT INTO uiuc.Book VALUES('9780385480017','Bird By Bird','https://www.bookstore.illinois.edu/textbooks/cover_image.asp?Key=9780385480017&Size=M&p=');
UPDATE uiuc.Class SET isbn_list = ('{"9780321964267", "9780134701332", "9780385480017"}') WHERE subject = 'RHET' AND number = 105;
INSERT INTO uiuc.Transaction VALUES(DEFAULT, CURRENT_TIMESTAMP, 'Acceptable', TO_TIMESTAMP('2017-11-11 11:59:00.742000000', 'YYYY-MM-DD HH24:MI:SS.FF'), 174.25, 'chenq2', 'haonan3', '9780824821524');
INSERT INTO uiuc.Transaction VALUES(DEFAULT, TO_TIMESTAMP('2018-03-21 10:59:00.742000000','YYYY-MM-DD HH24:MI:SS.FF'), 'Like New', TO_TIMESTAMP('2018-02-21 10:59:00.742000000', 'YYYY-MM-DD HH24:MI:SS.FF'), 13.66, 'flyu2', 'chenq2', '9780679752691');



CREATE TABLE uiuc.chatroom(
    CID serial PRIMARY KEY,
    Sender varchar(10),
    Receiver varchar(10),
    Message text
);
