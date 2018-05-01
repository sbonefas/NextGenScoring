const electron = require("electron");
const ipc = electron.ipcRenderer;
const DRW = require('./data_read_write.js'); // Imports stuff from the team_read_write.js backend file

var curr_game = [];

window.onload = function(){
//	let args = ["Wisconsin", "Ohio State", "796", "518", "100/0", "0/100", "3/12/19", "4pm", "Kohl Center", "H|V|N", "league", ["schedule notes"], "quarters", "15", "15", ["Official Names"], ["Box comments"], "attendance"];

    //LOAD GAMES FROM BACKEND
    ipc.send("get-all-games");
}

ipc.on('get-all-games-failure', function(event) {
	console.log("get-all-games-failure");
	window.alert("ERROR: CANNOT LOAD GAMES");
});

ipc.on('get-all-games-success', function(event, gameArray) {
    console.log("get-all-games-success");

	for(i = 0; i < gameArray.length; i++) {
        console.log(i)
        app.games.push(
        {home_name: "", vis_name: "", date: "", time: "", site: "", site_code: 0, league: 0, schedule_note: "",
        quarters: 0, min_period: "", min_ot: "", vis_team: "", home_team: "", vis_record: "", home_record: "",
        officials: [], attendance: "", comments: ""}
        );
        app.games[app.games.length-1].home_name = gameArray[i][gameArray[i].length-1][0]
        app.games[app.games.length-1].vis_name = gameArray[i][gameArray[i].length-1][1]
        app.games[app.games.length-1].home_code = gameArray[i][gameArray[i].length-1][2]
        app.games[app.games.length-1].vis_code = gameArray[i][gameArray[i].length-1][3]
        app.games[app.games.length-1].home_record = gameArray[i][gameArray[i].length-1][4]
        app.games[app.games.length-1].vis_record = gameArray[i][gameArray[i].length-1][5]
        app.games[app.games.length-1].date = gameArray[i][gameArray[i].length-1][6]
        app.games[app.games.length-1].time = gameArray[i][gameArray[i].length-1][7]
        app.games[app.games.length-1].site = gameArray[i][gameArray[i].length-1][8]
        app.games[app.games.length-1].site_code = gameArray[i][gameArray[i].length-1][9]
        app.games[app.games.length-1].league = gameArray[i][gameArray[i].length-1][10]
        app.games[app.games.length-1].schedule_note = gameArray[i][gameArray[i].length-1][11]
        app.games[app.games.length-1].quarters = gameArray[i][gameArray[i].length-1][12]
        app.games[app.games.length-1].min_period = gameArray[i][gameArray[i].length-1][13]
        app.games[app.games.length-1].min_ot = gameArray[i][gameArray[i].length-1][14]
        app.games[app.games.length-1].officials = gameArray[i][gameArray[i].length-1][15]
        app.games[app.games.length-1].comments = gameArray[i][gameArray[i].length-1][16]
        app.games[app.games.length-1].attendance = gameArray[i][gameArray[i].length-1][17]
//        console.log("games: " + app.games[app.games.length-1])
	}
});

ipc.on('get-game-success', function(event,args) {
	console.log("get-game-success: " + args);

	for(i = 0; i < app.games.length; i++) {
	    if(app.games[i].date == args[6] && app.games[i].time == args[7]) {
	        console.log(app.games[i])
	        app.selected_game = app.games[i];
	    }
	}
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

    full_time = app.selected_game.time + ":00"

    document.getElementsByName("home_name")[0].value = app.selected_game.home_name;
    document.getElementsByName("vis_name")[0].value = app.selected_game.vis_name;
    document.getElementsByName("game_date")[0].value = app.selected_game.date;
    document.getElementsByName("game_time")[0].value = full_time;
    document.getElementsByName("game_site")[0].value = app.selected_game.site;
    document.getElementById("select_site").selectedIndex = app.selected_game.site_code;//0 = home, 1 = away, 2 = neutral
    document.getElementById("select_league").selectedIndex = app.selected_game.league;//0 = Yes, 1 = No
    document.getElementsByName("sched_note")[0].value = app.selected_game.schedule_note;
    document.getElementById("select_halves").selectedIndex = app.selected_game.quarters;//0 = halves, 1 = quarters
    document.getElementsByName("min_period")[0].value = app.selected_game.min_period;
    document.getElementsByName("min_ot")[0].value = app.selected_game.min_ot;
    document.getElementsByName("vis_code")[0].value = app.selected_game.vis_code;
    document.getElementsByName("home_code")[0].value = app.selected_game.home_code;
    document.getElementsByName("vis_record")[0].value = app.selected_game.vis_record;
    document.getElementsByName("home_record")[0].value = app.selected_game.home_record;
    document.getElementsByName("officials")[0].value = app.selected_game.officials;
    document.getElementsByName("atten")[0].value = app.selected_game.attendance;
    document.getElementsByName("Text1")[0].value = app.selected_game.comments;
});

