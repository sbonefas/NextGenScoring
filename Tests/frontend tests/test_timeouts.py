from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest
import os


def configure_index():
    cwd = os.getcwd()
    path = os.path.abspath(os.path.join(cwd, os.pardir))
    path2 = os.path.abspath(os.path.join(path, os.pardir))  
    index_path = 'file:///' + path2 + '/index.html'
    return index_path.replace("\\", '/')
    
    
class TestTimeOuts(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # __class__.driver = webdriver.Firefox()
        # index = configure_index()
        # __class__.driver.get(index) 
        pass
		
    @classmethod
    def tearDownClass(cls):
	    #__class__.driver.quit()
        pass

    def setUp(self):
        __class__.driver = webdriver.Firefox()
        index = configure_index()
        __class__.driver.get(index) 
	
    def tearDown(self):
        #__class__.driver.quit()
        pass
        
    def timeout(self, home, full, media):
        __class__.driver.find_element_by_id("userinput").send_keys("O")
        
        if media:
            __class__.driver.find_element_by_id("userinput").send_keys("T")
            __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)     
        elif home:
            __class__.driver.find_element_by_id("userinput").send_keys("H")
            
            if full:
                __class__.driver.find_element_by_id("userinput").send_keys("M")
                __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)     
            else:
                __class__.driver.find_element_by_id("userinput").send_keys("3")
                __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)   
                
        else:
            __class__.driver.find_element_by_id("userinput").send_keys("V")
            if full:
                __class__.driver.find_element_by_id("userinput").send_keys("M")
                __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)     
            else:
                __class__.driver.find_element_by_id("userinput").send_keys("3")
                __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER) 
                
                
    def test_full_timeout_home(self):
        print("test_full_timeout_home")
        
        full_timeout_before = __class__.driver.find_element_by_id("home").find_element_by_class_name("fouls-bottom").text.split(' ')[1]
        
        self.timeout(home=True, full=True, media=False)
        
        full_timeout_after = __class__.driver.find_element_by_id("home").find_element_by_class_name("fouls-bottom").text.split(' ')[1]
        self.assertEqual(int(full_timeout_after), int(full_timeout_before) - 1)
        
        ## Attempt to call another full timeout. Should not decrement again.     
        self.timeout(home=True, full=True, media=False)
        
        full_timeout_after2 = __class__.driver.find_element_by_id("home").find_element_by_class_name("fouls-bottom").text.split(' ')[1]
        self.assertEqual(int(full_timeout_after2), int(full_timeout_after))
        
    def test_full_timeout_away(self):
        print("test_full_timeout_away")
        
        full_timeout_before = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("fouls-bottom").text.split(' ')[1]
        
        self.timeout(home=False, full=True, media=False)
        
        full_timeout_after = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("fouls-bottom").text.split(' ')[1]
        self.assertEqual(int(full_timeout_after), int(full_timeout_before) - 1)
        
        ## Attempt to call another full timeout. Should not decrement again.     
        self.timeout(home=False, full=True, media=False)
        
        full_timeout_after2 = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("fouls-bottom").text.split(' ')[1]
        self.assertEqual(int(full_timeout_after2), int(full_timeout_after))
        
    def test_full_timeout_pbp(self):
        print("test_full_timeout_pbp")
        
        ## START WITH A HOME TEAM FULL TIMEOUT ##
        home_score = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        away_score = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        clock = (__class__.driver.find_element_by_id("clockminutes").text + ":" + 
                 __class__.driver.find_element_by_id("clockseconds").text)
        
        self.timeout(home=True, full=True, media=False)
        
        play_by_play = __class__.driver.find_element_by_id("playbyplaybox").find_element_by_xpath("table/tbody/tr[2]").text.split(" ")
        
        self.assertEqual(clock, play_by_play[0])
        self.assertEqual("WISC", play_by_play[1])
        self.assertEqual("WISC", play_by_play[2])
        self.assertEqual("full", play_by_play[3])
        self.assertEqual("timeout", play_by_play[4])
        self.assertEqual(home_score + "-" + away_score, play_by_play[5]) 
        
        ## NOW CHECK FOR AWAY TEAM FULL TIMEOUT ##
        home_score = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        away_score = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        clock = (__class__.driver.find_element_by_id("clockminutes").text + ":" + 
                 __class__.driver.find_element_by_id("clockseconds").text)
        
        self.timeout(home=False, full=True, media=False)
        
        play_by_play = __class__.driver.find_element_by_id("playbyplaybox").find_element_by_xpath("table/tbody/tr[2]").text.split(" ")
        
        self.assertEqual(clock, play_by_play[0])
        self.assertEqual("VISITOR", play_by_play[1])
        self.assertEqual("VISITOR", play_by_play[2])
        self.assertEqual("full", play_by_play[3])
        self.assertEqual("timeout", play_by_play[4])
        self.assertEqual(home_score + "-" + away_score, play_by_play[5]) 
        
if __name__ == '__main__':
    unittest.main()
    