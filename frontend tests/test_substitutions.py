from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.keys import Keys
import unittest
import os

def configure_index():
    cwd = os.getcwd()
    path = os.path.abspath(os.path.join(cwd, os.pardir))
    index_path = 'file:///' + path + '/index.html'
    return index_path.replace("\\", '/')


def sub1Player(driver, player1, player2):    
    driver.find_element_by_id("userinput").send_keys(Keys.F6)
    driver.find_element_by_id("userinput").send_keys(player1)
    driver.find_element_by_id("userinput").send_keys(player2)
    driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
    

def subOutBenchPlayer(driver, player_out1, player_out2, player_in1):
    driver.find_element_by_id("userinput").send_keys(Keys.F6)
    driver.find_element_by_id("userinput").send_keys(player_out1)
    
    msg = driver.find_element_by_id("inputvalidator").text.split('.')[0]
    
    if (msg == "Player #" + player_out1 + " is not in the game"):
        driver.find_element_by_id("userinput").send_keys(Keys.BACKSPACE)
        driver.find_element_by_id("userinput").send_keys(Keys.BACKSPACE)
        driver.find_element_by_id("userinput").send_keys(Keys.BACKSPACE)
        driver.find_element_by_id("userinput").send_keys(Keys.BACKSPACE)
        
        driver.find_element_by_id("userinput").send_keys(Keys.F6)
        driver.find_element_by_id("userinput").send_keys(player_out2)
        driver.find_element_by_id("userinput").send_keys(player_in1)
        driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
    else:
        print("ERROR: Expected message about Player " + player_out1 + " not in game")
    
    
def subInPlayerInGame(driver, player_out, player_in1, player_in2):
    driver.find_element_by_id("userinput").send_keys(Keys.F6)
    driver.find_element_by_id("userinput").send_keys(player_out)
    driver.find_element_by_id("userinput").send_keys(player_in1)
    
    msg = driver.find_element_by_id("inputvalidator").text.split('.')[0]
    
    if (msg == "Player #" + player_in1 + " is already in the game"):
        for _ in range(0,7):
            driver.find_element_by_id("userinput").send_keys(Keys.BACKSPACE)
            
        driver.find_element_by_id("userinput").send_keys(Keys.F6)
        driver.find_element_by_id("userinput").send_keys(player_out)
        driver.find_element_by_id("userinput").send_keys(player_in2)
        driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
    else:
        print("ERROR: Expected message about Player " + player_out1 + " already in game")
   
   
def validSub(player1, player2):
    if (player1 == '*' and player2 == ''):
        return True
    else:
        return False
       
       
def numberInGame(playerList):
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
        #pass
         
    def test_sub1Player(self):
        print("test_sub1Player")
        ## SUB NUMBER 01 out for NUMBER 06
        numA_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[1]").text
        numB_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[7]/td[1]").text
        
        if(validSub(numA_star, numB_star)):
            sub1Player(__class__.driver, "01", "06")
        else:
            self.fail("Tried an invalid substitution. Ensure one player is in the game " + 
                      "and one is not")
        
        numA_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[1]").text
        numB_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[7]/td[1]").text
        
        self.assertNotEqual(numA_star, numA_star_after)
        self.assertNotEqual(numB_star, numB_star_after)
        self.assertEqual(numA_star_after, '')
        self.assertEqual(numB_star_after, '*')
        
    def test_sub2Player(self):
        print("test_sub2Player")
        ## SUB NUMBER 02 out for NUMBER 07
        numA_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[1]").text
        numB_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
         
        if(validSub(numA_star, numB_star)):
            sub1Player(__class__.driver, "02", "07")
        else:
            self.fail("Tried an invalid substitution. Ensure one player is in the game " + 
                      "and one is not")
        
        numA_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[1]").text
        numB_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
        
        self.assertNotEqual(numA_star, numA_star_after)
        self.assertNotEqual(numB_star, numB_star_after)
        self.assertEqual(numA_star_after, '')
        self.assertEqual(numB_star_after, '*')
        
        if(validSub(numB_star_after, numA_star_after)):
            sub1Player(__class__.driver, "07", "02")
        else:
            self.fail("Tried an invalid substitution. Ensure one player is in the game " + 
                      "and one is not")
        
        numA_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[1]").text
        numB_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
        
        self.assertNotEqual(numA_star, numA_star_after)
        self.assertNotEqual(numB_star, numB_star_after)
        self.assertEqual(numA_star, '*')
        self.assertEqual(numB_star, '')
            

    def test_sub_bench_player(self):
        print("test_sub_bench_player")
       
        # Attempt to sub out player 08 for player 09, but 08 is not in the game so sub out 01    
        subOutBenchPlayer(__class__.driver, "08", "01", "09")
        
        playerList = __class__.driver.find_element_by_id("ps-home").find_elements_by_xpath("table/tbody/tr")    
        num_in_game = numberInGame(playerList)
        self.assertEqual(num_in_game, 5)

        num09_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[10]/td[1]").text
        num01_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[1]").text
        self.assertEqual(num01_status, '')
        self.assertEqual(num09_status, '*')
        
        
    def test_player_out_for_player_curr_in(self):
        print("test_player_out_for_player_curr_in")
       
        # Attempt to sub out player 01 for player 02, but 02 is currently in game
        # so sub in 09    
        subInPlayerInGame(__class__.driver, "01", "02", "09")
        
        playerList = __class__.driver.find_element_by_id("ps-home").find_elements_by_xpath("table/tbody/tr")
        num_in_game = numberInGame(playerList)
        self.assertEqual(num_in_game, 5)  
        
        num09_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[10]/td[1]").text
        num01_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[1]").text
        num02_status = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[1]").text
        self.assertEqual(num01_status, '')
        self.assertEqual(num02_status, '*')
        self.assertEqual(num09_status, '*')
    
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
        
        self.assertEqual(clock, play_by_play[0])
        self.assertEqual("WISC", play_by_play[1])
        self.assertEqual(numB_name, play_by_play[2])
        self.assertEqual(numA_name, play_by_play[6])
        self.assertEqual(home_score + "-" + away_score, play_by_play[7])

        
    def test_play_by_play_away(self):
        print("test_play_by_play_away")
        ## Prepare comparison variables
        numA_name = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[3]").text
        numB_name = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[7]/td[3]").text

        home_score = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        away_score = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        clock = (__class__.driver.find_element_by_id("clockminutes").text + ":" + 
                 __class__.driver.find_element_by_id("clockseconds").text)
        
        # Make sure visitor has posession
        __class__.driver.find_element_by_id("clockminutes").send_keys("V")
        
        ## SUB PLAYER 01 out for 06
        sub1Player(__class__.driver, "01", "06")
        
        play_by_play = __class__.driver.find_element_by_id("playbyplaybox").find_element_by_xpath("table/tbody/tr[2]").text.split(" ")
        
        self.assertEqual(clock, play_by_play[0])
        self.assertEqual("VISITOR", play_by_play[1])
        self.assertEqual(numB_name, play_by_play[2])
        self.assertEqual(numA_name, play_by_play[6])
        self.assertEqual(home_score + "-" + away_score, play_by_play[7])       
     
     
if __name__ == '__main__':
    unittest.main()
