/*
  player-format:
        object: array[name: "Giannis", number: 34, position: "everything"]
*/
const electron = require("electron");
const ipc = electron.ipcRenderer;
const Team = require('./Team.js'); // Imports stuff from the Team.js backend file
const Player = require('./Player.js'); // Imports stuff from the Player.js backend file
/*
// Creating a new team (note: empty roster is created by the constructor, therefore is not passed as a parameter)
var team = new Team(name, code, coach, assistants, home_stadium, <team_roster>);

// Creating a new player
var player = new Player(name, number, position);

// Add a team to the backend
ipc.send('add-team', team_object);

// Delete a team from the backend
ipc.send('delete-team', team_code);

note:
    Need to add success and failure event handlers for adding and deleting a team
*/

function help() {
    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementById("closeModal");

    // show modal
    modal.style.display = "block";


    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // When the user hits ESC, close it
    document.onkeydown = function(e) {
        e = e || window.event;
        var isEscape = false;
        if ("key" in e) {
            isEscape = (e.key == "Escape" || e.key == "Esc");
        } else {
            isEscape = (e.keyCode == 27);
        }
        if (isEscape) {
            modal.style.display = "none";
        }
    }
}
/*
  on load event handler to fill the teams array
  by calling get_all_teams from the back-end
*/

