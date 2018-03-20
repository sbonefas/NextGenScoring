from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import unittest
from switch_team import SwitchTeam

class TestSwitchTeam(unittest.TestCase):
    driver = None

    @classmethod
    def setUpClass(cls):
	    ## Setup the website ##
        __class__.driver = webdriver.Firefox()
        __class__.driver.get("file:///C:/Users/damon/Documents/Senior_Yr_Sem2/Software%20Engineering/Project/NextGenScoring/index.html") 
		
    @classmethod
    def tearDownClass(cls):
	    __class__.driver.quit()

    def setUp(self):
	    self.team = SwitchTeam()
	
    def tearDown(self):
	    pass
	
    def test___init__(self):
	    # ensure default constructor selects default option - H
        self.assertEqual(self.team.curr_team, "H")
		
        # ensure parameterized constructor selects option 1 - H
        self.team2 = SwitchTeam("H")
        self.assertEqual(self.team2.curr_team, "H")
		
        # ensure parameterized constructor selects option 2 - V
        self.team3 = SwitchTeam("V")
        self.assertEqual(self.team3.curr_team, "V")
		
		# ensure parameterized constructor returns ValueError
        try:
            self.team4 = SwitchTeam("A")
            self.assertEqual(self.team4.curr_team, "A")		
        except ValueError:
            pass

		# ensure parameterized constructor returns ValueError
        try:
            self.team5 = SwitchTeam("h")
            self.assertEqual(self.team5.curr_team, "h")		
        except ValueError:
            pass

		# ensure parameterized constructor returns ValueError
        try:
            self.team6 = SwitchTeam("v")
            self.assertEqual(self.team6.curr_team, "v")		
        except ValueError:
            pass

        # ensure parameterized constructor returns ValueError
        try:
            self.team7 = SwitchTeam("Home")
            self.assertEqual(self.team7.curr_team, "Home")		
        except ValueError:
            pass
			
        # ensure parameterized constructor returns ValueError
        try:
            self.team8 = SwitchTeam("Visitor")
            self.assertEqual(self.team8.curr_team, "Visitor")		
        except ValueError:
            pass

    # starts at home and switches to home again
    def test_switch_to_home(self):
	    self.team.switch_to_home()
	    self.assertEqual(self.team.curr_team, "H")
	
    # starts at home and switches to visitor	
    def test_switch_to_visitor(self):
        self.team.switch_to_visitor()
        self.assertEqual(self.team.curr_team, "V")

    # starts at home, switches to visitor, and switches back to home
    def test_switch_between_end_at_home(self):
	    self.team.switch_to_visitor()
	    self.team.switch_to_home()
	    self.assertEqual(self.team.curr_team, "H")
		
    # starts at home, switches to visitor, switches to home, and back to visitor
    def test_switch_between_end_at_visitor(self):
	    self.team.switch_to_visitor()
	    self.team.switch_to_home()
	    self.team.switch_to_visitor()
	    self.assertEqual(self.team.curr_team, "V")
	
    # starts at visitor, switches to home, and switches back to visitor
    def test_start_at_visitor_switch_between_end_at_visitor(self):
	    self.team = SwitchTeam("V")
	    self.team.switch_to_home()
	    self.team.switch_to_visitor()
	    self.assertEqual(self.team.curr_team, "V")
		
if __name__ == '__main__':
    unittest.main()