ipc.on('get-game-failure', function(event,game_name) {
    get_game_fail = true;
	console.log("get-game-failure: " + game_name + " " +get_game_fail);
	window.alert("ERROR: GAME DOESN'T EXIST");
});

ipc.on('init-game-success', function(event,args) {
	console.log("init-game-success: " + args);
	curr_game = args;
	console.log("game: " + curr_game + "date: " + curr_game.date + "time: " + curr_game.time)
	localStorage.setItem("homeName",args[0]);
	localStorage.setItem("visName",args[1]);
	localStorage.setItem("gameDate",args[6]);
	localStorage.setItem("gameTime",args[7]);
	window.location = "./index.html"
});

ipc.on('init-game-failure', function(event,args) {
	console.log("init-game-failure: " + args);
	window.alert("ERROR: GAME ALREADY EXISTS");
	curr_game = [];
});


var app = new Vue({
  el: '#selectapp',
  data: {
    message: "SELECT A GAME",
    games: [
//            {home_name: "Wisconsin", vis_name: "Ohio State", date: "2018-04-12", time: "17:00", site: "Madison, WI", site_code: 0, league: 1, schedule_note: "On time",
//            quarters: 1, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
//            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"},
//            {home_name: "Wisconsin", vis_name: "Ohio State", date: "2018-04-13", time: "18:00", site: "Greg Gard", site_code: 1, league: 0, schedule_note: "On time",
//            quarters: 0, min_period: 20, min_ot: 5, vis_team: "MINN", home_team: "WISC", vis_record: "0-1", home_record: "1-0",
//            officials: ["ref1", "ref2", "ref3"], attendance: 20000, comments: "comments"},
          ],
    game_options: [
      {name: "<ENTER> - EDIT GAME"},
      {name: "CREATE NEW GAME"},
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

        date_time = app.selected_game.date + "_" + app.selected_game.time.split(/:/)[0];
//            console.log(app.selected_game.time.split(/:/)[0])
        //UNCOMMENT TO TEST GET-GAME
//		date_time = "3-12-19_4pm"
        console.log(date_time)
        ipc.send("get-game", date_time)
      }
      else {
        app.run_search();
      }
    },
    // If N is pressed
    add_new_game() {
        making_new_game = true;

        app.games.push(
        {home_name: "", vis_name: "", date: "", time: "", site: "", site_code: 0, league: 0, schedule_note: "",
        quarters: 0, min_period: "", min_ot: "", vis_team: "", home_team: "", vis_record: "", home_record: "",
        officials: [], attendance: "", comments: ""}
        );

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

        document.getElementsByName("home_name")[0].value = "";
        document.getElementsByName("vis_name")[0].value = "";
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
        curr_game = []

        home_name = document.getElementsByName("home_name")[0].value;
        if(home_name != "") {
            curr_game.push(home_name)
        }

        vis_name = document.getElementsByName("vis_name")[0].value;
        if(vis_name != "") {
            curr_game.push(vis_name)
        }

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

        game_time = document.getElementsByName("game_time")[0].value.split(/:/)[0];
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

        // UNCOMMENT TO TEST INIT-GAME-FAILURE
//            curr_game = ["Wisconsin", "Ohio State", "796", "518", "100/0", "0/100", "3/12/19", "4pm", "Kohl Center", "H|V|N", "league", ["schedule notes"], "quarters", "15", "15", ["Official Names"], ["Box comments"], "attendance"];

        if(curr_game.length == 18) {
            console.log(curr_game)
            if(making_new_game) {
                app.games[app.games.length-1].home_name = home_name
                app.games[app.games.length-1].vis_name = vis_name
                app.games[app.games.length-1].home_code = home_code
                app.games[app.games.length-1].vis_code = vis_code
                app.games[app.games.length-1].home_record = home_record
                app.games[app.games.length-1].vis_record = vis_record
                app.games[app.games.length-1].date = game_date
                app.games[app.games.length-1].time = game_time
                app.games[app.games.length-1].site = game_site
                app.games[app.games.length-1].site_code = select_site
                app.games[app.games.length-1].league = league
                app.games[app.games.length-1].schedule_note = sched_note
                app.games[app.games.length-1].quarters = halves
                app.games[app.games.length-1].min_period = min_period
                app.games[app.games.length-1].min_ot = min_ot
                app.games[app.games.length-1].officials = officials_array
                app.games[app.games.length-1].comments = comments
                app.games[app.games.length-1].attendance = atten

                ipc.send("init-game", curr_game)
            }
            else {
                date_time = app.selected_game.date + "_" + app.selected_game.time.split(/:/)[0];

                DRW.overwrite_footer(date_time, curr_game);

                for(i = 0; i < app.games.length; i++) {
                    if(app.games[i].date == app.selected_game.date && app.games[i].time == app.selected_game.time.split(/:/)[0]) {
                        app.selected_game = app.games[i];
                        console.log("selected game: "+app.selected_game)
                    }
                }

                //[HOME_TEAM, AWAY_TEAM, HOME_TEAM_CODE, AWAY_TEAM_CODE, HOME_TEAM_RECORD, AWAY_TEAM_RECORD, GAME_DATE, START_TIME, STADIUM, STADIUM_CODE, CONF_GAME?, [SCHEDULE_NOTES], QUARTERS/HALVES?, MIN_PER_PERIOD, MIN_IN_OT, OFFICIALS, [BOX_COMMENTS], ATTENDANCE]
                //[    0    ,     1    ,       2       ,        3      ,        4        ,        5        ,     6    ,     7     ,   8    ,       9     ,    10     ,        11       ,        12       ,       13      ,    14    ,    15    ,        16     ,     17    ]

                app.selected_game.home_name = curr_game[0];
                app.selected_game.vis_name = curr_game[1];
                app.selected_game.home_code = curr_game[2];
                app.selected_game.vis_code = curr_game[3];
                app.selected_game.home_record = curr_game[4];
                app.selected_game.vis_record = curr_game[5];
                app.selected_game.date = curr_game[6];
                app.selected_game.time = curr_game[7];
                app.selected_game.site = curr_game[8];
                app.selected_game.site_code = curr_game[9];
                app.selected_game.league = curr_game[10];
                app.selected_game.schedule_note = curr_game[11];
                app.selected_game.halves = curr_game[12];
                app.selected_game.min_period = curr_game[13];
                app.selected_game.min_ot = curr_game[14];
                app.selected_game.officials = curr_game[15];
                app.selected_game.comments = curr_game[16];
                app.selected_game.attendance = curr_game[17];

                localStorage.setItem("homeName",app.selected_game.home_name);
                localStorage.setItem("visName",app.selected_game.vis_name);
                localStorage.setItem("homeCode",app.selected_game.home_code);
                localStorage.setItem("visCode",app.selected_game.vis_code);
                localStorage.setItem("gameDate",app.selected_game.date);
                localStorage.setItem("gameTime",app.selected_game.time.split(/:/)[0]);

                console.log("selected game: "+app.selected_game +" home name: "+app.selected_game.home_name+" vis name: "+app.selected_game.vis_name+" home code: "+app.selected_game.home_code+" vis code: "+app.selected_game.vis_code)

                window.location = "./index.html";
            }
        }
        else {
            window.alert("Please fill in all fields");
        }
    },
    // If F9 is pressed
    delete_game() {
      if(app.selected_game.date != undefined) {
        if(window.confirm("DELETE GAME: "+ app.selected_game.date + " at " + app.selected_game.time.split(/:/)[0] + "?"))
        {
          for(var index = 0; index < app.games.length; index++)
          {
            if(app.games[index].date == app.selected_game.date)
            {
              app.games.splice(index, 1);
              date_time = app.selected_game.date + "_" + app.selected_game.time.split(/:/)[0];

              //UNCOMMENT to test delete_file
//              date_time = "0006-08-08_18:06";
              DRW.delete_file(date_time);
              console.log(date_time);
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
  }

})