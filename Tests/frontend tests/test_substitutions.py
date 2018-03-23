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


def sub1Player(driver, player1, player2):
    driver.find_element_by_id("ps-home").send_keys(Keys.F6)
    
    # Player being removed
    Alert(driver).send_keys(player1)
    Alert(driver).accept()
    
    # Player being added
    Alert(driver).send_keys(player2)
    Alert(driver).accept()
    

def subOutBenchPlayer(driver, player_out1, player_out2, player_in1):
    driver.find_element_by_id("ps-home").send_keys(Keys.F6)
    
    # Player being removed
    Alert(driver).send_keys(player_out1)
    Alert(driver).accept()
    
    # New alert for player being removed not being in game
    Alert(driver).send_keys(player_out2)
    Alert(driver).accept()
    
    # Player being added
    Alert(driver).send_keys(player_in1)
    Alert(driver).accept()
    
    
def subInPlayerInGame(driver, player_out, player_in1, player_in2):
    driver.find_element_by_id("ps-home").send_keys(Keys.F6)
    
    # Player being removed
    Alert(driver).send_keys(player_out)
    Alert(driver).accept()
    
    # Player being added
    Alert(driver).send_keys(player_in1)
    Alert(driver).accept()

    # New alert for player being subbed in already being in
    Alert(driver).send_keys(player_in2)
    Alert(driver).accept()
    

def validSub(player1, player2):
    if (player1 == '*' and player2 == ''):
        return True
    else:
        return False
       
       
def numberInGame(playerList):
    #print(playerList)
    numPlayers = 0
    for player in playerList:
        if player.text.split(' ')[0] == '*':
            numPlayers += 1
    
    return numPlayers
    
    
class TestSubs(unittest.TestCase):
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
         
    def test_sub1Player(self):
        print("test_sub1Player")
        ## SUB NUMBER 01 out for NUMBER 06
        numA_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[1]").text
        numB_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[7]/td[1]").text
        
        if(validSub):
            sub1Player(__class__.driver, "01", "06")
        else:
            self.fail("Tried an invalid substitution. Ensure one player is in the game " + 
                      "and one is not")
        
        numA_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[1]").text
        numB_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[7]/td[1]").text
        
        assert(numA_star != numA_star_after)
        assert(numB_star != numB_star_after)
        assert(numA_star_after == '')
        assert(numB_star_after == '*')
        
    def test_sub2Player(self):
        print("test_sub2Player")
        ## SUB NUMBER 02 out for NUMBER 07
        numA_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[1]").text
        numB_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
         
        if(validSub):
            sub1Player(__class__.driver, "02", "07")
        else:
            self.fail("Tried an invalid substitution. Ensure one player is in the game " + 
                      "and one is not")
        
        numA_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[1]").text
        numB_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
        
        assert(numA_star != numA_star_after)
        assert(numB_star != numB_star_after)
        assert(numA_star_after == '')
        assert(numB_star_after == '*')
        
        if(validSub):
            sub1Player(__class__.driver, "07", "02")
        else:
            self.fail("Tried an invalid substitution. Ensure one player is in the game " + 
                      "and one is not")
        
        numA_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[1]").text
        numB_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
        
        assert(numA_star != numA_star_after)
        assert(numB_star != numB_star_after)
        assert(numA_star == '*')
        assert(numB_star == '')
            

    def test_sub_bench_player(self):
        print("test_sub_bench_player")
       
        # Attempt to sub out player 08 for player 09, but 08 is not in the game so sub out 01    
        subOutBenchPlayer(__class__.driver, "08", "01", "09")
        
        playerList = __class__.driver.find_element_by_id("ps-home").find_elements_by_xpath("table/tbody/tr")    
        num_in_game = numberInGame(playerList)
        assert(num_in_game == 5)

        num09_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[10]/td[1]").text
        num01_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[1]").text
        assert(num01_status == '')
        assert(num09_status == '*')
        
        
    def test_player_out_for_player_curr_in(self):
        print("test_player_out_for_player_curr_in")
       
        # Attempt to sub out player 01 for player 02, but 02 is currently in game
        # so sub in 09    
        subInPlayerInGame(__class__.driver, "01", "02", "09")
        
        playerList = __class__.driver.find_element_by_id("ps-home").find_elements_by_xpath("table/tbody/tr")
        num_in_game = numberInGame(playerList)
        assert(num_in_game == 5)  
        
        num09_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[10]/td[1]").text
        num01_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[1]").text
        num02_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[1]").text
        assert(num01_status == '')
        assert(num02_status == '*')
        assert(num09_status == '*')
    
    def test_play_by_play(self):
        print("test_play_by_play")
        ## Prepare comparison variables
        numA_name = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[3]").text
        numB_name = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[7]/td[3]").text

        home_score = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        away_score = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        clock = (__class__.driver.find_element_by_id("clockminutes").text + ":" + 
                 __class__.driver.find_element_by_id("clockseconds").text)
        
        ## SUB PLAYER 01 out for 06
        sub1Player(__class__.driver, "01", "06")
        
        play_by_play = __class__.driver.find_element_by_id("playbyplaybox").find_element_by_xpath("table/tbody/tr[2]").text.split(" ")
        
        assert(clock == play_by_play[0])
        assert("WISC" == play_by_play[1])
        assert(numB_name == play_by_play[2])
        assert(numA_name == play_by_play[6])
        assert(home_score + "-" + away_score == play_by_play[7])
        
    ## WILL FAIL UNTIL VISITING TEAM IS ABLE TO UPDATE PLAY BY PLAY ##
    def test_play_by_play_away(self):
        print("test_play_by_play_away")
        ## Prepare comparison variables
        numA_name = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[3]").text
        numB_name = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[7]/td[3]").text

        home_score = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        away_score = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        clock = (__class__.driver.find_element_by_id("clockminutes").text + ":" + 
                 __class__.driver.find_element_by_id("clockseconds").text)
        
        ## SUB PLAYER 01 out for 06
        sub1Player(__class__.driver, "01", "06")
        
        play_by_play = __class__.driver.find_element_by_id("playbyplaybox").find_element_by_xpath("table/tbody/tr[2]").text.split(" ")
        
        assert(clock == play_by_play[0])
        assert("AWAY" == play_by_play[1])
        assert(numB_name == play_by_play[2])
        assert(numA_name == play_by_play[6])
        assert(home_score + "-" + away_score == play_by_play[7])        
        
if __name__ == '__main__':
    unittest.main()
    