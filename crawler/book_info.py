from bs4 import BeautifulSoup
import urllib.request
import threading
import queue

import psycopg2
from configparser import ConfigParser
import configs

import time

import http.client
import urllib
import re

import requests

from xml.etree import cElementTree as ET


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


def get_course_from_db():
    conn = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()

        l = []

        cur.execute("SELECT subject, number FROM uiuc.Class ORDER BY subject")
        #print("The number of parts: ", cur.rowcount)
        row = cur.fetchone()

        while row is not None:
            l.append(row)
            row = cur.fetchone()

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,'here??')
    finally:
        if conn is not None:
            conn.close()

    return l

course_list = get_course_from_db()
course_dict = {}
for subnum in course_list:
    if subnum[0] not in course_dict:
        course_dict[subnum[0]] = []
        course_dict[subnum[0]].append(subnum[1])
    else:
        course_dict[subnum[0]].append(subnum[1])
#print(course_dict)

# count = 0
# match_dict = {}
# dept_wanted = ["35479","35540","35486","35490","35505","35515","35564","35566","35570"]
# for subject in course_dict:
#     match_dict[subject] = dept_wanted[count]
#     count += 1
# print(match_dict)
# for subject in course_dict:
#     course_code = match_dict[subject]
match_dict = {}
match_dict['CHEM'] = '35540'
match_dict['CS'] = '35486'
match_dict['EALC'] = '35490'
#print(match_dict)


import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
import random
#badm-35479
#chem-35540
#cs-35486
#EALC-35490
#HIST-35505
#MATH-35515
#PHYS-35564
#RHET-35566
#STAT-35570


driver = webdriver.Chrome("./chromedriver")

def open_page():
    try:
        driver.get("https://www.bookstore.illinois.edu/textbooks/buy_textbooks.asp?")
        driver.get(driver.getCurrentUrl())
        driver.refresh()
    except:
        driver.refresh()


def select_term():
    #termbox = driver.find_element_by_css_selector('select[name="selTerm"]')
    #termbox.click()
    spring = driver.find_element_by_css_selector('option[value="235|399"]')
    spring.click()
#     fall = driver.find_element_by_css_selector('option[value="235|402"]')
#     fall.click()

def select_dept(dept):
    #deptbox = driver.find_element_by_css_selector('select[id="dept"]')
    #deptbox.click()
    subject = driver.find_element_by_css_selector('option[value="%s"]'%dept)
    subject.click()

def select_course(num):
    course = driver.find_element_by_xpath("//option[text()='%s']"%num)
    course.click()

def find_section():
    option = driver.find_elements_by_tag_name('option')
    sections = []
    for each in option:
         if each.get_attribute("value")[0] == '6':
                part = each.text.split('-')[0]
                if(len(part) < 3 or 'L' in part):
                    #print(each.text)
                    sections.append(each.get_attribute("value"))
    return sections

def select_section(sec):
    sec = driver.find_element_by_css_selector('option[value="%s"]'%sec)
    sec.click()

def other_button():
    addbutton = driver.find_element_by_css_selector('input[value="Add Course To List"]')
    addbutton.click()
    getbutton = driver.find_element_by_css_selector('input[value="Get Your Books"]')
    getbutton.click()


def get_book_info(dept,num):
    #isbn_list = []

    tr = driver.find_elements_by_tag_name('tr')

    for parentElement in tr:
        elementList = parentElement.find_elements_by_tag_name("span")

        #make a selection
        if len(elementList) < 3:
            continue

        pic_url = ""
        #image url
        image = parentElement.find_elements_by_tag_name("img")
        for img in image:
            pic_url = img.get_attribute("src")

        #other infomation
        i = 0
        title = ""
        author = ""
        isbn =""
        skip = False
        for info in elementList:
            if i == 0:
                title = info.text
            if i == 1:
                author = info.text
            if i == 2:
                isbn = info.text[5:]
                if (isbn in overall_book_info[""+dept+num]) or (not isbn.isdigit()):
                    skip = True
            if i > 2:
                continue
            i += 1
        if not skip:
            this_class = overall_book_info[""+dept+num]
            this_class[isbn] = {}
            this_class[isbn]["title"] = title
            this_class[isbn]["author"] = author
            this_class[isbn]["pic"] = pic_url

def back():
     driver.execute_script("window.history.go(-1)")

def each_print(dept,num):
    print(overall_book_info[""+dept+num])



overall_book_info= {}
start = time.time()

open_page()
time.sleep(0.3)
select_term()
time.sleep(0.3)
for dept in match_dict:
    select_dept(match_dict[dept])
    time.sleep(0.3)
    for num in course_dict[dept]:
        print(num)
        if(num > 498) or num == 199 or num == 297 or num == 497:
            continue
        try:
            time.sleep(0.2)
            select_course(str(num))
            time.sleep(0.3)
            sections = find_section()
            time.sleep(0.3)
            overall_book_info[""+dept+str(num)] = {}
            for sec in sections:
                time.sleep(0.3)
                select_section(sec)
                time.sleep(0.3)
                other_button()
                time.sleep(0.3)
                get_book_info(dept,str(num))
                time.sleep(0.5)
                back()
                time.sleep(0.3)
                select_dept(match_dict[dept])
                time.sleep(0.3)
                if sec != sections[-1]:
                    select_course(str(num))
                    time.sleep(0.3)
            each_print(dept,str(num))
            print(time.time()-start)
        except:
            continue
