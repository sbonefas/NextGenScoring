from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest
import os

def configure_index():
    cwd = os.getcwd()
    index_path = 'file:///' + cwd + '/'
    return index_path.replace("\\", '/')
        
    
class TestTeams(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        __class__.driver = webdriver.Firefox()
        __class__.driver.get(configure_index() + "teams.html")
        
    @classmethod
    def tearDownClass(cls):
	    #__class__.driver.quit()
        pass
        
    def setUp(self):
        pass

    def setUpTeams(self):
        __class__.driver.get(configure_index() + "teams.html")
	
    def tearDown(self):
        pass
        
    def test_delete_team(self):
        print("test_delete_team")
        team = __class__.driver.find_element_by_class_name("team_search").find_element_by_xpath("tbody/tr[1]/td/button/h3").text
        __class__.driver.find_element_by_class_name("team_search").find_element_by_xpath("tbody/tr[1]").click()
        __class__.driver.find_element_by_class_name("team_search").send_keys(Keys.F9)
        delete_msg = "DELETE TEAM: " + team + "?"
        self.assertEqual(delete_msg, Alert(__class__.driver).text, "Delete team warning message")
        Alert(__class__.driver).accept()
        
        team_new = __class__.driver.find_element_by_class_name("team_search").find_element_by_xpath("tbody/tr[1]/td/button/h3").text
        self.assertNotEqual(team_new, team, "Wisconsin should not be the top team")
    

    def test_no_select_err(self):
        print("test_no_select_err")
        self.setUpTeams()
        __class__.driver.find_element_by_class_name("team_search").send_keys(Keys.F9)
        err_msg = "ERROR NO TEAM SELECTED"
        self.assertEqual(err_msg, Alert(__class__.driver).text, "No team selected error message")
       
       
    def test_edit_team_msg(self):
        print("test_edit_team_msg")
        self.setUpTeams()
        team = __class__.driver.find_element_by_class_name("team_search").find_element_by_xpath("tbody/tr[1]/td/button/h3").text
        __class__.driver.find_element_by_class_name("team_search").find_element_by_xpath("tbody/tr[1]").click()
        __class__.driver.find_element_by_class_name("team_search").send_keys(Keys.ENTER)
        edit_msg = "Now editing " + team
        self.assertEqual(edit_msg, Alert(__class__.driver).text, "Edit team alert message")
        ## close the alert ##
        Alert(__class__.driver).accept()
        
        
if __name__ == '__main__':
    unittest.main()