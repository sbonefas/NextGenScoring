var app = new Vue({
  el: '#selectapp',
  data: {
    message: "SELECT A GAME",
    games: [
            {home_name: "Wisconsin", vis_name: "Ohio State", date: "2018-04-12", time: "17:00", site: "Madison, WI", site_code: 0, league: 1, schedule_note: "On time",
            quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"},
            {home_name: "Wisconsin", vis_name: "Ohio State", date: "2018-04-13", time: "18:00", site: "Greg Gard", site_code: 1, league: 0, schedule_note: "On time",
            quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"},
            {home_name: "Wisconsin", vis_name: "Ohio State", date: "2018-04-14", time: "19:00", site: "Greg Gard", site_code: 2, league: 0, schedule_note: "On time",
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

        document.getElementsByName("home_name")[0].value = app.selected_game.home_name;
        document.getElementsByName("vis_name")[0].value = app.selected_game.vis_name;
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
        game_date = document.getElementsByName("game_date")[0].value;
        game_time = document.getElementsByName("game_time")[0].value;
        console.log(game_date);
        console.log(game_time);
        var is_existing = false;
        if(making_new_game) {
            for(index = 0; index < app.games.length; index++)
            {
              if(app.games[index].date == game_date)
              {
                console.log(app.games[index].date);
                if(app.games[index].time == game_time) {
                    console.log(app.games[index].date);
                    is_existing = true;
                }
              }
            }
            if(is_existing == true)
            {
                window.alert("ERROR GAME ALREADY EXISTS");
            }
            else
            {
              if(app.search_active == true)
              {
                app.games_hold.push(game);

              }
              else
              {
                app.games.push(game);
                window.location = "./index.html";
              }
            }
        }
        else {
            window.location = "./index.html";
        }
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
