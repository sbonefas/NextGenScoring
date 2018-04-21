from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
import unittest
import os
import time

def configure_index():
    cwd = os.getcwd()
    index_path = 'file:///' + cwd + '/'
    return index_path.replace("\\", '/')
        
    
class TestShotCodes2(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        __class__.driver = webdriver.Firefox()
		
    @classmethod
    def tearDownClass(cls):
	    __class__.driver.quit()

    def setUp(self):
        pass

    def setUpLogin(self):
        __class__.driver.get(configure_index() + "login.html")
        
    def setUpOptions(self):
        __class__.driver.get(configure_index() + "options.html")
    
    def setUpHelp(self):
        __class__.driver.get(configure_index() + "help.html")  
       
    def setUpMenu(self):
        __class__.driver.get(configure_index() + "mainmenu.html") 
	
    def tearDown(self):
        pass
        
    def test_login(self):
        print("test_login")
        self.setUpLogin()
        menu_text = __class__.driver.find_element_by_id("menu").find_element_by_xpath('p').text
        self.assertEqual(menu_text, "Please enter the password to access this site.")
        
        __class__.driver.find_element_by_id("pswrd").send_keys("123")
        submit = __class__.driver.find_element_by_class_name("inputcss").find_element_by_xpath("//button[contains(text(),'Submit')]")
        submit.click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "mainmenu.html", "Should navigate to menu page")
        
    def test_forgot_pword(self):
        print("test_forgot_pword")
        self.setUpLogin()
        __class__.driver.find_element_by_class_name("inputcss").find_element_by_xpath("//button[contains(text(),'Forgot Password')]").click()
        errmsg = __class__.driver.find_element_by_id("forgot").text
        self.assertEqual(errmsg, "Contact UW Athletic Department for access to NextGen Scoring", "Forgot password msg")
        
    def test_incorrect_pword(self):
        print("test_incorrect_pword")
        self.setUpLogin()
        __class__.driver.find_element_by_id("pswrd").send_keys("321")
        __class__.driver.find_element_by_class_name("inputcss").find_element_by_xpath("//button[contains(text(),'Submit')]").click()
        errmsg = __class__.driver.find_element_by_id("errormsg").text
        self.assertEqual(errmsg, "Invalid password, please try again", "Wrong password msg")
        
        __class__.driver.find_element_by_id("pswrd").send_keys(Keys.BACKSPACE)
        __class__.driver.find_element_by_id("pswrd").send_keys(Keys.BACKSPACE)
        __class__.driver.find_element_by_id("pswrd").send_keys(Keys.BACKSPACE)
        
        
    def test_menu_logout_with_q(self):
        print("test_menu_logout_with_q")
        self.setUpMenu()
        __class__.driver.find_element_by_id("mainmenu").send_keys("Q")
        text = Alert(__class__.driver).text
        self.assertEqual(text, "Are you sure you want to logout?", "logout warning")
        Alert(__class__.driver).accept()
        time.sleep(2)
        self.assertEqual(__class__.driver.current_url, configure_index() + "login.html", "Should navigate to login page")
        

    def test_menu_logout_with_click(self):
        print("test_menu_logout_with_click")
        self.setUpMenu()
        __class__.driver.find_element_by_class_name("menutext").find_element_by_xpath("a[5]").click()
        text = Alert(__class__.driver).text
        self.assertEqual(text, "Are you sure you want to logout?", "logout warning")
        Alert(__class__.driver).accept()
        time.sleep(1)
        self.assertEqual(__class__.driver.current_url, configure_index() + "login.html", "Should navigate to login page")    

          
    def test_menu_help_with_h(self):
        print("test_menu_help_with_h")
        self.setUpMenu()
        __class__.driver.find_element_by_id("mainmenu").send_keys("H")
        time.sleep(1)
        self.assertEqual(__class__.driver.current_url, configure_index() + "help.html", "Should navigate to help page")
        
        
    def test_menu_help_with_click(self):
        print("test_menu_help_with_click")        
        self.setUpMenu()
        __class__.driver.find_element_by_class_name("menutext").find_element_by_xpath("a[4]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "help.html", "Should navigate to help page")  

    def test_help_transitions(self):
        print("test_help_transitions")
        self.setUpHelp()
        __class__.driver.find_element_by_class_name("helptext").find_element_by_xpath("a[1]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "teams.html", "Should navigate to teams page")

        self.setUpHelp()
        __class__.driver.find_element_by_class_name("helptext").find_element_by_xpath("a[2]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "index.html", "Should navigate to scoring page")  

        self.setUpHelp()
        __class__.driver.find_element_by_class_name("helptext").find_element_by_xpath("a[3]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "options.html", "Should navigate to options page")          

    def test_menu_options_with_o(self):
        print("test_menu_options_with_o")
        self.setUpMenu()
        __class__.driver.find_element_by_id("mainmenu").send_keys("O")
        time.sleep(1)
        self.assertEqual(__class__.driver.current_url, configure_index() + "options.html", "Should navigate to options page")
                
    def test_menu_options_with_click(self):
        print("test_menu_options_with_click")
        self.setUpMenu()
        __class__.driver.find_element_by_class_name("menutext").find_element_by_xpath("a[3]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "options.html", "Should navigate to options page") 
  
    def test_menu_scoring_with_g(self):
        print("test_menu_scoring_with_g")
        self.setUpMenu()
        __class__.driver.find_element_by_id("mainmenu").send_keys("G")
        time.sleep(1)
        self.assertEqual(__class__.driver.current_url, configure_index() + "selectgame.html", "Should navigate to game select page")
               
    def test_menu_scoring_with_click(self):
        print("test_menu_scoring_with_click")        
        self.setUpMenu()
        __class__.driver.find_element_by_class_name("menutext").find_element_by_xpath("a[2]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "selectgame.html", "Should navigate to game select page")   
        
    def test_menu_teams_with_t(self):
        print("test_menu_teams_with_t")
        self.setUpMenu()
        __class__.driver.find_element_by_id("mainmenu").send_keys("T")
        time.sleep(1)
        self.assertEqual(__class__.driver.current_url, configure_index() + "teams.html", "Should navigate to teams page")
                
    def test_menu_teams_with_click(self):
        print("test_menu_teams_with_click")        
        self.setUpMenu()
        __class__.driver.find_element_by_class_name("menutext").find_element_by_xpath("a[1]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "teams.html", "Should navigate to teams page")   

    def test_options(self):
        print("test_options")
        self.setUpOptions()
        __class__.driver.find_element_by_id("userinput").send_keys(Keys.CONTROL + "A")
        __class__.driver.find_element_by_id("userinput").send_keys("home")
        input_val = __class__.driver.find_element_by_id("userinput").get_attribute('value')
        self.assertEqual(input_val, "home")
        
        __class__.driver.find_element_by_class_name("optionstext").find_element_by_xpath("a[1]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "selectgame.html", "Should navigate to game select page") 
    
        self.setUpOptions()
        __class__.driver.find_element_by_class_name("switch").click()
        __class__.driver.find_element_by_class_name("switch").click()
        ## SWITCH IS ABLE TO BE CLICKED AND SWITCHES FROM ON/OFF PROPERLY, NO WAY TO AUTOMATE TESTING HERE
        
        years = __class__.driver.find_element_by_class_name("optionstext").find_elements_by_xpath("p[3]/select/option")        
        for year in years:
            if year.get_attribute('value') == '2019':
                year.click()
                
        active_year = __class__.driver.find_element_by_class_name("optionstext").find_element_by_xpath("p[3]/select").get_attribute('value') 
        self.assertEqual(active_year, '2019', "Choosing active year")

        __class__.driver.find_element_by_class_name("optionstext").find_element_by_xpath("a[2]").click()
        self.assertEqual(__class__.driver.current_url, configure_index() + "mainmenu.html", "Should navigate to menu") 

        
if __name__ == '__main__':
    unittest.main()