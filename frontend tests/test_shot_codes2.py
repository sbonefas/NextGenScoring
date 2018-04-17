from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest
import os


def configure_index():
    cwd = os.getcwd()
    path = os.path.abspath(os.path.join(cwd, os.pardir)) 
    index_path = 'file:///' + path + '/index.html'
    return index_path.replace("\\", '/')

class TestShotCodes2(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        __class__.driver = webdriver.Firefox()
        index = configure_index()
        __class__.driver.get(index) 
        #pass
		
    @classmethod
    def tearDownClass(cls):
	    #__class__.driver.quit()
        pass

    def setUp(self):
        #__class__.driver = webdriver.Firefox()
        #index = configure_index()
        #__class__.driver.get(index) ]
        pass
	
    def tearDown(self):
        #__class__.driver.quit()
        pass

    def foul(self, team, player, tech=False):
        __class__.driver.find_element_by_id("userinput").send_keys("F")
        
        if tech == False:
            __class__.driver.find_element_by_id("userinput").send_keys(team)
            __class__.driver.find_element_by_id("userinput").send_keys(player)
            __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
            
            
    def free_throw(self, player, made, rebounded, off_rb, player2):
        __class__.driver.find_element_by_class_name("fouls").send_keys("E")
        
        Alert(__class__.driver).send_keys(player)
        Alert(__class__.driver).accept()
        __class__.driver.implicitly_wait(1)
        
        if made:  
            Alert(__class__.driver).send_keys("E")
            Alert(__class__.driver).accept()
        else:
            if rebounded:
                Alert(__class__.driver).send_keys("R")
                Alert(__class__.driver).accept()
                __class__.driver.implicitly_wait(2)
                
                if off_rb:
                    Alert(__class__.driver).send_keys(player2)
                    Alert(__class__.driver).accept()
                    __class__.driver.implicitly_wait(2)
                else:
                    Alert(__class__.driver).send_keys("D" + player2)
                    Alert(__class__.driver).accept()
                    __class__.driver.implicitly_wait(2)
            else:
                Alert(__class__.driver).send_keys("M")
                Alert(__class__.driver).accept()
    
    def assist(self, player):       
        __class__.driver.find_element_by_class_name("fouls").send_keys("A")
        Alert(__class__.driver).send_keys(player)
        Alert(__class__.driver).accept()
        
    
    def turnover(self, player, team):
        __class__.driver.find_element_by_id("userinput").send_keys("T")
        
        if team:
            __class__.driver.find_element_by_id("userinput").send_keys("M")
            __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
        else:
            __class__.driver.find_element_by_id("userinput").send_keys(player)
            __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)    
                
    
    def home_on_offense(self):
        __class__.driver.find_element_by_class_name("fouls").send_keys("H")
    
    def test_defensive_fouls(self):
        print("test_defensive_fouls")
        for i in range(0,5):
            # Get number of PF for player
            pf_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[13]").text
            
            # Get number of team fouls for defense
            tf_before = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("fouls-top").find_element_by_xpath('h3[2]').text
            
            self.foul("V", "01", False)
            
            # Check that PF for player incremented
            pf_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[13]").text
            self.assertEqual(int(pf_after), int(pf_before) + 1)
            
            # Check team fouls incremented
            tf_after =  __class__.driver.find_element_by_id("visitor").find_element_by_class_name("fouls-top").find_element_by_xpath('h3[2]').text
            
            ## WILL FAIL UNTIL TEAM FOULS INCREMENT
            #self.assertEqual(int(tf_after), int(tf_before) + 1, "Team fouls")
   
    
    def test_offensive_fouls(self):
        print("test_offensive_fouls")
        ## ASSUME HOME TEAM IS ON OFFENSE ##
        for i in range(0,5):
            self.home_on_offense()
            
            # Get number of PF for player
            pf_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[4]/td[13]").text
            
            # Get number of TO for player
            to_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[4]/td[12]").text
            
            # Get number of team fouls for offense
            tf_before = __class__.driver.find_element_by_id("home").find_element_by_class_name("fouls-top").find_element_by_xpath('h3[2]').text
            
            self.foul("H", "03", False)
            
            # Ensure that offensive foul switched possession -> Visitor should now be active
            visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
            visitor_color = visitor_style.split(';')[0].split(' ')[1]
            self.assertEqual(visitor_color, "red", "AWAY COLOR")

            home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
            home_color = home_style.split(';')[0].split(' ')[1]
            self.assertEqual(home_color, "white", "HOME COLOR")
            
            pf_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[4]/td[13]").text
            self.assertEqual(int(pf_after), int(pf_before) + 1)
            
            to_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[4]/td[12]").text
            self.assertEqual(int(to_after), int(to_before) + 1)
            
            tf_after = __class__.driver.find_element_by_id("home").find_element_by_class_name("fouls-top").find_element_by_xpath('h3[2]').text
            self.assertEqual(int(tf_after), int(tf_before))

            
    def test_foul_play_by_play(self):
        print("test_foul_play_by_play")
        
        self.home_on_offense()
        
        numA_name = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[3]").text
        home_score = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        away_score = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        clock = (__class__.driver.find_element_by_id("clockminutes").text + ":" + 
                 __class__.driver.find_element_by_id("clockseconds").text)
        
        self.foul("H", "01", False)
        
        play_by_play = __class__.driver.find_element_by_id("playbyplaybox").find_element_by_xpath("table/tbody/tr[2]").text.split(" ")
        
        self.assertEqual(clock, play_by_play[0])
        self.assertEqual("WISC", play_by_play[1])
        self.assertEqual("Foul", play_by_play[2])
        self.assertEqual(numA_name, play_by_play[4])
        self.assertEqual(home_score + "-" + away_score, play_by_play[5])
    
    ## BUG PENDING ##
    #def test_technical_fouls(self):
       
    ## BUG PENDING ##
    # def test_made_free_throw(self):
        # ## ASSUME HOME TEAM IS ON OFFENSE ##
        # self.home_on_offense()
        
        # for i in range(0,10):
        
            # ## TEST FT MADE ##
            # tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
            # ft_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[8]").text
            # fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[9]").text
            # team_pts_before = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").text.split(' ')[1]
            
            # self.free_throw("01", True, False, False, "02")
            
            # tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
            # ft_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[8]").text
            # fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[9]").text
            # team_pts_after = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").text.split(' ')[1]
            
            # self.assertEqual(int(tp_after), int(tp_before) + 1, "Total Player Points")
            # self.assertEqual(int(ft_after), int(ft_before) + 1, "FT Made")
            # self.assertEqual(int(fa_after), int(fa_before) + 1, "FT Attempted")
            # #self.assertEqual(int(team_pts_after), int(team_pts_before) + 1, "Total Team Points")
            
            # # TEST FG PERCENTAGE
            # pct = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[1]").text.split(' ')[-1]
            # self.assertEqual(pct, "100.00")
            
    
    # def test_missed_free_throw(self):
        # ## ASSUME HOME TEAM IS ON OFFENSE ##
        # self.home_on_offense()

        # ## OFFENSIVE REBOUND
        # for i in range(0,10):
            # tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
            # ft_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[8]").text
            # fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[9]").text
            # rb_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[10]").text
            # team_pts_before = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").text.split(' ')[1]
            
            # self.free_throw("01", False, True, True, "02")
            
            # tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
            # ft_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[8]").text
            # fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[9]").text
            # rb_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[10]").text
            # team_pts_after = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").text.split(' ')[1]
            # pct = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[1]").text.split(' ')[-1]
            
            # self.assertEqual(int(tp_after), int(tp_before), "Total player points")
            # self.assertEqual(int(ft_after), int(ft_before), "FT made")
            # self.assertEqual(int(fa_after), int(fa_before) + 1, "FT attempted")
            # self.assertEqual(int(rb_after), int(rb_before) + 1, "Player rebound")
            # self.assertEqual(int(team_pts_after), int(team_pts_before), "Total Team Points")
            # self.assertEqual(pct, '0.00')
            
        # # DEFENSIVE REBOUND
        # for i in range(0,10):
            # tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
            # ft_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[8]").text
            # fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[9]").text
            # rb_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[3]/td[10]").text
            # team_pts_before = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").text.split(' ')[1]
            
            # self.free_throw("01", False, True, False, "02")
            
            # tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
            # ft_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[8]").text
            # fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[9]").text
            # rb_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[3]/td[10]").text
            # team_pts_after = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").text.split(' ')[1]
            # pct = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[1]").text.split(' ')[-1]
            
            # self.assertEqual(int(tp_after), int(tp_before), "Total player points")
            # self.assertEqual(int(ft_after), int(ft_before), "FT made")
            # self.assertEqual(int(fa_after), int(fa_before) + 1, "FT attempted")
            # self.assertEqual(int(team_pts_after), int(team_pts_before), "Total Team Points")
            # self.assertEqual(pct, '0.00')
        
            # # WILL NOT PASS UNTIL REBOUNDS RECORDED FOR AWAY TEAM ON FT#
            # #self.assertEqual(int(rb_after), int(rb_before) + 1, "Player rebound")

    # def test_ft_percentage(self):
        # self.home_on_offense()
        
        # self.free_throw("01", True, False, False, "02")
        # self.free_throw("01", True, False, False, "02")
        # pct = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[1]").text.split(' ')[-1]
        # self.assertEqual(pct, '100.00')
        
        # self.free_throw("01", False, False, False, "02")
        # self.free_throw("01", False, False, False, "02")
        # pct = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[1]").text.split(' ')[-1]
        # self.assertEqual(pct, '50.00')
        
        # self.free_throw("01", False, False, False, "02")
        # self.free_throw("01", False, False, False, "02")        
        # pct = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[1]").text.split(' ')[-1]
        # self.assertEqual(pct, '33.33')
        
        # self.free_throw("01", True, False, False, "02")
        # self.free_throw("01", False, False, False, "02")        
        # pct = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[1]").text.split(' ')[-1]
        # self.assertEqual(pct, '37.50')
        
    
    def test_turnover_home(self):
        print("test_turnover_home")
        for _ in range(0,5):
            self.home_on_offense()
            
            # Check # TO for player, team, possession changes
            to_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[12]").text
            team_to_before1 = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[2]").text.split(' ')[2]
            team_to_before2 = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[12]").text
            
            visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
            visitor_color_1 = visitor_style.split(';')[0].split(' ')[1]
            
            self.turnover("01", False)
            
            to_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[12]").text
            team_to_after1 = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[2]").text.split(' ')[2]
            team_to_after2 = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[12]").text
            
            visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
            visitor_color_2 = visitor_style.split(';')[0].split(' ')[1]
            
            self.assertNotEqual(visitor_color_2, visitor_color_1)
            self.assertEqual(visitor_color_2, "red")
            self.assertEqual(int(to_after), int(to_before) + 1)
            self.assertEqual(int(team_to_after1), int(team_to_before1) + 1)
            self.assertEqual(int(team_to_after2), int(team_to_before2) + 1)
        
     
    def test_turnover_away(self):
        print("test_turnover_away")
        
        for _ in range(0,5):
            # Change to visitor
            __class__.driver.find_element_by_id("ps-visitor").send_keys("V")
            
            # Check # TO for player, team, possession changes
            to_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[12]").text
            team_to_before1 = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("div/p[2]").text.split(' ')[2]
            team_to_before2 = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[12]").text
            
            home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
            home_color_1 = home_style.split(';')[0].split(' ')[1]
            
            self.turnover("01", False)
            
            to_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[12]").text
            team_to_after1 = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("div/p[2]").text.split(' ')[2]
            team_to_after2 = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[12]").text
            
            home_style = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style")
            home_color_2 = home_style.split(';')[0].split(' ')[1]
            
            self.assertNotEqual(home_color_2, home_color_1)
            self.assertEqual(home_color_2, "red")
            self.assertEqual(int(to_after), int(to_before) + 1)
            self.assertEqual(int(team_to_after1), int(team_to_before1) + 1)
            self.assertEqual(int(team_to_after2), int(team_to_before2) + 1)
            
     
    def test_turnover_play_by_play(self):
        print("test_turnover_play_by_play")
        
        self.home_on_offense()
        numA_name = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[3]").text
        home_score = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        away_score = __class__.driver.find_element_by_id("visitor").find_element_by_class_name("score").find_element_by_xpath("h2[2]").text;
        clock = (__class__.driver.find_element_by_id("clockminutes").text + ":" + 
                 __class__.driver.find_element_by_id("clockseconds").text)
        
        self.turnover("01", False)
        
        play_by_play = __class__.driver.find_element_by_id("playbyplaybox").find_element_by_xpath("table/tbody/tr[2]").text.split(" ")
        
        self.assertEqual(clock, play_by_play[0])
        self.assertEqual("WISC", play_by_play[1])
        self.assertEqual("Turnover", play_by_play[2])
        self.assertEqual(numA_name, play_by_play[4])
        self.assertEqual(home_score + "-" + away_score, play_by_play[5]) 
        
        self.turnover("01", False)
        
        play_by_play = __class__.driver.find_element_by_id("playbyplaybox").find_element_by_xpath("table/tbody/tr[2]").text.split(" ")
        
        self.assertEqual(clock, play_by_play[0])
        self.assertEqual("VISITOR", play_by_play[1])
        self.assertEqual("Turnover", play_by_play[2])
        self.assertEqual(numA_name, play_by_play[4])
        self.assertEqual(home_score + "-" + away_score, play_by_play[5]) 
        
        
    def test_team_turnover(self):
        print("test_team_turnover")
        
        for _ in range(0,5):
            self.home_on_offense()
            
            team_to_before1 = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[2]").text.split(' ')[2]
            team_to_before2 = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[12]").text
                
            visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
            visitor_color_1 = visitor_style.split(';')[0].split(' ')[1]       
            
            self.turnover(None, True)
            
            team_to_after1 = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("div/p[2]").text.split(' ')[2]
            team_to_after2 = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[12]").text
                
            visitor_style = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style")
            visitor_color_2 = visitor_style.split(';')[0].split(' ')[1]    
            
            self.assertEqual(int(team_to_after1), int(team_to_before1) + 1, "Check team fouls inc")
            self.assertEqual(int(team_to_after2), int(team_to_before2) + 1, "Check team fouls inc - lower")
            self.assertNotEqual(visitor_color_1, visitor_color_2, "Check team color changed")
            self.assertEqual("red", visitor_color_2, "Check visitor team has ball")
    
    ## PENDING BUG FIX ##
    #def test_team_turnover_play_by_play(self):
    #    print("test_team_turnover_play_by_play")
        
        
        
    # def test_assist(self):
       # self.home_on_offense()
       
       # self.assist("01")
    
        

if __name__ == '__main__':
    unittest.main()
    