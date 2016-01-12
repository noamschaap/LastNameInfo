import webapp2
import os
from google.appengine.ext.webapp import template
from GetLastNameInfo import get_surname_info
from GetLastNameInfo import get_nationality
from GetLastNameInfo import get_people
import json

class MainPage(webapp2.RequestHandler):
    def get(self): 
        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))

class GetOrigin(webapp2.RequestHandler):
    def get(self):
        a_last_name = self.request.get('name')
        info = get_surname_info(a_last_name)
        self.response.write(json.dumps(info))
        
class GetNationalities(webapp2.RequestHandler):
    def get(self):
        a_last_name = self.request.get('name')
        info = get_nationality(a_last_name)
        self.response.write(json.dumps(info))
        
class GetPeople(webapp2.RequestHandler):
    def get(self):
        a_last_name = self.request.get('name')
        info = get_people(a_last_name)
        # To sort the list in place...
        #info.sort(key=lambda x: x.born, reverse=False)
        self.response.write(json.dumps([Person.__dict__ for Person in info]))


app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/nationalities', GetNationalities),
    ('/origin', GetOrigin),
    ('/people', GetPeople),
], debug=True)