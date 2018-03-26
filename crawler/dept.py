from bs4 import BeautifulSoup
import urllib.request
import threading
import queue

import psycopg2
from configparser import ConfigParser
import configs



def config(filename='./database.ini', section='postgresql'):
    parser = ConfigParser()# create a parser
    parser.read(filename)# read config file

    db = {}# get section, default to postgresql
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
    return db


def insert_dept(dic):
    print('reached insertion')
    sql = """INSERT INTO uiuc.dept(code, name) VALUES(%s,%s);"""
    conn = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        cur.execute(sql, (dic['code'],dic['name']))
        #cur.execute(sql, ('CS','Computer Science'))
        # commit the changes to the database
        conn.commit()
        # close communication with the database
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,'here??')
    finally:
        if conn is not None:
            conn.close()

    return 0



if __name__ == '__main__':
    main = urllib.request.urlopen("https://courses.illinois.edu/cisapp/explorer/schedule/2018/fall.xml").read()
    soup = BeautifulSoup(main,'lxml')

    for line in soup.find_all('subject'):
        dic = {}
        dic['code'] = line.get('id')
        dic['name'] = line.text
        insert_dept(dic)
    
