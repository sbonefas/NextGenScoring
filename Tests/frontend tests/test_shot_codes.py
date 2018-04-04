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

class TestShotCodes(unittest.TestCase):
    driver = None
    score = 0
    list = []
	
    @classmethod
    def setUpClass(cls):
        pass
		
    @classmethod
    def tearDownClass(cls):
        pass

    def setUp(self):
        __class__.driver = webdriver.Firefox()
        path = configure_index()
        __class__.driver.get(path)
        __class__.score = 0
        __class__.list = [0, 0, 0, 0, 0, 0, 0, 0, 0]
	
    def tearDown(self):
        __class__.driver.quit()
	    #pass
        
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
	
    def input_keys(self, player_no, keycode, reb_key):
        Alert(__class__.driver).send_keys(player_no)
        Alert(__class__.driver).accept()
        Alert(__class__.driver).send_keys(keycode)
        Alert(__class__.driver).accept()
        __class__.driver.implicitly_wait(2)

        if keycode == "R":
            Alert(__class__.driver).send_keys(reb_key)
            Alert(__class__.driver).accept()
            __class__.driver.implicitly_wait(5)
            if reb_key == "D":
                #TODO- Add additional parameter in above methods 
                Alert(__class__.driver).send_keys("01")
                Alert(__class__.driver).accept()

        else:
            # Assists not yet implemented
            Alert(__class__.driver).accept()

    def update_stats(self, shot, player_no, keycode, reb_key, point_val):
        #id element doesn't actually matter
        __class__.driver.find_element_by_id("app").send_keys("J")
        # Give home team's player_no a keycode
        __class__.input_keys(self, player_no, keycode, reb_key)
		# Ensure that scoreboard has updated
        if keycode != "R":
            __class__.score += point_val
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[1]/div[1]/div[2]/h2[2]").text, str(__class__.score))
		# Ensure that player stats have been updated
        if shot:
            __class__.list[1] += 1
        if keycode == "G" or keycode == "Q" or keycode == "P":
            __class__.list[0] += 1
            __class__.list[8] += 2
        elif keycode == "Y":
            __class__.list[0] += 1
            __class__.list[2] += 1
            __class__.list[8] += 3
        elif keycode == "R":
            # TODO - Later accept any two digit player_no
            if reb_key == player_no:
                __class__.list[5] += 1
        else:
            pass

    def scoreboard_and_player_stats(self, shot, player_no, keycode, reb_key, point_val):
        __class__.update_stats(self, shot, player_no, keycode, reb_key, point_val)
        __class__.handle_player_stats(self, 2)
        # Ensure that total team stats have been updated
        __class__.handle_player_stats(self, 12)
        if keycode == "R":
            # Check home/visitor CSS to determine current team is properly set
            if reb_key == "01" or reb_key == "M" or reb_key == "DB":
                self.assertEqual(__class__.driver.find_element_by_id("pshometeamname").value_of_css_property("color"), "rgb(255, 0, 0)")
                self.assertEqual(__class__.driver.find_element_by_id("pshometeamname").value_of_css_property("text-decoration"), "underline")
            else:
                self.assertEqual(__class__.driver.find_element_by_id("pshometeamname").value_of_css_property("color"), "rgb(0, 0, 0)")
                self.assertEqual(__class__.driver.find_element_by_id("pshometeamname").value_of_css_property("text-decoration"), "none")
                self.assertEqual(__class__.driver.find_element_by_id("psvisitorteamname").value_of_css_property("color"), "rgb(255, 0, 0)")
                self.assertEqual(__class__.driver.find_element_by_id("psvisitorteamname").value_of_css_property("text-decoration"), "underline")
            
            #Ensure that opposing team player #1's rebound was added
            if reb_key == "D":
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[2]/div[2]/table/tbody/tr[2]/td[9]").text, "1")
    
    def team_percentages(self, keycode):
        fg_percentage = 100 * (__class__.list[0] / __class__.list[1])
		# Added extra zero because in the Vue app there are 2 decimal points whereas in Python there's 1
        if keycode == "P" or keycode == "Q" or keycode == "P" or keycode == "R":
            self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[1]").text, "FG%: "+ str(fg_percentage)+str(0) +" 3FG%: 0 FT%: 0")
        elif keycode == "Y":
            #TODO - Next iteration will have a 3 attempted attribute to use 
            three_pt_fg_percentage = 100.00	
            self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[1]").text, "FG%: "+str(fg_percentage)+str(0) +" 3FG%: "+str(three_pt_fg_percentage)+str(0) +" FT%: 0")
  
    def play_by_play(self, index, keycode, reb_key, point_val):
        clock_time = __class__.driver.find_element_by_id("clockminutes").text + ":" + __class__.driver.find_element_by_id("clockseconds").text
        self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[1]").text, clock_time)
        if keycode != "R":
            self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[2]").text, "WISC")
        
        if keycode == "G" or keycode == "Q":
            self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[3]").text, "Player_1 made a jump shot")
        elif keycode == "P":
            self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[3]").text, "Player_1 made a shot in the paint")
            self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[4]").text, str(point_val)+"-0")
        elif keycode == "R":
            #keycode - Offensive player
            if reb_key == "01":
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[2]").text, "WISC")
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[3]").text, "Offensive rebound by Player_1")
            elif reb_key == "M":
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[2]").text, "WISC")
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[3]").text, "Offensive Team Rebound")
            elif reb_key == "B":
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[2]").text, "WISC")
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[3]").text, "Offensive Deadball")
            elif reb_key == "D":
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[2]").text, "VISITOR")
                # pass player number if d as argument
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[3]").text, "Defensive rebound by Player_1")
            elif reb_key == "DM":
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[2]").text, "VISITOR")
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[3]").text, "Defensive Team Rebound")
            elif reb_key == "DB":
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[2]").text, "VISITOR")
                self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[3]").text, "Defensive Deadball")      
            self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index)+"]/td[4]").text, str(point_val)+"-0")
            self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index+1)+"]/td[3]").text, "Player_1 J -> R")
            self.assertEqual(__class__.driver.find_element_by_xpath("/html/body/div/div[3]/table/tbody/tr["+str(index+1)+"]/td[4]").text, str(point_val)+"-0")

    """Automatically called test methods"""
    
    def test_make_2pt_fg(self):
        __class__.scoreboard_and_player_stats(self, True, "01", "G", None, 2)
		# Ensure that field goal percentage has been updated
        __class__.team_percentages(self, "G")
        __class__.play_by_play(self, 2, "G", None, 2)

    def test_make_2pt_fg__alt(self):
        # Give home team's player 1 a made 2 pointer - alternate key binding
        __class__.scoreboard_and_player_stats(self, True, "01", "Q", None, 2)
        __class__.team_percentages(self, "Q")
        __class__.play_by_play(self, 2, "Q", None, 2)

    def test_make_2pt_fg_paint(self):
        __class__.scoreboard_and_player_stats(self, True, "01", "P", None, 2)
        __class__.team_percentages(self, "P")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[3]").text, "paint: 1 offto: 0 2ndch: 0 fastb: 0")
        __class__.play_by_play(self, 2, "P", None, 2)
    
    def test_make_3pt_fg(self):
        __class__.scoreboard_and_player_stats(self, True, "01", "Y", None, 3)
        __class__.team_percentages(self, "Y")
        __class__.play_by_play(self, 2, "Y", None, 3)
    
 
    """ Missed shot followed by a rebound""" 
    def test_miss_2pt_fg_reb_off_player(self):
	    # Offensive rebound by player 1
        __class__.scoreboard_and_player_stats(self, True, "01", "R", "01", 2)
        __class__.team_percentages(self, "R")
        __class__.play_by_play(self, 2, "R", "01", 0)
        
    def test_make_2pt_fg_reb_off_team_reb(self):
        __class__.scoreboard_and_player_stats(self, True, "01", "R", "M", 2)
        __class__.team_percentages(self, "R")
        __class__.play_by_play(self, 2, "R", "M", 0)

    def test_make_2pt_fg_reb_off_deadball(self):
        __class__.scoreboard_and_player_stats(self, True, "01", "R", "B", 2)
        __class__.team_percentages(self, "R")
        __class__.play_by_play(self, 2, "R", "B", 0)
    
    def test_make_2pt_fg_reb_def_player(self):
        __class__.scoreboard_and_player_stats(self, True, "01", "R", "D", 2)
        __class__.team_percentages(self, "R")
        __class__.play_by_play(self, 2, "R", "D", 0)
        
    def test_make_2pt_fg_reb_def_team_reb(self):
        __class__.scoreboard_and_player_stats(self, True, "01", "R", "DM", 2)
        __class__.team_percentages(self, "R")
        __class__.play_by_play(self, 2, "R", "DM", 0)  
        
    def test_make_2pt_fg_reb_def_deadball(self):
        __class__.scoreboard_and_player_stats(self, True, "01", "R", "DB", 2)
        __class__.team_percentages(self, "R")
        __class__.play_by_play(self, 2, "R", "DB", 0)
    
if __name__ == '__main__':
    unittest.main()