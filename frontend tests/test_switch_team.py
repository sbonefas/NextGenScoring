from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest
import os


def configure_index():
    cwd = os.getcwd()
    index_path = 'file:///' + cwd + '/index.html'
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
        self.switch_to_home_with_h()
        
    def resetClass(self):
        __class__.driver.quit()
        self.setUpClass()
	
    def tearDown(self):
        #__class__.driver.quit()
        pass
        
    def setupAway(self):
        self.switch_to_away_with_v()
        
    def switch_to_home_with_h(self):
        __class__.driver.find_element_by_class_name("fouls").send_keys("H")
    
    def switch_to_away_with_v(self):
        __class__.driver.find_element_by_class_name("fouls").send_keys("V")
        
    def switch_to_home_with_left(self):
        __class__.driver.find_element_by_class_name("fouls").send_keys(Keys.LEFT)
    
    def switch_to_away_with_right(self):
        __class__.driver.find_element_by_class_name("fouls").send_keys(Keys.RIGHT)
    
    def test_switch_to_away_with_v(self):
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color1 = visitor_style.split(';')[0].split(' ')[1]
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color1 = home_style.split(';')[0].split(' ')[1]

        self.switch_to_away_with_v()
        
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color2 = visitor_style.split(';')[0].split(' ')[1]
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color2 = home_style.split(';')[0].split(' ')[1]
        
        self.assertNotEqual(home_color1, home_color2)
        self.assertNotEqual(visitor_color1, visitor_color2)
        self.assertEqual(home_color2, 'white')
        self.assertEqual(visitor_color2, 'red')
        
        
    def test_switch_to_home_with_h(self):
        self.setupAway()
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color1 = visitor_style.split(';')[0].split(' ')[1]
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color1 = home_style.split(';')[0].split(' ')[1]

        self.switch_to_home_with_h()
        
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color2 = visitor_style.split(';')[0].split(' ')[1]
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color2 = home_style.split(';')[0].split(' ')[1]
        
        self.assertNotEqual(home_color1, home_color2)
        self.assertNotEqual(visitor_color1, visitor_color2)
        self.assertEqual(visitor_color2, 'white')
        self.assertEqual(home_color2, 'red')
        

    def test_switch_to_away_with_right(self):
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color1 = visitor_style.split(';')[0].split(' ')[1]
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color1 = home_style.split(';')[0].split(' ')[1]

        self.switch_to_away_with_right()
        
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color2 = visitor_style.split(';')[0].split(' ')[1]
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color2 = home_style.split(';')[0].split(' ')[1]
        
        self.assertNotEqual(home_color1, home_color2)
        self.assertNotEqual(visitor_color1, visitor_color2)
        self.assertEqual(home_color2, 'white')
        self.assertEqual(visitor_color2, 'red')
        
        
    def test_switch_to_home_with_left(self):
        self.setupAway()
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color1 = visitor_style.split(';')[0].split(' ')[1]
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color1 = home_style.split(';')[0].split(' ')[1]

        self.switch_to_home_with_left()
        
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color2 = visitor_style.split(';')[0].split(' ')[1]
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color2 = home_style.split(';')[0].split(' ')[1]
        
        self.assertNotEqual(home_color1, home_color2)
        self.assertNotEqual(visitor_color1, visitor_color2)
        self.assertEqual(visitor_color2, 'white')
        self.assertEqual(home_color2, 'red')
        
        
    def test_change_mult_end_home(self):
        self.switch_to_away_with_right()
        self.switch_to_away_with_right()
        self.switch_to_home_with_left()
        self.switch_to_away_with_right()
        self.switch_to_home_with_left()
        
        home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
        home_color = home_style.split(';')[0].split(' ')[1]
        
        self.assertEqual(home_color, "red")
    

    def test_change_mult_end_away(self):
        self.switch_to_away_with_right()
        self.switch_to_away_with_right()
        self.switch_to_home_with_left()
        self.switch_to_away_with_right()
        self.switch_to_home_with_left()
        self.switch_to_away_with_right()
        
        visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
        visitor_color = visitor_style.split(';')[0].split(' ')[1]
        
        self.assertEqual(visitor_color, "red")


    
if __name__ == '__main__':
    unittest.main()
    