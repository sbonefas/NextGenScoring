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

var app = new Vue({
  el: '#team_app',
  data: {
    message: "SELECT A TEAM",
    teams: [
            {name: "WISCONSIN"},
            {name: "MARQUETTE"},
            {name: "MINNESOTA"},
            {name: "PURDUE"},
            {name: "MARYLAND"},
            {name: "NORTHWESTERN"},
            {name: "ILLINOIS"}
          ],
    roster_options: [
      {name: "<ENTER> - EDIT TEAM"},
      {name: "N - CREATE NEW TEAM"},
      {name: "F9 - DELETE TEAM"}
    ],
    teams_hold: [],
    selected_team: {},
    search_active: false
  },
  created() {
   document.addEventListener('keydown', this.keyevent);
  },
  methods: {
    keyevent : function (e) {
      console.log(e.keyCode);
      // <Enter> --> Edit Team
      if(e.keyCode == 13) {
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
      else {
        app.run_search();
      }
    },
    // If N is pressed
    add_new_team : function() {
      team = {name: ""}
      // NEED TO REPLACE PROMPT
      team_name = window.prompt("Enter a new team name").toUpperCase();
      if(team_name != "")
      {
        team.name = team_name;
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
    },
    // If F9 is pressed
    delete_team : function() {
      if(app.selected_team.name != undefined) {
        var confirm_delete = window.confirm("DELETE TEAM: "+app.selected_team.name+"?");
        if(confirm_delete)
        {
          for(var index = 0; index < app.teams.length; index++)
          {
            if(app.teams[index].name == app.selected_team.name)
            {
              app.teams.splice(index, 1);
              //UPDATE BACKEND HERE
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
    }
  }

})
