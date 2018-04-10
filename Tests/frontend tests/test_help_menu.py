from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.keys import Keys
import unittest
import os


def configure_index():
    cwd = os.getcwd()
    path = os.path.abspath(os.path.join(cwd, os.pardir))
    path2 = os.path.abspath(os.path.join(path, os.pardir))  
    index_path = 'file:///' + path2 + '/index.html'
    return index_path.replace("\\", '/')

    
    
    

class TestHelpMenu(unittest.TestCase):
    driver = None
    
    @classmethod
    def setUpClass(cls):
        pass
		
    @classmethod
    def tearDownClass(cls):
        pass
        
    def setUp(cls):
        ## Setup the website ##
        __class__.driver = webdriver.Firefox()
        path = configure_index()
        __class__.driver.get(path)
        
    def tearDown(self):
	    __class__.driver.quit()
        
    
    def testHelpMenu(self):
        __class__.driver.find_element_by_id("scorebar").send_keys(Keys.ALT, "H")
        
        expected = """HELP MENU: GAMETIME INPUT CODES AND KEYS

        FIELD GOAL CODES                NON-FIELD GOAL CODES
            J - 2- or 3- point shot              E - Free Throw  K - Block
            Y - 3-point shot                        R - Rebound     T - Turnover
            D - Dunk                                    A - Assist          S - Steal
            L - Layup                                   F - Foul            O - Timeout
            P - Tip-in
            W - Wrong basket (defensive team scores in offensive team basket)

        RESULT CODES
            G or Q - Good field goal (2- or 3-pointer)
            Y - Good 3-point field goal
            R - Missed field goal (followed by a rebound)
            X - Missed 3-point field goal (followed by a rebound)
            K - Missed field goal (due to a blocked shot)
            P - Made field goal in the paint
            F - Made field goal on a fast break
            Z - Made field goal in the paint on a fast break
            E - Made free throw

        SPECIAL KEYS
            H or V - Select the home team or the visiting team
            C - Change time, period, stats
            F2 - Make "quick" roster changes to player numbers and names
            F6 - Make player substitutions
            F7 - Change the clock time
            F10 - Clear and do not complete any partially keyed action
            SPACEBAR - Start or Stop the Clockclear
            ESC - Return to Main Menu"""
        
        assert(Alert(__class__.driver).text)
        
        
        
        
if __name__ == '__main__':
    unittest.main()
=======
from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.keys import Keys
import unittest
import os


def configure_index():
    cwd = os.getcwd()
    path = os.path.abspath(os.path.join(cwd, os.pardir))
    path2 = os.path.abspath(os.path.join(path, os.pardir))  
    index_path = 'file:///' + path2 + '/index.html'
    return index_path.replace("\\", '/')

    
    
    

class TestHelpMenu(unittest.TestCase):
    driver = None
    
    @classmethod
    def setUpClass(cls):
        pass
		
    @classmethod
    def tearDownClass(cls):
        pass
        
    def setUp(cls):
        ## Setup the website ##
        __class__.driver = webdriver.Firefox()
        path = configure_index()
        __class__.driver.get(path)
        
    def tearDown(self):
	    __class__.driver.quit()
        
    
    def testHelpMenu(self):
        __class__.driver.find_element_by_id("scorebar").send_keys(Keys.ALT, "H")
        
        expected = """HELP MENU: GAMETIME INPUT CODES AND KEYS

        FIELD GOAL CODES                NON-FIELD GOAL CODES
            J - 2- or 3- point shot              E - Free Throw  K - Block
            Y - 3-point shot                        R - Rebound     T - Turnover
            D - Dunk                                    A - Assist          S - Steal
            L - Layup                                   F - Foul            O - Timeout
            P - Tip-in
            W - Wrong basket (defensive team scores in offensive team basket)

        RESULT CODES
            G or Q - Good field goal (2- or 3-pointer)
            Y - Good 3-point field goal
            R - Missed field goal (followed by a rebound)
            X - Missed 3-point field goal (followed by a rebound)
            K - Missed field goal (due to a blocked shot)
            P - Made field goal in the paint
            F - Made field goal on a fast break
            Z - Made field goal in the paint on a fast break
            E - Made free throw

        SPECIAL KEYS
            H or V - Select the home team or the visiting team
            C - Change time, period, stats
            F2 - Make "quick" roster changes to player numbers and names
            F6 - Make player substitutions
            F7 - Change the clock time
            F10 - Clear and do not complete any partially keyed action
            SPACEBAR - Start or Stop the Clockclear
            ESC - Return to Main Menu"""
        
        assert(Alert(__class__.driver).text)
        
        
        
        
if __name__ == '__main__':
    unittest.main() 