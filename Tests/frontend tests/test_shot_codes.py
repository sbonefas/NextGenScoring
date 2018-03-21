from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest

class TestShotCodes(unittest.TestCase):
    driver = None
    alert = None

    @classmethod
    def setUpClass(cls):
        __class__.driver = webdriver.Firefox()
        __class__.driver.get("file:///C:/Users/damon/Documents/Senior_Yr_Sem2/Software%20Engineering/Project/NextGenScoring/index.html") 

    @classmethod
    def tearDownClass(cls):
        pass
	    #__class__.driver.quit()

    def setUp(self):
        pass
	
    def tearDown(self):
        if __class__.alert != None:
            #__class__.alert.quit()
            __class__.alert = None
		
		# Clear home score
        element =  __class__.driver.find_element_by_css_selector("#home > div.score > h2:nth-child(2)")
        __class__.driver.execute_script("arguments[0].innerText = '0'", element)

        # Clear home stats
        for i in range(2, 13):
            for j in range(4, 13):
                element = __class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(i)+"]/td["+str(j)+"]")
                __class__.driver.execute_script("arguments[0].innerText = '0'", element)
		
        # Clear home percentages		
        element = __class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[1]")
        __class__.driver.execute_script("arguments[0].innerText = 'FG%: 0 3FG%: 0 FT%: 0'", element)

        #Clear play-by-play - not working currently
		#element = __class__.driver.find_element_by_css_selector("#playbyplaybox > table > tbody")
        #element = __class__.driver.find_element_by_xpath("//*[@id='playbyplaybox']/table/tbody/tr[2]")
        #__class__.driver.execute_script("element.parentNode.removeChild(element)", element)
	     
    """Helper/test sub-methods"""
    def handle_player_stats(self, index):
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[4]").text, "1")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[5]").text, "1")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[6]").text, "0")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[7]").text, "0")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[8]").text, "0")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[9]").text, "0")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[10]").text, "0")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[11]").text, "0")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/table/tbody/tr["+str(index)+"]/td[12]").text, "0")
	
    def input_keys(self, player_no, command):
        __class__.alert = __class__.driver.switch_to.alert
        __class__.alert.send_keys(player_no)
        __class__.alert.accept()
        __class__.alert.send_keys(command)
        __class__.alert.accept()

    """Test methods"""
    def test_add_2pt_fg(self):
	    #id element doesn't actually matter
        __class__.driver.find_element_by_id("app").send_keys("J")
		
        # Give home team's player 1 a made 2 pointer
        __class__.input_keys(self, "01", "G")
		
		# Ensure that scoreboard has updated
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='home']/div[2]/h2[2]").text, "2")
		
		# Ensure that player stats have been updated
        __class__.handle_player_stats(self, 2)

        # Ensure that total team stats have been updated
        __class__.handle_player_stats(self, 12)

        # Ensure that field goal percentage has been updated
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='ps-home']/div/p[1]").text, "FG%: 100 3FG%: 0 FT%: 0")
		
		# Check that play-by-play has been updated
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='playbyplaybox']/table/tbody/tr[2]/td[1]").text, __class__.driver.find_element_by_id("clockh2").text)
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='playbyplaybox']/table/tbody/tr[2]/td[2]").text, "WISC")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='playbyplaybox']/table/tbody/tr[2]/td[3]").text, "Player_1 made a jump shot")
        self.assertEqual(__class__.driver.find_element_by_xpath("//*[@id='playbyplaybox']/table/tbody/tr[2]/td[4]").text, "2-0")

    def test_add_3pt_fg(self):
        __class__.driver.find_element_by_id("app").send_keys("J")
		
        # Give home team's player 2 a made 3 pointer
        __class__.input_keys(self, "02", "Y")
        #__class__.test_add_2pt_fg(self)
		
if __name__ == '__main__':
    unittest.main()