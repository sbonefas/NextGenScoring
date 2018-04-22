from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest
import os

def configure_index():
    cwd = os.getcwd()
    index_path = 'file:///' + cwd + '/'
    return index_path.replace("\\", '/')
        
    
class TestGames(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        __class__.driver = webdriver.Firefox()
        __class__.driver.get(configure_index() + "selectgame.html")
        
    @classmethod
    def tearDownClass(cls):
	    __class__.driver.quit()
        #pass
        
    def setUp(self):
        pass

    def setUpGame(self):
        __class__.driver.get(configure_index() + "selectgame.html")
	
    def tearDown(self):
        pass
        
    def test_delete_game(self):
        print("test_delete_game")
        game = __class__.driver.find_element_by_class_name("game_search").find_element_by_xpath("tbody/tr[1]/td/button/h3[1]").text
        __class__.driver.find_element_by_class_name("game_search").find_element_by_xpath("tbody/tr[1]").click()
        __class__.driver.find_element_by_class_name("game_search").send_keys(Keys.F9)
        delete_msg = "DELETE GAME: " + game + " at 17:00?"
        self.assertEqual(delete_msg, Alert(__class__.driver).text, "Delete game warning message")
        Alert(__class__.driver).accept()
        
        game_new = __class__.driver.find_element_by_class_name("game_search").find_element_by_xpath("tbody/tr[1]/td/button/h3").text
        self.assertNotEqual(game_new, game, "First game should no longer be the top game")
    

    def test_no_select_err(self):
        print("test_no_select_err")
        self.setUpGame()
        __class__.driver.find_element_by_class_name("game_search").send_keys(Keys.F9)
        err_msg = "ERROR NO GAME SELECTED"
        self.assertEqual(err_msg, Alert(__class__.driver).text, "No game selected error message")
        Alert(__class__.driver).accept()       
       
    def test_zedit_game_msg(self):
        print("test_edit_game_msg")
        self.setUpGame()
        team = __class__.driver.find_element_by_class_name("game_search").find_element_by_xpath("tbody/tr[1]/td/button/h3").text
        __class__.driver.find_element_by_class_name("game_search").find_element_by_xpath("tbody/tr[1]").click()
        __class__.driver.find_element_by_class_name("game_search").send_keys(Keys.ENTER)
        
        options = __class__.driver.find_element_by_class_name("modal-content").find_elements_by_xpath("h4")
        exp_options = ["Home Team Name:", "Home Team Code (Example: WISC):", "Home Team Record (Wins-Losses):",
                       "Visting Team Name:", "Visiting Team Code (Example: WISC):", "Visitor Team Record (Wins-Losses):",
                       "Game Date:", "Game Time:", "Site of Game:", "Site Code (Home, Away, Neutral):", "League Game (Y/N):",
                       "Schedule Note:", "Halves or Quarters (Men/Women):", "# Mins per period:", "# Mins in Overtime:",
                       "Officials:", "Attendance:", "Box Score Comments (4 Lines):"]
          
        passed = 0
        drop_down = 0
        for option in options:
            if option.text in exp_options:
                passed = passed + 1
            else:
                drop_down = drop_down + 1
        
        self.assertEqual(passed, int("15"), "Assert 15 expected input options are present, excluding the drop down ones")
        self.assertEqual(drop_down, int("3"), "Assert 3 drop down options are present")
        
        
    def test_edit_transition(self):
        print("test_edit_transition")
        self.setUpGame()
        team = __class__.driver.find_element_by_class_name("game_search").find_element_by_xpath("tbody/tr[1]/td/button/h3").text
        __class__.driver.find_element_by_class_name("game_search").find_element_by_xpath("tbody/tr[1]").click()
        __class__.driver.find_element_by_class_name("game_search").send_keys(Keys.ENTER)
        __class__.driver.find_element_by_class_name("modal-content").find_element_by_xpath("button").click()
        
        self.assertEqual(__class__.driver.current_url, configure_index() + "index.html", "Should navigate to index page") 
        


    def test_new_game_msg(self):
        print("test_new_game_msg")
        self.setUpGame()
        team = __class__.driver.find_element_by_class_name("game_option").find_element_by_xpath("button").click()
        
        options = __class__.driver.find_element_by_class_name("modal-content").find_elements_by_xpath("h4")
        exp_options = ["Home Team Name:", "Home Team Code (Example: WISC):", "Home Team Record (Wins-Losses):",
                       "Visting Team Name:", "Visiting Team Code (Example: WISC):", "Visitor Team Record (Wins-Losses):",
                       "Game Date:", "Game Time:", "Site of Game:", "Site Code (Home, Away, Neutral):", "League Game (Y/N):",
                       "Schedule Note:", "Halves or Quarters (Men/Women):", "# Mins per period:", "# Mins in Overtime:",
                       "Officials:", "Attendance:", "Box Score Comments (4 Lines):"]
          
        passed = 0
        drop_down = 0
        for option in options:
            if option.text in exp_options:
                passed = passed + 1
            else:
                drop_down = drop_down + 1
        
        self.assertEqual(passed, int("15"), "Assert 15 expected input options are present, excluding the drop down ones")
        self.assertEqual(drop_down, int("3"), "Assert 3 drop down options are present")

        
if __name__ == '__main__':
    unittest.main()