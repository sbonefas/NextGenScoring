from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest

class TestShotCodes(unittest.TestCase):
    driver = None
    alert = None
    score = 0
    list = [0, 0, 0, 0, 0, 0, 0, 0, 0]
	
    @classmethod
    def setUpClass(cls):
        __class__.driver = webdriver.Firefox()
        __class__.driver.get("file:///C:/Users/damon/Documents/Senior_Yr_Sem2/Software%20Engineering/Project/NextGenScoring/index.html") 
		
    @classmethod
    def tearDownClass(cls):
	    __class__.driver.quit()

    def setUp(self):
        pass
	
    def tearDown(self):
        # Switches to V after all keycodes except R. All tests designed for home team to score
        __class__.driver.find_element_by_id("app").send_keys("H")
	     
    """Helper/test sub-methods"""
    def handle_player_stats(self, index):
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[4]").text, str(__class__.list[0]))
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[5]").text, str(__class__.list[1]))
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[6]").text, str(__class__.list[2]))
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[7]").text, str(__class__.list[3]))
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[8]").text, str(__class__.list[4]))
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[9]").text, str(__class__.list[5]))
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[10]").text, str(__class__.list[6]))
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[11]").text, str(__class__.list[7]))
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[12]").text, str(__class__.list[8]))
	
    def input_keys(self, player_no, keycode):
        __class__.alert = __class__.driver.switch_to.alert
        __class__.alert.send_keys(player_no)
        __class__.alert.accept()
        __class__.alert.send_keys(keycode)
        __class__.alert.accept()
		
    def play_by_play_always_same(self, index):
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[1]").text, __class__.driver.find_element_by_id("clockh2").text)
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[2]").text, "WISC")
		
    def add_score(self, player_no, keycode, point_val):
        #id element doesn't actually matter
        __class__.driver.find_element_by_id("app").send_keys("J")
        # Give home team's player_no a keycode
        __class__.input_keys(self, player_no, keycode)
		# Ensure that scoreboard has updated
        if keycode != "R":
            __class__.score += point_val
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='home']/div[2]/h2[2]").text, str(__class__.score))
		# Ensure that player stats have been updated
        __class__.list[1] += 1
        if keycode == "G" or keycode == "Q" or keycode == "P":
            __class__.list[0] += 1
        elif keycode == "Y":
            __class__.list[0] += 1
            __class__.list[2] += 1
		#elif keycode == R: Add functionality when frontend team completes R

    """Automatically called test methods"""
    def test_make_2pt_fg_scoreboard_and_player_stats(self):
        __class__.add_score(self, "01", "G", 2)
        __class__.handle_player_stats(self, 2)
        # Ensure that total team stats have been updated
        __class__.handle_player_stats(self, 12)
    
    def test_make_2pt_fg_team_percentages(self):
        # Ensure that field goal percentage has been updated
        fg_percentage = 100 * (__class__.list[0] / __class__.list[1])	
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[1]").text, "FG%: "+ str(fg_percentage) + " 3FG%: 0 FT%: 0")
	
    def test_make_2pt_fg_paint_zplay_by_play(self):
		# Check that play-by-play has been updated
        __class__.play_by_play_always_same(self, 2)
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr[2]/td[3]").text, "Player_1 made a shot in the paint")
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr[2]/td[4]").text, "2-0")
    
    def test_make_2pt_fg_scoreboard_and_player_stats_alt(self):
        # Give home team's player 1 a made 2 pointer - alternate key binding
        __class__.add_score(self, "01", "Q", 2)
        __class__.handle_player_stats(self, 2)
        __class__.handle_player_stats(self, 12)
		
    '''
	def test_make_2pt_fg_zplay_by_play(self):
        # Check that play-by-play has been updated
        __class__.play_by_play_always_same(self, 2)
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr[2]/td[3]").text, "Player_1 J -> R")
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr[2]/td[4]").text, "6-0")
        __class__.play_by_play_always_same(self, 3)
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr[3]/td[3]").text, "Player_1 made a jump shot")
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr[3]/td[4]").text, "4-0")
        __class__.play_by_play_always_same(self, 4)
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr[4]/td[3]").text, "Player_1 made a jump shot")
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr[4]/td[4]").text, "2-0")
	'''

    def test_make_2pt_fg_paint_scoreboard_and_player_stats(self):
        __class__.add_score(self, "01", "P", 2)
        __class__.handle_player_stats(self, 2)
        __class__.handle_player_stats(self, 12)

    def test_make_2pt_fg_paint_team_percentages(self):
        fg_percentage = 100 * (__class__.list[0] / __class__.list[1])	
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[1]").text, "FG%: "+str(fg_percentage)+" 3FG%: 0 FT%: 0")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[3]").text, "paint: 2 offto: 0 2ndch: 0 fastb: 0")

    def test_make_3pt_fg_scoreboard_and_player_stats(self):
        __class__.add_score(self, "01", "Y", 3)
        __class__.handle_player_stats(self, 2)
        __class__.handle_player_stats(self, 12)

    def test_make_3pt_fg_team_percentages(self):	
        fg_percentage = 100 * (__class__.list[0] / __class__.list[1])
        three_pt_fg_percentage = 100 * (__class__.list[2] / (__class__.list[1] - 3))		
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[1]").text, "FG%: "+str(fg_percentage)+" 3FG%: "+str(three_pt_fg_percentage)+" FT%: 0")

    '''
    def test_make_3pt_fg_play_by_play(self):
    '''

    def test_miss_2pt_fg_scoreboard_and_player_stats(self):
        __class__.add_score(self, "01", "R", 2)        
        __class__.handle_player_stats(self, 2)
        __class__.handle_player_stats(self, 12)
    
    def test_miss_2pt_fg_team_percentages(self):
        fg_percentage = 100 * (__class__.list[0] / __class__.list[1])
        three_pt_fg_percentage = 100 * (__class__.list[2] / (__class__.list[1] - 4))		
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[1]").text, "FG%: "+str(fg_percentage)+" 3FG%: "+str(three_pt_fg_percentage)+" FT%: 0")
		
    '''
    def test_miss_2pt_fg_play_by_play(self):
	    pass
    '''

if __name__ == '__main__':
    unittest.main()