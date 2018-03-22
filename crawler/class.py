from bs4 import BeautifulSoup
import urllib.request
import threading
import queue

import psycopg2
from configparser import ConfigParser
import configs



def config(filename='./../database.ini', section='postgresql'):
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


def insert_class(dic):
    print('reached insertion')
    sql = """INSERT INTO uiuc.class(subject, number, coursename) VALUES(%s,%s,%s);"""
    conn = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        cur.execute(sql, (dic['subject'],dic['number'],dic['name']))
        #cur.execute(sql, ('CS', 100, 'Freshman Orientation'))
        # get the generated id back
        #ret_id = cur.fetchone()[0]
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

def getinfo():
    print('reached getter')
    while True:
        mm = urllib.request.urlopen(q.get()).read()
        newsoup = BeautifulSoup(mm,'lxml')
        for course in newsoup.find_all('cascadingcourse'):
            dic = {}
            url = course.get('href').split('/')
            dic['subject'] = url[-2]
            dic['number'] = int(url[-1].split('.')[-2])
            for child in course.findChildren():
                if child.name == 'label':
                    dic['name'] = child.text
            insert_class(dic)
        q.task_done()


if __name__ == '__main__':
    main = urllib.request.urlopen("https://courses.illinois.edu/cisapp/explorer/schedule/2018/fall.xml").read()
    soup = BeautifulSoup(main,'lxml')
    q = queue.Queue()
    for i in range(5):
        worker = threading.Thread(target=getinfo)
        worker.setDaemon(True)
        worker.start()

    for link in soup.find_all('subject'):
        q.put(link.get('href')+'?mode=cascade')

    q.join()



#==================some useful code can be used later============================

# def connect(dic):
#     """ Connect to the PostgreSQL database server """
#     conn = None
#     try:
#         params = config()# read connection parameters
#         print('Connecting to the PostgreSQL database...')
#         conn = psycopg2.connect(**params)# connect to the PostgreSQL server
#         cur = conn.cursor()# create a cursor

#         print('result:')
#         cmd = 'INSERT INTO uiuc.class(subject, number, coursename) VALUES(%s,%d,%s)'
#         cur.execute(cmd,(dic['subject'],dic['number'],dic['coursename']))# execute a statement

#         db_version = cur.fetchone()# display the PostgreSQL database server version
#         print(db_version)

#         cur.close()# close the communication with the PostgreSQL
#     except (Exception, psycopg2.DatabaseError) as error:
#         print(error)
#     finally:
#         if conn is not None:
#             conn.close()
#             print('Database connection closed.')


# def insert_list(dic):
#     """ insert multiple vendors into the vendors table  """
#     sql = "INSERT INTO vendors(vendor_name) VALUES(%s)"
#     conn = None
#     try:
#         # read database configuration
#         params = config()
#         # connect to the PostgreSQL database
#         conn = psycopg2.connect(**params)
#         # create a new cursor
#         cur = conn.cursor()
#         # execute the INSERT statement
#         cur.executemany(sql,vendor_list)
#         # commit the changes to the database
#         conn.commit()
#         # close communication with the database
#         cur.close()
#     except (Exception, psycopg2.DatabaseError) as error:
#         print(error)
#     finally:
#         if conn is not None:
#             conn.close()

#
# while True:
#         mm = urllib.request.urlopen("https://courses.illinois.edu/cisapp/explorer/schedule/2018/fall/CS.xml?mode=cascade").read()
#         newsoup = BeautifulSoup(mm,'lxml')
#         l = []
#         for course in newsoup.find_all('cascadingcourse'):
#             url = course.get('href').split('/')
#             subject = url[-2]
#             number = url[-1].split('.')[-2]
#
#             for child in course.findChildren():
#                 if child.name == 'label':
#                     cname = child.text
#             l.append((subject,number, cname))
#         print(l)
