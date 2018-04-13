from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest
import os


def configure_index():
    cwd = os.getcwd()
    path = os.path.abspath(os.path.join(cwd, os.pardir))
    index_path = 'file:///' + path + '/index.html'
    return index_path.replace("\\", '/')
    
    
class TestTimeOuts(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        __class__.driver = webdriver.Firefox()
        index = configure_index()
        __class__.driver.get(index) 
        pass
		
    @classmethod
    def tearDownClass(cls):
	    __class__.driver.quit()
        #pass

    def setUp(self):
        #__class__.driver = webdriver.Firefox()
        #index = configure_index()
        #__class__.driver.get(index) 
        pass
        
    def resetClass(self):
        __class__.driver.quit()
        self.setUpClass()
	
    def tearDown(self):
        #__class__.driver.quit()
        pass
        
    def change_num(self, num1, num2, team):
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.F2)
        __class__.driver.find_element_by_id("userinput").send_keys(team)
        __class__.driver.find_element_by_id("userinput").send_keys(num1)
        __class__.driver.find_element_by_id("userinput").send_keys(num2)
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
  

    def change_num_already_exists(self, num1, num2):
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.F2)
        __class__.driver.find_element_by_id("userinput").send_keys("H")
        __class__.driver.find_element_by_id("userinput").send_keys(num1)
        __class__.driver.find_element_by_id("userinput").send_keys(num2)
         
    
    def test_change_home_number(self):
        print("test_change_home_number")
        num_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        
        self.change_num("01", "15", "H")
        
        num_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        self.assertNotEqual(num_before, num_after)
        self.assertEqual("15", num_after)

        num_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        
        self.change_num("15", "01", "H")
        
        num_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        self.assertNotEqual(num_before, num_after)
        self.assertEqual("01", num_after)
        
        
    def test_change_away_number(self):
        print("test_change_away_number")
        num_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        
        self.change_num("01", "15", "V")
        
        num_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        self.assertNotEqual(num_before, num_after)
        self.assertEqual("15", num_after)

        num_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        
        self.change_num("15", "01", "V")
        
        num_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        self.assertNotEqual(num_before, num_after)
        self.assertEqual("01", num_after)
        
    def test_change_num_already_exists(self):
        print("test_change_num_already_exists")
        
        num_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[2]").text
        
        self.change_num_already_exists("01", "10")
        
         # Error Check
        status = __class__.driver.find_element_by_id("inputvalidator").text
        
        self.assertEqual(status, "Invalid number. Another player already has this number. Press ESC or F10 to clear input")
        


    
if __name__ == '__main__':
    unittest.main()
    