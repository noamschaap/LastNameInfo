'''
Created on Dec 29, 2015

@author: ns
'''

class Nationality(object):
    '''
    classdocs
    '''
    

    def __init__(self, nationality, listofnames):
        '''
        Constructor
        '''
        self.officialName = nationality
        self.listOfNames = listofnames
 
class Person(object):
    '''
       classdocs
    '''
   
    def __init__(self, name, born, died, occupation):     
        #Constructor
        self.name = name
        self.born = born
        self.died = died
        self.occupation = occupation       
        
    def __str__(self):
        return self.name.encode('utf8') + " Born:"+str(self.born)+ " Died:"+str(self.died)