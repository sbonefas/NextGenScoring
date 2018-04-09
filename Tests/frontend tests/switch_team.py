class SwitchTeam:
    def __init__(self, init_team="H"):
        if init_team != "H" and init_team != "V":
            raise ValueError

        self.curr_team = init_team
	
    def switch_to_home(self): 
        self.curr_team = "H"
	
    def switch_to_visitor(self):
        self.curr_team = "V"