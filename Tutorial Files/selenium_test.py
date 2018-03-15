from urllib.request import urlretrieve
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Firefox()
driver.get("http://localhost:8080/#/")

driver.find_element_by_name("skill").send_keys('F');
