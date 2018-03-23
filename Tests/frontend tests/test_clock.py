from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import os
import random
from datetime import datetime, date
import unittest

def configure_index():
    cwd = os.getcwd()
    path = os.path.abspath(os.path.join(cwd, os.pardir))
    path2 = os.path.abspath(os.path.join(path, os.pardir))  
    index_path = 'file:///' + path2 + '/index.html'
    return index_path.replace("\\", '/')

def run_clock(sleep_time, driver):

    ## Get the initial clock value
    initial_clock = driver.find_element_by_id("clockminutes").text + ":" + driver.find_element_by_id('clockseconds').text
    
    # Send the SPACE key to start the clock, wait sleep_time seconds,
    # then send the SPACE key to stop the clock
    driver.find_element_by_id("clockminutes").send_keys(Keys.SPACE);
    
    wait = True
    tic = time.clock()
    while(wait):
        toc = time.clock()
        time.sleep(.25)
        # Get the countdown clock value
        end_clock = driver.find_element_by_id("clockminutes").text + ":" + driver.find_element_by_id('clockseconds').text

        # Convert clock strings to datetime object for comparison
        initial_time = datetime.strptime(initial_clock, "%M:%S").time()
        end_time = datetime.strptime(end_clock, "%M:%S").time()
        # Get a clock duration from comparing the datetime objects
        duration = datetime.combine(date.min, initial_time) - datetime.combine(date.min, end_time)
        
        if (duration.seconds == sleep_time):
            driver.find_element_by_id("clockminutes").send_keys(Keys.SPACE)
            wait = False
    
    #print(toc - tic, sleep_time, duration.seconds)

    return duration
    
    
    
class TestClock(unittest.TestCase):
    driver = None
    
    @classmethod
    def setUpClass(cls):
        pass
        
    def setUp(cls):
        ## Setup the website ##
        __class__.driver = webdriver.Firefox()
        path = configure_index()
        __class__.driver.get(path)
        
    def tearDown(self):
         __class__.driver.quit()
         
    def test_seconds(self):
        sleep_time = random.randint(1, 59)
        duration = run_clock(sleep_time, __class__.driver)
        
        self.assertEqual(sleep_time, duration.seconds)


    def test_minutes(self):
        sleep_time = random.randint(60, 70)
        duration = run_clock(sleep_time, __class__.driver)
        
        self.assertEqual(sleep_time, duration.seconds)      

        
    def test_whole_clock(self):
        sleep_time = 1200
        duration = run_clock(sleep_time, __class__.driver)
        
        # Verification that duration is expected value
        self.assertEqual(sleep_time, duration.seconds)
 
if __name__ == '__main__':
    unittest.main()
    