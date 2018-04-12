var app = new Vue({
  el: '#selectapp',
  data: {
    message: "SELECT A GAME",
    games: [
            {date: "April 12, 2018", time: "12:00pm", site: "Madison, WI", site_code: "Home", league: true, schedule_note: "On time",
            quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"},
            {date: "April 13, 2018", time: "12:00pm", site: "Greg Gard", site_code: "Home", league: true, schedule_note: "On time",
            quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"},
            {date: "April 14, 2018", time: "12:00pm", site: "Greg Gard", site_code: "Home", league: true, schedule_note: "On time",
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
    search_active: false
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
      else if (e.keyCode == 78 && (document.getElementById('searched') != document.activeElement)) {
        app.add_new_game();
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
        window.alert("Now editing "+app.selected_game.date);
        // See laptop for game edit screen
        // Might require loading from backend
      }
      else {
        app.run_search();
      }
    },
    // If N is pressed
    add_new_game() {
      // NEED TO REPLACE PROMPT
      game_date = window.prompt("Enter a new game date").toUpperCase();
//      document.getElementById("game_date_entry").showModal();

      if(game_date != "")
      {
      window.location = "./index.html";
        game.date = game_date;
        var is_existing = false;
        for(var index = 0; index < app.games.length; index++)
        {
          if(app.games[index].date == game.date)
          {
            is_existing = true;
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
          }

          // UPDATE BACKEND
        }
      }
    },
    // If F9 is pressed
    delete_game() {
      if(app.selected_game.date != undefined) {
        if(window.confirm("DELETE GAME: "+app.selected_game.date+"?"))
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
    },
    // Sets game date when entered in
    set_game_date(entered_date) {
      this.new_game = {date: "April 12, 2018", time: "12:00pm", site: "Greg Gard", site_code: "Home", league: true, schedule_note: "On time",
                      quarters: true, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
                      officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"};
      return game;
    }
  }

})
