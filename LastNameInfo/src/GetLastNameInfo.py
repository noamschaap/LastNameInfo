'''
Created on Dec 29, 2015

@author: ns
'''
import urllib, json
import urllib2
import NationalityList
from LastNameObjs import Person
from bs4 import BeautifulSoup
from cgitb import text
import re
import datetime
from dateutil.parser import *


def increase_count(a_dict, name):
    if name in a_dict:
        a_dict[name] = a_dict[name]+1
    else:
        a_dict[name] = 1
        
def get_surname_info(last_name):
    url = ("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=intitle:%22"+
           urllib.quote(last_name.encode('utf8'))+"%22AND%22surname%22&srlimit=2&format=json&utf8=")
    response = urllib.urlopen(url)
    data = json.loads(response.read())
    nomatches = True
    if len(data['query']['search']) > 0:
        for d in data['query']['search']:
            #print d
            if "is a" in d['snippet'] and "surname" in d['snippet']:
                nomatches = False
                #print d['snippet']
                soup = BeautifulSoup(d['snippet'].encode("utf-8"),"html.parser")
                text = soup.getText()
                sentences = text.split(".") 
                finals = ''
                for s in sentences:
                    #print s
                    if last_name in s or finals != '':
                        finals = finals + s
                    if "is a " in s or "is an " in s:
                        if len(s) > 35:
                            if last_name in s:
                                return s
                            else:
                                return finals
                        break
    if nomatches:
        return "NO ORIGIN DATA"
    
def get_people_list(last_name):   

    url = ("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=intitle:%22"+
           urllib.quote(last_name.encode('utf8'))+"%22AND%22born%22&srlimit=50&format=json&utf8=")
   
    response = urllib.urlopen(url)
    data = json.loads(response.read())
    #print data['query']['search']
    list_of_people = list()
    for d in data['query']['search']:
        if (last_name.lower() not in d['title'].lower()) or (last_name.lower() == d['title'].lower()):
            continue
        #check that last word in title is last name
        if len(d['title']) > d['title'].lower().find(last_name.lower())+len(last_name):
            continue 
        if  d['title'].lower().find(" of ") > -1:
            continue
        list_of_people.append(d)
    return list_of_people
    
def get_nationality(last_name):
   
    nationality_count = dict()
    total_count = 0
    
    list_of_people = get_people_list(last_name)
    
    for d in list_of_people:
                
        snip = d['snippet'].encode("utf-8")
        
        total_count += 1
        for n in NationalityList.nationalitylist:
            found_match = False
            for aname in n.listOfNames:
                if aname in snip:
                    found_match = True
                    increase_count(nationality_count, n.officialName)
                    #print n.officialName
                    break
            if found_match:
                break
    
    #print total_count
    returnlist = list()
    for k,v in nationality_count.iteritems():
        returnlist.append((k,v))
    return returnlist

def get_people(last_name):
    
    people = []
    
    list_of_people = get_people_list(last_name)
    
    for d in list_of_people:
        
        title = d['title']
        url = ("https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&page="+urllib.quote(title.encode('utf8')))
        response = urllib2.urlopen(url)
        html = response.read()
        soup = BeautifulSoup(html,"html.parser")
        text = soup.getText().encode("utf-8")
        print text
        
        born_word = re.search('born', text, re.IGNORECASE)
        if text.find("-?)", born_word.start()) != -1:
            continue
        born = None
        if born_word:
            #Born\n(1969-08-23)
            bornyearstart =  text.find("n(", born_word.start())
            if bornyearstart != -1:
                bornyear = text[bornyearstart+2:bornyearstart+6]
                bornday = text[bornyearstart+10:bornyearstart+12]
                if bornyear.isdigit() and bornday.isdigit():
                    born = text[bornyearstart+2:bornyearstart+12]
                    print born
            #...lastname (born April 6, 1951)
            #(born 24 October 1946 DOES NOT WORK
            else:
                bornyearend =  text.find(")", born_word.start())
                if bornyearend - born_word.start() < 20:
                    born = text[born_word.start()+5:bornyearend]
                    print born
        if not born:
            # (September 27, 1934 \u2013 December 21, 2001)
            bornyearstart =  text.find("(")
            bornyearend = text.find("u2013", bornyearstart)
            if bornyearend - bornyearstart < 30:
                born = text[bornyearstart+1:bornyearend-2]
                print born
        
        died = -1
        diedstart = text.find("Died")
        print "looking for dead"
        if diedstart != -1:
            #\nDied\nOctober 13, 1889(1889-10-13)
            diedyearstart =  text.find("(", diedstart)
            if diedyearstart - diedstart < 50:
                died = text[diedyearstart+1:diedyearstart+11]
                print "1",died
        
               
        if died == -1:
            #lastname (December 24, 1783; died c.1850) 
            diedstart = text.find("died c.")
            if diedstart != -1:
                deadyearend = text.find(")", diedstart)
                died = text[diedstart+7:deadyearend]
                print "2",died
        
        if died == -1:
            #(July 2, 1869 \u2013 July 28, 1931)
            deadyearstart =  text.find("u2013 ")
            print deadyearstart
            deadyearend = text.find(")", deadyearstart)
            print deadyearend
            if deadyearstart != -1 and deadyearend - deadyearstart < 30:
                died = text[deadyearstart+6:deadyearend]
                print "3",died
            
        #print "Born:"text[bornstart+6:bornstart+10]
        #print "Died:",died
        
        if born:
            try:
                parse(born)
                if len(born) < 4:
                    continue
            except:
                #print title
                continue
            if died != -1:
                try:
                    parse(died)
                    if len(died) < 4:
                        died = -1
                except:
                    died = -1
            people.append(Person(title,born,died,""))
     
    final_people_list = list()    
    for person in people:
        try:
            print person
            final_people_list.append(person)
        except:
            print "print fail to print person"          
    
    return final_people_list

#a_last_name = "Brown"
#get_people(a_last_name)
#print get_surname_info(a_last_name)
#print get_nationality(a_last_name)