var new_team = {};
var app = new Vue({
  el: '#team_app',
  data: {
    message: "SELECT A TEAM",
    teams: [
            {name: "WISCONSIN", team_code: "WISC", head_coach: "Greg Gard", assistants: "Howard Moore, Joe Krabbenhoft, Dean Oliver",  home_stadium: "Kohl Center", team_roster: []},
            {name: "MARQUETTE", team_code: "", head_coach: "", assistants: "", home_stadium: "", team_roster: []},
            {name: "MINNESOTA", team_code: "", head_coach: "", assistants: "",  home_stadium: "", team_roster: []},
            {name: "PURDUE", team_code: "", head_coach: "", assistants: "",  home_stadium: "", team_roster: []},
            {name: "MARYLAND", team_code: "", head_coach: "", assistants: "",  home_stadium: "", team_roster: []},
            {name: "NORTHWESTERN", team_code: "", head_coach: "", assistants: "",  home_stadium: "", team_roster: []},
            {name: "ILLINOIS", team_code: "", head_coach: "", assistants: "",  home_stadium: "", team_roster: []}
          ],
    roster_options: [
      {name: "<ENTER> - EDIT TEAM"},
      {name: "N - CREATE NEW TEAM"},
      {name: "F9 - DELETE TEAM"}
    ],
    teams_hold: [],
    selected_team: {},
    search_active: false,
    adding_team: false
  },
  created() {
   document.addEventListener('keydown', this.keyevent);
  },
  methods: {
    keyevent : function (e) {
      console.log(e.keyCode);
      // alt + h - Help menu
      if(e.altKey && e.keyCode == 72) {
          help();
      }

      // <Enter> --> Edit Team
      if(e.keyCode == 13 && app.adding_team == false) {
        app.edit_team();
      }
      // <N> --> Add New Team
      else if (e.keyCode == 78 && (document.getElementById('searched') != document.activeElement)) {
        app.add_new_team();
      }
      // <F9> --> Delete Team
      else if (e.keyCode == 120) {
        app.delete_team();
      }
      else if (e.keyCode == 8 && app.search_active == true)
      {
        document.getElementById('searched').value = "";
        app.reset_team_table();
      }
    },
    // If Enter is pressed (Runs search if no team selected)
    edit_team : function() {
      if(app.selected_team.name != undefined) {
        window.alert("Now editing "+app.selected_team.name);
        // See laptop for team edit screen
        // Might require loading from backend
      }
      else if(document.getElementById("searched") == document.activeElement){
        app.run_search();
      }
    },
    // If N is pressed
    add_new_team : function() {
      app.adding_team = true;
      // NEED TO REPLACE PROMPT
      //team_name = window.prompt("Enter a new team name").toUpperCase();
      /*
      if(new_team.name != "")
      {
        team.name = new_team.name;
        var is_existing = false;
        for(var index = 0; index < app.teams.length; index++)
        {
          if(app.teams[index].name == team.name)
          {
            is_existing = true;
          }
        }
        if(is_existing == true)
        {
          window.alert("ERROR TEAM ALREADY EXISTS");
        }
        else
        {
          if(app.search_active == true)
          {
            app.teams_hold.push(team);
          }
          else
          {
            app.teams.push(team);
          }
          // UPDATE BACKEND
        }
      }
      */
      var modal = document.getElementById('team_entry');
      // Get the <span> element that closes the modal
      //var span = document.getElementById("close_team_entry");

      // show modal
      modal.style.display = "block";

      // When the user clicks on <span> (x), close the modal
      /*
      span.onclick = function() {
          modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
      }
      */
      // When the user hits ESC, close it
      document.onkeydown = function(e) {
          e = e || window.event;
          var isEscape = false;
          if ("key" in e) {
              isEscape = (e.key == "Escape" || e.key == "Esc");
          } else {
              isEscape = (e.keyCode == 27);
          }
          if (isEscape) {
              modal.style.display = "none";
          }
        }
    },
    // If F9 is pressed
    delete_team : function() {
      if(app.selected_team.name != undefined) {
        if(window.confirm("DELETE TEAM: "+app.selected_team.name+"?"))
        {
          for(var index = 0; index < app.teams.length; index++)
          {
            if(app.teams[index].name == app.selected_team.name)
            {
              //UPDATE BACKEND HERE
              /*
              //Testing code to delete Nate's created test team
              // Create team object to send to the backend to delete
              var del_team = new Team("Badgers", "WIS", "Bo Ryan", "I Forgot", "Kohl Center");
              // Send the request to delete the team
              ipc.send('delete-team', del_team);
              */
              app.teams.splice(index, 1);
              app.selected_team = {};
              break;
            }
          }
        }
      }
      else {
        console.log("NO TEAM SELECTED");
        window.alert("ERROR NO TEAM SELECTED");
      }
    },
    // Runs a search based on user input
    run_search : function() {
      if(app.search_active)
      {
        app.reset_team_table();
      }
      console.log("RUNNING SEARCH");
      app.teams_hold = app.teams;
      var query_teams = [];
      app.teams.forEach(function(team) {
        if (team.name.includes(document.getElementById('searched').value.toUpperCase())) {
          query_teams.push(team);
          console.log(team.name + " was found during search");
        }
      });
      app.teams = query_teams;
      app.search_active = true;
    },
    // Registers which team is currently selected
    select_team : function(team) {
      console.log("Clicked "+team.name);
      app.selected_team = team;
      app.input_selected = false;
    },
    // Handles when enter is pressed and no team is selected
    deselect_team : function() {
      app.selected_team = {};
      app.input_selected = true;
    },
    // Resets the team table when a search is over
    reset_team_table : function() {
      app.teams = app.teams_hold;
      app.search_active = false;
    },
    // Submit new team data
    submit_team_data : function() {
      console.log("GOT HERE");
      var name = document.getElementsByName("team_name")[0].value;
      var code = document.getElementsByName("team_code")[0].value;
      var coach = document.getElementsByName("team_coach")[0].value;
      var assistants = document.getElementsByName("team_assistants")[0].value;
      var stadium = document.getElementsByName("team_stadium")[0].value;
      var roster = [];
      console.log('NAME: '+name+' CODE: '+code+' COACH: '+coach+' ASSISTANTS: '+assistants+' STADIUM: '+stadium);
      if(name != "" && code != "" && coach != "" && assistants != "" && stadium != "")
      {
         this.new_team = new Team(name, code, coach, assistants, stadium);
      }
      else {
        window.alert("NOTHING PASSED");
      }
    }
  }

})