driver.quit()

def insert_book(sql):
    conn = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        cur.execute(sql)
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

for sub in ['CHEM','CS']:
    for num in course_dict[sub]:
        if(sub+str(num) in overall_book_info):
            if len(overall_book_info[sub+str(num)].keys()) != 0:
                query = '''UPDATE uiuc.Class SET isbn_list = ('{'''
                insert = '''INSERT INTO uiuc.Book VALUES('%s','%s','%s');'''
                for isbn in list(overall_book_info[sub+str(num)].keys()):
                    query += ''' "%s", ''' %isbn
                    #print(insert%(isbn, overall_book_info[sub+str(num)][isbn]['title'].replace("'", "''"),overall_book_info[sub+str(num)][isbn]['pic']))
                    insert_book(insert%(isbn, overall_book_info[sub+str(num)][isbn]['title'].replace("'", "''"),overall_book_info[sub+str(num)][isbn]['pic']))
                query = query[:-2]
                query += '''}') WHERE subject = '%s' AND number = %d;'''%(sub,num)
                #print(query)
                insert_book(query)
# def get_book_from_webstore(clist):


#     # specify we're sending parameters that are url encoded
#     headers = { 'Content-Type' : 'application/x-www-form-urlencoded' }

#     # our parameters
#     params = { ... }
#     'selTerm' = '235|399',
#     'selDept'{
#         'MATH':'35515',
#         'BADM':'35479',
#         'CHEM':'35540',
#         'CS':'35486',
#         'EALC':'35490',
#         'PHYS':'35564',
#         'RHET':'35566',
#         'HIST':'35505',
#         'STAT':'35570'
#     },
#     'tbe-block-mode' = '0',
#     'generate-book-list':'Get+Your+Books',

#     # establish connection with the webpage
#     h = http.client.HTTPConnection('shittywebsite.com')

#     # url encode the parameters
#     url_params = urllib.parse.urlencode(params)

#     # send out the POST request

#     # get the response
#     r = h.getresponse()

#     # analyse the response
#     if re.search("Error", r.read.decode()):
#         print("Not found")
#     else:
#         print("Probably found")

#     h.close()
# headers = {
#     'Host': 'www.bookstore.illinois.edu',
#     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:59.0) Gecko/20100101 Firefox/59.0',
#     'Accept': '*/*',
#     'Accept-Language': 'en-US,en;q=0.5',
#     'Accept-Encoding': 'gzip, deflate, br',
#     'Referer': 'https://www.bookstore.illinois.edu/textbooks/buy_textbooks.asp?',
#     'X-Requested-With': 'XMLHttpRequest',
#     'Cookie': 'cookies=true; referring_url=None; mscssid=0E3B05224FEF453F8BDB5ACEA0BA95EE; ASPSESSIONIDCSGQDQTS=NFFNEHLDLLEGCIDBKIEPLFAJ; ASPSESSIONIDCUBRDRTT=GCFFJDKDCBDKODKHHNAMDLCH; ASPSESSIONIDQQEBTTQT=MEIDPNKDBFJIIGFMLOAHKJDH',
#     'Connection': 'keep-alive',
#     'Cache-Control': 'max-age=0'

# }
# cookies = {
#     'ASPSESSIONIDCSGQDQTS':'NFFNEHLDLLEGCIDBKIEPLFAJ',
#     'ASPSESSIONIDCUBRDRTT':'GCFFJDKDCBDKODKHHNAMDLCH',
#     'ASPSESSIONIDQQEBTTQT':'MEIDPNKDBFJIIGFMLOAHKJDH',
#     'cookies':'true',
#     'mscssid':'0E3B05224FEF453F8BDB5ACEA0BA95EE',
#     'referring_url':'None'
# }
# def get_secID():
#     c=http.client.HTTPConnection("www.bookstore.illinois.edu")
#     c.request("GET",'https://www.bookstore.illinois.edu/textbooks/textbooks_xml.asp?control=campus&campus=235&term=397',headers = headers)
#     r=c.getresponse()
#     rd = r.read()
#     print(rd)
    #e=ET.XML(rd)
#     c = http.client.HTTPConnection("www.bookstore.illinois.edu")
#     c.request('GET','https://www.bookstore.illinois.edu/textbooks/textbooks_xml.asp?control=campus&campus=235&term=397',headers = headers)
#     r = c.getresponse()
#     s = r.read().decode("utf-8")
#     print(s)
#     print(root.tag)

#     #root = ET.fromstring(r.content)
#     #e = ET.XML(s)
#     for child in root.iter('*'):
#         print(child.tag)
#     if not tag:
#         print(e)
#     else:
#         print(e.findall(tag))
