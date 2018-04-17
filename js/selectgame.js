const electron = require("electron");
const ipc = electron.ipcRenderer;

var curr_game = [];

window.onload = function(){
	let args = ["Wisconsin", "Ohio State", "796", "518", "100/0", "0/100", "3/12/19", "4pm", "Kohl Center", "H|V|N", "league", ["schedule notes"], "quarters", "15", "15", ["Official Names"], ["Box comments"], "attendance"];
}

ipc.on('get-game-success', function(event,args) {
	console.log("get-game-success");
	curr_game = args;
});

ipc.on('get-game-failure', function(event,args) {
	console.log("get-game-failure");
	window.alert("ERROR: GAME DOESN'T EXIST");
});

ipc.on('init-game-success', function(event,args) {
	console.log("init-game-success");
	curr_game = args;
	app.games = curr_game;
	window.location = "./index.html"
});

ipc.on('init-game-failure', function(event,args) {
	console.log("init-game-failure");
	window.alert("ERROR: GAME ALREADY EXISTS");
});


var app = new Vue({
  el: '#selectapp',
  data: {
    message: "SELECT A GAME",
    games: [
            {date: "2018-04-12", time: "17:00", site: "Madison, WI", site_code: 0, league: 1, schedule_note: "On time",
            quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"},
            {date: "2018-04-13", time: "18:00", site: "Greg Gard", site_code: 1, league: 0, schedule_note: "On time",
            quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"},
            {date: "2018-04-14", time: "19:00", site: "Greg Gard", site_code: 2, league: 0, schedule_note: "On time",
            quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"}
          ],
    game_options: [
      {name: "<ENTER> - EDIT GAME"},
      {name: "N - CREATE NEW GAME"},
      {name: "F9 - DELETE GAME"}
    ],
    games_hold: [],
    selected_game: {},
    search_active: false,
    making_new_game: false
  },
  created() {
   document.addEventListener('keydown', this.keyevent);
  },
  methods: {
    keyevent(e) {
      console.log(e.keyCode);

      // <Enter> --> Edit game
      if(e.keyCode == 13) {
        app.edit_game();
      }
      // <N> --> Add New game
//      else if (e.keyCode == 78 && (document.getElementById('searched') != document.activeElement)) {
//        app.add_new_game();
//      }
      // <F9> --> Delete game
      else if (e.keyCode == 120) {
        app.delete_game();
      }
      else if (e.keyCode == 8 && app.search_active == true)
      {
        document.getElementById('searched').value = "";
        app.reset_game_table();
      }
    },
    // If Enter is pressed (Runs search if no game selected)
    edit_game() {
      if(app.selected_game.date != undefined) {
        // See laptop for game edit screen
        // Might require loading from backend

        making_new_game = false;

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

        document.getElementsByName("game_date")[0].value = app.selected_game.date;
        document.getElementsByName("game_time")[0].value = app.selected_game.time;
        document.getElementsByName("game_site")[0].value = app.selected_game.site;
        document.getElementById("select_site").selectedIndex = 1;//0 = home, 1 = away, 2 = neutral
        document.getElementById("select_league").selectedIndex = 1;//0 = Yes, 1 = No
        document.getElementsByName("sched_note")[0].value = app.selected_game.schedule_note;
        document.getElementById("select_halves").selectedIndex = 1;//0 = halves, 1 = quarters
        document.getElementsByName("min_period")[0].value = app.selected_game.min_period;
        document.getElementsByName("min_ot")[0].value = app.selected_game.min_ot;
        document.getElementsByName("vis_code")[0].value = app.selected_game.vis_team;
        document.getElementsByName("home_code")[0].value = app.selected_game.home_team;
        document.getElementsByName("vis_record")[0].value = app.selected_game.vis_record;
        document.getElementsByName("home_record")[0].value = app.selected_game.home_record;
        document.getElementsByName("officials")[0].value = app.selected_game.officials;
        document.getElementsByName("atten")[0].value = app.selected_game.attendance;
        document.getElementsByName("Text1")[0].value = app.selected_game.comments;
      }
      else {
        app.run_search();
      }
    },
    // If N is pressed
    add_new_game() {
        making_new_game = true;
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

        document.getElementsByName("game_date")[0].value = "";
        document.getElementsByName("game_time")[0].value = "";
        document.getElementsByName("game_site")[0].value = "";
        document.getElementById("select_site").selectedIndex = 0;//0 = home, 1 = away, 2 = neutral
        document.getElementById("select_league").selectedIndex = 0;//0 = Yes, 1 = No
        document.getElementsByName("sched_note")[0].value = "";
        document.getElementById("select_halves").selectedIndex = 0;//0 = halves, 1 = quarters
        document.getElementsByName("min_period")[0].value = "";
        document.getElementsByName("min_ot")[0].value = "";
        document.getElementsByName("vis_code")[0].value = "";
        document.getElementsByName("home_code")[0].value = "";
        document.getElementsByName("vis_record")[0].value = "";
        document.getElementsByName("home_record")[0].value = "";
        document.getElementsByName("officials")[0].value = "";
        document.getElementsByName("atten")[0].value = "";
        document.getElementsByName("Text1")[0].value = "";
    },
    submit() {
        var is_existing = false;
        if(making_new_game) {
            curr_game = []
            //add code for team names
            curr_game.push("Wisconsin")
            curr_game.push("Ohio State")

            home_code = document.getElementsByName("home_code")[0].value;
            if(home_code != "") {
                curr_game.push(home_code)
            }

            vis_code = document.getElementsByName("vis_code")[0].value;
            if(vis_code != "") {
                curr_game.push(vis_code)
            }

            home_record = document.getElementsByName("home_record")[0].value;
            if(home_record != "") {
                curr_game.push(home_record)
            }

            vis_record = document.getElementsByName("vis_record")[0].value;
            if(vis_record != "") {
                curr_game.push(vis_record)
            }

            game_date = document.getElementsByName("game_date")[0].value;
            if(game_date != "") {
                curr_game.push(game_date)
            }

            game_time = document.getElementsByName("game_time")[0].value;
            if(game_time != "") {
                curr_game.push(game_time)
            }

            game_site = document.getElementsByName("game_site")[0].value;
            if(game_site != "") {
                curr_game.push(game_site)
            }

            select_site = document.getElementById("select_site").selectedIndex;//0 = home, 1 = away, 2 = neutral
            curr_game.push(select_site)

            league = document.getElementById("select_league").selectedIndex;//0 = Yes, 1 = No
            curr_game.push(league)

            sched_note_array = []
            sched_note = document.getElementsByName("sched_note")[0].value;
            sched_note_array.push(sched_note)
            if(sched_note != "") {
                curr_game.push(sched_note_array)
            }

            halves = document.getElementById("select_halves").selectedIndex;//0 = halves, 1 = quarters
            curr_game.push(halves)

            min_period = document.getElementsByName("min_period")[0].value;
            if(min_period != "") {
                curr_game.push(min_period)
            }

            min_ot = document.getElementsByName("min_ot")[0].value;
            if(min_ot != "") {
                curr_game.push(min_ot)
            }

            officials_array = []
            officials = document.getElementsByName("officials")[0].value;
            officials_array.push(officials)
            if(officials != "") {
                curr_game.push(officials_array)
            }

            comments_array = []
            comments = document.getElementsByName("Text1")[0].value;
            comments_array.push(comments)
            if(comments != "") {
                curr_game.push(comments_array)
            }

            atten = document.getElementsByName("atten")[0].value;
            if(atten != "") {
                curr_game.push(atten)
            }

            if(curr_game.length == 18) {
                console.log(curr_game)
                ipc.send("init-game", curr_game)
            }
        }
        else {
            window.location = "./index.html";
        }
          // UPDATE BACKEND

    },
    // If F9 is pressed
    delete_game() {
      if(app.selected_game.date != undefined) {
        if(window.confirm("DELETE GAME: "+ app.selected_game.date + " at " + app.selected_game.time + "?"))
        {
          for(var index = 0; index < app.games.length; index++)
          {
            if(app.games[index].date == app.selected_game.date)
            {
              app.games.splice(index, 1);
              //UPDATE BACKEND HERE
							app.selected_game = {};
              break;
            }
          }
        }
      }
      else {
        console.log("NO GAME SELECTED");
        window.alert("ERROR NO GAME SELECTED");
      }
    },
    // Runs a search based on user input
    run_search() {
      if(app.search_active)
      {
        app.reset_game_table();
      }
      console.log("RUNNING SEARCH");
      app.games_hold = app.games;
      var query_games = [];
      app.games.forEach(function(game) {
        if (game.date.includes(document.getElementById('searched').value.toUpperCase())) {
          query_games.push(game);
          console.log(game.date + " was found during search");
        }
      });
      app.games = query_games;
      app.search_active = true;
    },
    // Registers which game is currently selected
    select_game(game) {
      console.log("Clicked " + game.date);
      app.selected_game = game;
      app.input_selected = false;
    },
    // Handles when enter is pressed and no game is selected
    deselect_game() {
      app.selected_game = {};
      app.input_selected = true;
    },
    // Resets the game table when a search is over
    reset_game_table() {
      app.games = app.games_hold;
      app.search_active = false;
    }
//    // Sets game date when entered in
//    set_game_date(entered_date) {
//      this.new_game = {date: "2018-04-19", time: "17:00", site: "Greg Gard", site_code: "Home", league: true, schedule_note: "On time",
//                      quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
//                      officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"};
//      return game;
//    }
  }

})
