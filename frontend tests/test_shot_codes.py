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
        #__class__.driver.get(index)
        self.home_on_offense()
        #pass
	
    def tearDown(self):
        #__class__.driver.quit()
        pass
    
    def home_on_offense(self):
        __class__.driver.find_element_by_class_name("fouls").send_keys("H")
    
    def shoot_2pt(self, shooter, alt, assist, assister):
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys(shooter)
        
        if alt:
            __class__.driver.find_element_by_id("userinput").send_keys("Q")
        else:
            __class__.driver.find_element_by_id("userinput").send_keys("G")
        
        if assist:
            __class__.driver.find_element_by_id("userinput").send_keys(assister)
        
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)   
        
        
    def shoot_paint_or_fb(self, shooter, key, assist, assister):
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys(shooter)
        __class__.driver.find_element_by_id("userinput").send_keys(key)
        
        if assist:
            __class__.driver.find_element_by_id("userinput").send_keys(assister)
        
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
        
        
    def shoot_3pt(self, key, shooter, assist, assister):
        # 3 pt from J (jumper)
        if key == 'J':
            __class__.driver.find_element_by_id("userinput").send_keys("J")
            __class__.driver.find_element_by_id("userinput").send_keys(shooter)

        __class__.driver.find_element_by_id("userinput").send_keys("Y")
        
        if assist:
            __class__.driver.find_element_by_id("userinput").send_keys(assister)
        
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
        
        
    def rebound(self, offensive, team, db, player):
        if offensive:
            if team:
                __class__.driver.find_element_by_id("userinput").send_keys("M")
            elif db:
                __class__.driver.find_element_by_id("userinput").send_keys("B")
            else:
                __class__.driver.find_element_by_id("userinput").send_keys(player)
        else:
            __class__.driver.find_element_by_id("userinput").send_keys("D")
            if team:
                __class__.driver.find_element_by_id("userinput").send_keys("M")
            elif db:
                __class__.driver.find_element_by_id("userinput").send_keys("B")
            else:
                __class__.driver.find_element_by_id("userinput").send_keys(player)
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
    
     
    def block(self, key, shooter, blocker):
        __class__.driver.find_element_by_id("userinput").send_keys(key)
        
        __class__.driver.find_element_by_id("userinput").send_keys(shooter)
        __class__.driver.find_element_by_id("userinput").send_keys("K")
        __class__.driver.find_element_by_id("userinput").send_keys(blocker)
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.ENTER)
    
    def test_make_2pt_fg(self):
        print("test_make_2pt_fg")
        
        fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text
        
        self.shoot_2pt("01", False, False, "02")

        fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text
    
        self.assertEqual(int(fg_after), int(fg_before) + 1, "FG made")
        self.assertEqual(int(fa_after), int(fa_before) + 1, "FG attempted")
        self.assertEqual(int(tp_after), int(tp_before) + 2, "Total points")
        self.assertEqual(int(team_fg_after), int(team_fg_before) + 1, "Team FG made")
        self.assertEqual(int(team_fa_after), int(team_fa_before) + 1, "Team FG attempted")
        self.assertEqual(int(team_tp_after), int(team_tp_before) + 2, "Team Total points")
        
        
    def test_make_2pt_fg_alt(self):
        print("test_make_2pt_fg_alt")
        
        fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text
        
        self.shoot_2pt("01", True, False, "02")

        fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text
    
        self.assertEqual(int(fg_after), int(fg_before) + 1, "FG made")
        self.assertEqual(int(fa_after), int(fa_before) + 1, "FG attempted")
        self.assertEqual(int(tp_after), int(tp_before) + 2, "Total points")
        self.assertEqual(int(team_fg_after), int(team_fg_before) + 1, "Team FG made")
        self.assertEqual(int(team_fa_after), int(team_fa_before) + 1, "Team FG attempted")
        self.assertEqual(int(team_tp_after), int(team_tp_before) + 2, "Team Total points")
        
        
    ## Other tests make sure the scoring part works, now check assists
    def test_assist_on_2pt_fg(self):
        print("test_assist_on_2pt_fg")
        as_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.shoot_2pt("01", False, True, "02")
        as_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.assertEqual(int(as_after), int(as_before) + 1)
        
    ## Other tests make sure the scoring part works, now check assists
    def test_assist_on_2pt_fg_alt(self):
        print("test_assist_on_2pt_fg_alt")
        as_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.shoot_2pt("01", True, True, "02")
        as_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.assertEqual(int(as_after), int(as_before) + 1)
    
    def test_paint_fg(self):
        print("test_paint_fg")       
        paint_pts_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath('div/p[3]').text.split(' ')[1]
        fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text

        self.shoot_paint_or_fb("01", "P", False, None)

        paint_pts_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath('div/p[3]').text.split(' ')[1]
        fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text
    
        self.assertEqual(int(fg_after), int(fg_before) + 1, "FG made")
        self.assertEqual(int(fa_after), int(fa_before) + 1, "FG attempted")
        self.assertEqual(int(tp_after), int(tp_before) + 2, "Total points")
        self.assertEqual(int(team_fg_after), int(team_fg_before) + 1, "Team FG made")
        self.assertEqual(int(team_fa_after), int(team_fa_before) + 1, "Team FG attempted")
        self.assertEqual(int(team_tp_after), int(team_tp_before) + 2, "Team Total points")
        ## PENDING BUG ##
        #self.assertEqual(int(paint_pts_after), int(paint_pts_before) + 2, "Team pts in paint")

        
    def test_fastbreak_fg(self):
        print("test_fastbreak_fg")
        fb_pts_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath('div/p[3]').text.split(' ')[7]
        fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text

        self.shoot_paint_or_fb("01", "F", False, None)

        fb_pts_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath('div/p[3]').text.split(' ')[7]
        fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text
    
        self.assertEqual(int(fg_after), int(fg_before) + 1, "FG made")
        self.assertEqual(int(fa_after), int(fa_before) + 1, "FG attempted")
        self.assertEqual(int(tp_after), int(tp_before) + 2, "Total points")
        self.assertEqual(int(team_fg_after), int(team_fg_before) + 1, "Team FG made")
        self.assertEqual(int(team_fa_after), int(team_fa_before) + 1, "Team FG attempted")
        self.assertEqual(int(team_tp_after), int(team_tp_before) + 2, "Team Total points")
        ## PENDING BUG ##
        #self.assertEqual(int(fb_pts_after), int(fb_pts_before) + 2, "Team fastbreak points")
       
       
    def test_fastbreak_fg_in_paint(self):
        print("test_fastbreak_fg_in_paint")
        
        paint_pts_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath('div/p[3]').text.split(' ')[1]
        fb_pts_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath('div/p[3]').text.split(' ')[7]
        fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text

        self.shoot_paint_or_fb("01", "Z", False, None)

        paint_pts_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath('div/p[3]').text.split(' ')[1]
        fb_pts_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath('div/p[3]').text.split(' ')[7]
        fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text
    
        self.assertEqual(int(fg_after), int(fg_before) + 1, "FG made")
        self.assertEqual(int(fa_after), int(fa_before) + 1, "FG attempted")
        self.assertEqual(int(tp_after), int(tp_before) + 2, "Total points")
        self.assertEqual(int(team_fg_after), int(team_fg_before) + 1, "Team FG made")
        self.assertEqual(int(team_fa_after), int(team_fa_before) + 1, "Team FG attempted")
        self.assertEqual(int(team_tp_after), int(team_tp_before) + 2, "Team Total points")
        ## PENDING BUG ##
        #self.assertEqual(int(fb_pts_after), int(fb_pts_before) + 2, "Team fastbreak points")
        #self.assertEqual(int(paint_pts_after), int(paint_pts_before) + 2, "Team pts in paint")
        
    ## Other tests make sure the scoring part works, now check assists
    def test_assist_on_fb_paint(self):
        print("test_assist_on_fb_paint")
        as_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.shoot_paint_or_fb("01", "Z", True, "02")
        as_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.assertEqual(int(as_after), int(as_before) + 1)
        
    ## Other tests make sure the scoring part works, now check assists
    def test_assist_on_fb(self):
        print("test_assist_on_fb")
        as_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.shoot_paint_or_fb("01", "F", True, "02")
        as_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.assertEqual(int(as_after), int(as_before) + 1)
        
    ## Other tests make sure the scoring part works, now check assists
    def test_assist_in_paint(self):
        print("test_assist_in_paint")
        as_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.shoot_paint_or_fb("01", "P", True, "02")
        as_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.assertEqual(int(as_after), int(as_before) + 1)
        
        
    def test_made_3pt(self):
        print("test_made_3pt")
        home_score_before = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").text.split(' ')[-1]
        fg3_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[6]").text
        fa3_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[7]").text
        fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg3_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[6]").text
        team_fa3_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[7]").text
        team_fg_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text

        self.shoot_3pt("J", "01", False, "02")

        home_score_after = __class__.driver.find_element_by_id("home").find_element_by_class_name("score").text.split(' ')[-1]
        fg3_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[6]").text
        fa3_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[7]").text
        fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[4]").text
        fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[14]").text
        team_fg3_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[6]").text
        team_fa3_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[7]").text
        team_fg_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[4]").text
        team_fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        team_tp_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[14]").text
    
        self.assertEqual(int(fg_after), int(fg_before) + 1, "FG made")
        self.assertEqual(int(fa_after), int(fa_before) + 1, "FG attempted")
        self.assertEqual(int(tp_after), int(tp_before) + 3, "Total points")
        self.assertEqual(int(fa3_after), int(fa3_before) + 1, "3p attempted")
        self.assertEqual(int(fg3_after), int(fg3_before) + 1, "3p made")
        self.assertEqual(int(team_fg_after), int(team_fg_before) + 1, "Team FG made")
        self.assertEqual(int(team_fa_after), int(team_fa_before) + 1, "Team FG attempted")
        self.assertEqual(int(team_tp_after), int(team_tp_before) + 3, "Team Total points (stats)")
        self.assertEqual(int(home_score_after), int(home_score_before) + 3, "Team Total points (scoreboard)")
        self.assertEqual(int(team_fg3_after), int(team_fg3_before) + 1, "Team 3p made")
        self.assertEqual(int(team_fa3_after), int(team_fa3_before) + 1, "Team 3p attempted")
        
    ##  Scoring tested elsewhere, now check assists 
    def test_made_3pt_with_assist(self):
        print("test_made_3pt_with_assist")
        as_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.shoot_3pt("J", "01", True, "02")
        as_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[3]/td[11]").text
        self.assertEqual(int(as_after), int(as_before) + 1)    
    
    ## PENDING BUG ##
    #def test_made_3pt_without_j(self):

    def test_def_rb_from_jumper(self):
        print("test_def_rb_from_jumper")
        self.home_on_offense() # Ensure home is on offense
        rb_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[10]").text
        team_rb_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[10]").text
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
       
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("R")
        self.rebound(False, False, False, "01")
        
        rb_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[10]").text
        team_rb_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[10]").text        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color2 = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
       
        self.assertNotEqual(visitor_color2, visitor_color)
        self.assertNotEqual(home_color2, home_color)
        self.assertEqual(visitor_color2, "red")
        self.assertEqual(int(rb_after), int(rb_before) + 1, "player rebounds")
        self.assertEqual(int(team_rb_after), int(team_rb_before) + 1, "team rebounds")
        
    def test_def_team_rb_from_jumper(self):
        print("test_def_team_rb_from_jumper")
        self.home_on_offense() # Ensure home is on offense
        team_rb_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[10]").text
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
       
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("R")
        self.rebound(False, True, False, "01")
        
        team_rb_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[10]").text        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color2 = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
       
        self.assertNotEqual(visitor_color2, visitor_color)
        self.assertNotEqual(home_color2, home_color)
        self.assertEqual(visitor_color2, "red")
        self.assertEqual(int(team_rb_after), int(team_rb_before) + 1, "team rebounds")
 
    def test_def_dead_ball_from_jumper(self):
        print("test_def_dead_ball_from_jumper")
        ## Check to ensure possession does not change after defensive dead ball 
        self.home_on_offense() # Ensure home is on offense
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("R")
        self.rebound(False, False, True, "01")
        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        
        self.assertEqual(home_color2, home_color, "Home team should have possession")
        self.assertEqual(home_color2, "red", "Home team should be red") 
          
    def test_off_rb_from_jumper(self):
        print("test_off_rb_from_jumper")
        self.home_on_offense() # Ensure home is on offense
        rb_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[10]").text
        team_rb_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[10]").text
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]        
 
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("R")
        self.rebound(True, False, False, "01")
        
        rb_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[10]").text
        team_rb_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[10]").text        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]

        self.assertEqual(home_color, home_color2)
        self.assertEqual(home_color2, "red")
        self.assertEqual(int(rb_after), int(rb_before) + 1, "player rebounds")
        self.assertEqual(int(team_rb_after), int(team_rb_before) + 1, "team rebounds")
        
    def test_off_team_rb_from_jumper(self):
        print("test_off_team_rb_from_jumper")
        self.home_on_offense() # Ensure home is on offense
        team_rb_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[10]").text
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]        
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("R")
        self.rebound(True, True, False, "01")
        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        team_rb_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[10]").text        
        
        self.assertEqual(home_color, home_color2)
        self.assertEqual(home_color2, "red")
        self.assertEqual(int(team_rb_after), int(team_rb_before) + 1, "team rebounds")
 
    def test_off_dead_ball_from_jumper(self):
        print("test_off_dead_ball_from_jumper")
        ## Check to ensure possession does not change after defensive dead ball 
        self.home_on_offense() # Ensure home is on offense
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("R")
        self.rebound(True, False, True, "01")
        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color2 = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        
        self.assertNotEqual(visitor_color2, visitor_color)
        self.assertEqual(visitor_color2, "red")
        self.assertNotEqual(home_color2, home_color, "Home team should have possession")
        self.assertNotEqual(home_color2, "red", "Home team should be red")
        
    def test_def_rb_from_3(self):
        print("test_def_rb_from_3")
        self.home_on_offense() # Ensure home is on offense
        rb_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[10]").text
        team_rb_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[10]").text
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
       
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("X")
        self.rebound(False, False, False, "01")
        
        rb_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[2]/td[10]").text
        team_rb_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[10]").text        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color2 = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
       
        self.assertNotEqual(visitor_color2, visitor_color)
        self.assertNotEqual(home_color2, home_color)
        self.assertEqual(visitor_color2, "red")
        self.assertEqual(int(rb_after), int(rb_before) + 1, "player rebounds")
        self.assertEqual(int(team_rb_after), int(team_rb_before) + 1, "team rebounds")
        
    def test_def_team_rb_from_3(self):
        print("test_def_team_rb_from_3")
        self.home_on_offense() # Ensure home is on offense
        team_rb_before = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[10]").text
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
       
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("X")
        self.rebound(False, True, False, "01")
        
        team_rb_after = __class__.driver.find_element_by_id("ps-visitor").find_element_by_xpath("table/tbody/tr[12]/td[10]").text        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color2 = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
       
        self.assertNotEqual(visitor_color2, visitor_color)
        self.assertNotEqual(home_color2, home_color)
        self.assertEqual(visitor_color2, "red")
        self.assertEqual(int(team_rb_after), int(team_rb_before) + 1, "team rebounds")
 
    def test_def_dead_ball_from_3(self):
        print("test_def_dead_ball_from_3")
        ## Check to ensure possession does not change after defensive dead ball 
        self.home_on_offense() # Ensure home is on offense
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("X")
        self.rebound(False, False, True, "01")
        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        
        self.assertEqual(home_color2, home_color, "Home team should have possession")
        self.assertEqual(home_color2, "red", "Home team should be red") 
    
    
    def test_off_rb_from_3(self):
        print("test_off_rb_from_3")
        self.home_on_offense() # Ensure home is on offense
        rb_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[10]").text
        team_rb_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[10]").text
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]        
 
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("X")
        self.rebound(True, False, False, "01")
        
        rb_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[10]").text
        team_rb_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[10]").text        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]

        self.assertEqual(home_color, home_color2)
        self.assertEqual(home_color2, "red")
        self.assertEqual(int(rb_after), int(rb_before) + 1, "player rebounds")
        self.assertEqual(int(team_rb_after), int(team_rb_before) + 1, "team rebounds")
        
    def test_off_team_rb_from_3(self):
        print("test_off_team_rb_from_3")
        self.home_on_offense() # Ensure home is on offense
        team_rb_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[10]").text
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]        
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("X")
        self.rebound(True, True, False, "01")
        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        team_rb_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[10]").text        
        
        self.assertEqual(home_color, home_color2)
        self.assertEqual(home_color2, "red")
        self.assertEqual(int(team_rb_after), int(team_rb_before) + 1, "team rebounds")
 
    def test_off_dead_ball_from_3(self):
        print("test_off_dead_ball_from_3")
        ## Check to ensure possession does not change after defensive dead ball 
        self.home_on_offense() # Ensure home is on offense
        home_color = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        ## Trigger a missed shot ##
        __class__.driver.find_element_by_id("userinput").send_keys("J")
        __class__.driver.find_element_by_id("userinput").send_keys("01")
        __class__.driver.find_element_by_id("userinput").send_keys("X")
        self.rebound(True, False, True, "01")
        
        home_color2 = __class__.driver.find_element_by_id("homescoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        visitor_color2 = __class__.driver.find_element_by_id("visitorscoreshowhide").get_attribute("style").split(';')[0].split(' ')[1]
        
        self.assertNotEqual(visitor_color2, visitor_color)
        self.assertEqual(visitor_color2, "red")
        self.assertNotEqual(home_color2, home_color, "Home team should have possession")
        self.assertNotEqual(home_color2, "red", "Home team should be red")
    
    def test_block_2(self):
        print("test_block_2")
        self.home_on_offense()
        blks_before = __class__.driver.find_element_by_id('ps-visitor').find_element_by_xpath('div/p[2]').text.split(' ')[4]
        fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        team_fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
       
        self.block("J", "01", "02")
        
        fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        team_fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        blks_after = __class__.driver.find_element_by_id('ps-visitor').find_element_by_xpath('div/p[2]').text.split(' ')[4]
        
        self.assertEqual(int(fa_after), int(fa_before) + 1)
        self.assertEqual(int(team_fa_after), int(team_fa_before) + 1)
        self.assertEqual(int(blks_after), int(blks_before) + 1)
    
    ## PENDING BUG ##
    # def test_block_3(self):
        # print("test_block_3")
        # self.home_on_offense()
        # blks_before = __class__.driver.find_element_by_id('ps-visitor').find_element_by_xpath('div/p[2]').text.split(' ')[4]
        # fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        # team_fa_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        # fa3_before = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[7]").text
        
        # self.block("Y", "01", "02")
        
        # fa3_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[7]").text
        # fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[2]/td[5]").text
        # team_fa_after = __class__.driver.find_element_by_id("ps-home").find_element_by_xpath("table/tbody/tr[12]/td[5]").text
        # blks_after = __class__.driver.find_element_by_id('ps-visitor').find_element_by_xpath('div/p[2]').text.split(' ')[4]
        
        # self.assertEqual(int(fa3_after), int(fa3_before) + 1)
        # self.assertEqual(int(fa_after), int(fa_before) + 1)
        # self.assertEqual(int(team_fa_after), int(team_fa_before) + 1)
        # self.assertEqual(int(blks_after), int(blks_before) + 1)
        
        
    ## PENDING BUGS ##
    #def test_rebound_from_block(self):
    #def test_dunk(self):
    #def test_layup(self):
    #def test_def_rb_from_layup(self):
    #def test_def_rb_from_dunk(self):
    #def test_block_dunk(self):
    #def test_block_layup(self):
    #def test_block_3noj(self):

        
if __name__ == '__main__':
    unittest.main()