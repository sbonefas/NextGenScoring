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
    #def tearDownClass(cls):
	#    __class__.driver.quit()
        
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
        
    
    def test_invalid_sub(self):
        print("test_invalid_sub")
        ## SUB NUMBER 08 out for 09 (Invalid)
        numA_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
        numB_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[10]/td[1]").text
         
        if(validSub(numA_star, numB_star)):
            self.fail("Tried an invalid substitution. Ensure one player is in the game " + 
                      "and one is not")
            sub1Player(__class__.driver, "08", "09")
        else:
            print("EXPECTED FAILURE, TEST PASSED!")
        
        numA_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
        numB_star_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[10]/td[1]").text
    

    ## WE WANT THIS TEST TO FAIL, AS OF 3/20 WE ALLOW MORE THAN 5 PLAYERS IN THE GAME ##
    def test_5inGame(self):
        print("test_allow_invalid_sub")
        playerList = __class__.driver.find_element_by_id("ps-home").find_elements_by_xpath("table/tbody/tr")
        
        #num_in_game = numberInGame(playerList)
        
        ## SUB PLAYER 08 out for 09 (Invalid)
        numA_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[8]/td[1]").text
        numB_star = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[10]/td[1]").text
        
        sub1Player(__class__.driver, "08", "09")
        
        num_in_game = numberInGame(playerList)
        
        if (num_in_game > 5):
            self.fail("More than 5 players allowed in game. An active player was not subbed out")
            
if __name__ == '__main__':
    unittest.main()
    