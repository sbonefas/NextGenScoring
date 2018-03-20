from urllib.request import urlretrieve
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import random
from datetime import datetime, date

import unittest

def run_clock(sleep_time):
    ## Setup the website ##
    driver = webdriver.Firefox()
    ## Convert to CWD - configure to work on all PC's
    driver.get('file:///C:/Projects/NextGenScoring/index.html')

    ## Get the initial clock value
    initial_clock = driver.find_element_by_id("clockh2").text;

    # Send the SPACE key to start the clock, wait sleep_time seconds,
    # then send the SPACE key to stop the clock
    driver.find_element_by_id("clockh2").send_keys(Keys.SPACE);
    time.sleep(sleep_time + .50);
    driver.find_element_by_id("clockh2").send_keys(Keys.SPACE);

    # Get the clock value after execution
    clock = driver.find_element_by_id("clockh2").text;

    # Convert clock strings to datetime object for comparison
    initial_time = datetime.strptime(initial_clock, "%H:%M:%S").time()
    end_time = datetime.strptime(clock, "%H:%M:%S").time()

    # Get a clock duration from comparing the datetime objects
    duration = datetime.combine(date.min, initial_time) - datetime.combine(date.min, end_time)
    driver.quit()

    return duration
   
    
def test_seconds():
    sleep_time = random.randint(1, 59)
    duration = run_clock(sleep_time)
    
    # Verification that duration is expected value
    if (duration.seconds != sleep_time):
        print("TEST FAILED: EXPECTED DURATION OF %s, GOT %s", sleep_time, duration.seconds)
    else:
        print("AAAA GOT:%s, EXPECTED:%s", duration.seconds, sleep_time)


def test_minutes():
    sleep_time = random.randint(60,70)
    duration = run_clock(sleep_time)
    
    # Verification that duration is expected value
    if (duration.seconds != sleep_time):
        print("TEST FAILED: EXPECTED DURATION OF %s, GOT %s", sleep_time, duration.seconds)
    else:
        print("TEST PASSED EXPECTED:%s, GOT:%s", sleep_time, duration.seconds)        

def test_whole_clock():
    sleep_time = 1200
    duration = run_clock(sleep_time)
    
    # Verification that duration is expected value
    if (duration.seconds != sleep_time):
        print("TEST FAILED: EXPECTED DURATION OF %s, GOT %s", sleep_time, duration.seconds)
    else:
        print("TEST PASSED EXPECTED:%s, GOT:%s", sleep_time, duration.seconds)   
 
test_seconds()
test_minutes()
#test_whole_clock()