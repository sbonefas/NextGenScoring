//const electron = require("electron");
//const ipc = electron.ipcRenderer;

var home = true;
var inputtext = "";
var currentlyInputtingPlay = "";
var join_two_plays = "";
//result_code_prompt = `
//PRESS A RESULT CODE...
//
//G (or Q) - GOOD FIELD GOAL               F - GOOD FG ON A FAST BREAK
//Y - GOOD 3PT FIELD GOAL                  R - MISSED SHOT (REBOUND)
//P - GOOD FG IN THE PAINT                  X - MISSED 3PT SHOT (REBOUND)
//Z - GOOD FG- FAST BREAK & PAINT   K - BLOCKED SHOT
//`;

var home_stats = {fg: Number.parseFloat(0.00).toFixed(2), tfg: Number.parseFloat(0.00).toFixed(2), ftp: Number.parseFloat(0.00).toFixed(2), tvs: 0, blocks: 0, steals: 0, paint: 0, offto: 0, sndch: 0, fastb: 0, fga: 0, tfga: 0, benchpts: 0}
Vue.component('home_team_stats', {
  template: `
  <div>
    <p>FG%: {{fg}}   3FG%: {{tfg}}   FT%: {{ftp}}</p>
    <p>TEAM: TURNOVERS: {{tvs}}   BLOCKS: {{blocks}}   STEALS: {{steals}}</p>
    <p>paint: {{paint}}   offto: {{offto}}   2ndch: {{sndch}}   fastb: {{fastb}}</p>
  </div>
  `,
  data: function () {
    return home_stats
  }
})

var vis_stats = {fg: Number.parseFloat(0.00).toFixed(2), tfg: Number.parseFloat(0.00).toFixed(2), ftp: Number.parseFloat(0.00).toFixed(2), tvs: 0, blocks: 0, steals: 0, paint: 0, offto: 0, sndch: 0, fastb: 0, fga: 0, tfga: 0, benchpts: 0}
Vue.component('vis_team_stats', {
  template: `
  <div>
    <p>FG%: {{fg}}   3FG%: {{tfg}}   FT%: {{ftp}}</p>
    <p>TEAM: TURNOVERS: {{tvs}}   BLOCKS: {{blocks}}   STEALS: {{steals}}</p>
    <p>paint: {{paint}}   offto: {{offto}}   2ndch: {{sndch}}   fastb: {{fastb}}</p>
  </div>
  `,
  data: function () {
    return vis_stats
  }
})

function launchClockPrompt() { // called when the user clicks on the game clock in the scorebar. Is used to edit the clock time and change between half 1, half 2, and OT
  var period = prompt("Please enter the current period\n1: Period 1\n2: Period 2\nOT: First overtime\n2OT: Second overtime\n30T: Third overtime\n40T: Fourth overtime\n50T: Fifth overtime\n60T: Sixth overtime\n\nWARNING: Changing periods will reset the clock to 20:00 (or 5:00 for OT periods)");
  if(period == null || period == "") {
    console.log("User canceleld the clock prompt");
  } else {
    if(period == 1) {
      app.period = 'Half 1';
      // $('#clockdiv #clockh2').html('20:00');
    } else if(period == 2) {
      app.period = 'Half 2';
      // $('#clockdiv #clockh2').html('20:00');
    } else if(period == 'OT' || period == 'ot') {
      app.period = 'OT';
      // $('#clockdiv #clockh2').html('05:00');
    } else if(period == '2OT' || period == '2ot') {
      app.period = '2OT';
      // $('#clockdiv #clockh2').html('05:00');
    } else if(period == '3OT' || period == '3ot') {
      app.period = '3OT';
      // $('#clockdiv #clockh2').html('05:00');
    } else if(period == '4OT' || period == '4ot') {
      app.period = '4OT';
      // $('#clockdiv #clockh2').html('05:00');
    } else if(period == '5OT' || period == '5ot') {
      app.period = '5OT';
      // $('#clockdiv #clockh2').html('05:00');
    } else if(period == '6OT' || period == '6ot') {
      app.period = '6OT';
      // $('#clockdiv #clockh2').html('05:00');
    }
  }
}

function startClock(startingTime) {
  var timer = new Timer();
  timer.start({countdown: true, startValues: {seconds: 1200}});
  timer.pause();
  var paused = true;
}

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
  el: '#app',
  data: {
    teams: ["WISC", "VISITOR"],
    period: 'Half 1',
    home_score: 0,
    home_fouls: 0,
    home_full: 1,
    home_partial: 4,
    vis_score: 0,
    vis_fouls: 0,
    vis_full: 1,
    vis_partial: 4,

    home_team: [
                {starter: true, in_game: "*", number: "01", name: "Player_1", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: true, in_game: "*", number: "02", name: "Player_2", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: true, in_game: "*", number: "03", name: "Player_3", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: true, in_game: "*", number: "04", name: "Player_4", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: true, in_game: "*", number: "05", name: "Player_5", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "06", name: "Bench_1", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "07", name: "Bench_2", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "08", name: "Bench_3", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "09", name: "Bench_4", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "10", name: "Bench_5", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0}
              ],
    home_totals: {in_game: " ", number: " ", name: "Totals", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},

    vis_team: [
                {starter: true, in_game: "*", number: "01", name: "Player_1", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: true, in_game: "*", number: "02", name: "Player_2", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: true, in_game: "*", number: "03", name: "Player_3", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: true, in_game: "*", number: "04", name: "Player_4", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: true, in_game: "*", number: "05", name: "Player_5", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "06", name: "Bench_1", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "07", name: "Bench_2", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "08", name: "Bench_3", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "09", name: "Bench_4", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},
                {starter: false, in_game: " ", number: "10", name: "Bench_5", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0}
              ],
    vis_totals: {in_game: " ", number: " ", name: "Totals", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb_off: 0, rb_def: 0, as: 0, blk: 0, to: 0, stl: 0, pf: 0, tp: 0},

    playlist: [
                //example: {time: "19:85", team: "WISC", playdscrp: "Ethan Happ made a 3 point jumper", score: "100-2"},
              ]
  },
  created() {
   document.addEventListener('keydown', this.keyevent);
  },
  methods: {
   keyevent(e) {
     console.log(e.keyCode);
     if(e.keyCode == 13) { // Enter key pressed
        if(currentlyInputtingPlay == "timeout") {
          app.timeout(false, e.keyCode);
        } else if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        }
        app.clear_input();
        //save play
     }
     if(e.keyCode == 8) { // Backspace key pressed
        inputtext = inputtext.slice(0, -1);
     }
     if(e.keyCode == 27) { // Esc key pressed
        app.clear_input();
     }

     // alt + h - Help menu
     if(e.altKey && e.keyCode == 72) {
        help();
     }

     // H or left arrow - home team
     else if(e.keyCode == 72 || e.keyCode == 37) {
        if(currentlyInputtingPlay == "") {
          app.home_possession();
          userinput.value = "";
        } else if(currentlyInputtingPlay == "timeout") {
          app.timeout(false, e.keyCode);
        } else if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        }
     }

     // V or right arrow - Visitor team
     else if(e.keyCode == 86 || e.keyCode == 39) {
        if(currentlyInputtingPlay == "") {
          app.vis_possession();
          userinput.value = "";
        } else if(currentlyInputtingPlay == "timeout") {
          app.timeout(false, e.keyCode);
        } else if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        }
     }

    // F2 - change player jersey number
     else if(e.keyCode == 113) {
        currentlyInputtingPlay = "changePlayerNumber";
        if(inputtext == "") {
          userinput.value = "";
          app.change_player_number(true, e.keyCode);
        } else {
          app.change_player_number(false, e.keyCode);
        }
     }
     // F6 - Substitution
     else if(e.keyCode == 117){
        currentlyInputtingPlay = "substitution";
        if(inputtext == "") {
          userinput.value = "";
          app.subs(true, e.keyCode);
        } else {
          app.subs(false, e.keyCode);
        }
     }

     // F10 - clear and do not complete any partially keyed action
     else if(e.keyCode == 121) {
        app.clear_input();
     }

     // A - assist
     else if(e.keyCode == 65) {
        userinput.value = "";
        currentlyInputtingPlay = "assist";
        app.assist(e.keyCode);
     }

     // B - used in foul() to indicate a bench foul
     else if(e.keyCode == 66) {
       if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        }
     }

     // C - Change time, period, stats
     else if(e.keyCode == 67) {
        //can change clock by clicking on it
     }

     // D - used in rebound() to indicate defensive rebound
     else if(e.keyCode == 68) {
        if(currentlyInputtingPlay == "") {
          app.shot_attempt(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        }
     }

     // E - Free Throw
     else if(e.keyCode == 69) {
        if(currentlyInputtingPlay == "") {
          userinput.value = "";
        }
        currentlyInputtingPlay = "freethrow";
        app.log_free_throw(e.keyCode, false);
     }

     // F - Foul
     else if(e.keyCode == 70) {
      if(currentlyInputtingPlay == "") {
        userinput.value = "";
        currentlyInputtingPlay = "foul";
        app.foul(e.keyCode);
      } else if(currentlyInputtingPlay == "shotattempt") {
        app.shot_attempt(e.keyCode);
      }
      
     }
     // G (or Q) - used as result codes in shot_attempt()
     else if(e.keyCode == 71 || e.keyCode == 81) {
        if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // J (or L,W) - Shot attempt - Note: Y and P are tested in another else if further down
     else if(e.keyCode == 74 || e.keyCode == 76 || e.keyCode == 87) {
        currentlyInputtingPlay = "shotattempt";
        userinput.value = "";
        app.shot_attempt(e.keyCode);
      /*
       who_did_it = window.prompt("SHOT BY: (Key in a player ##)");
       while(!app.check_in_game(who_did_it, home)) {
           if(who_did_it == null) {
                return
           }
            who_did_it = window.prompt("Player " + who_did_it + " is not in the game!\n\nSHOT BY: (Key in a player ##)");
       }
       result_code = window.prompt(result_code_prompt);
       if(home == true) {
         for(index = 0; index < app.home_team.length; index++)
         {
         console.log(who_did_it);
           // J then G or Q - good field goal (2 points)
           if(who_did_it == app.home_team[index].number && (result_code == "g" || result_code == "G" || result_code == "q" || result_code == "Q"))
           {
               app.jgq_good(app.home_team[index], app.home_team, app.home_totals, home_stats);
               break;
           }
           // J then Y - good 3pt field goal
           else if((who_did_it == app.home_team[index].number && (result_code == "y" || result_code == "Y"))) {
               app.jy_good_3(app.home_team[index], app.home_team, app.home_totals, home_stats);
               break;
           }
           // J then R - missed shot (rebound)
           else if (who_did_it == app.home_team[index].number && (result_code == "r" || result_code == "R")) {
               app.jr_missed(app.home_team[index], app.home_team, app.home_totals, home_stats);
               break;
           }
           // J then P - field goal in the paint
           else if (who_did_it == app.home_team[index].number && (result_code == "p" || result_code == "P")) {
               app.jp_good_paint(app.home_team[index], app.home_team, app.home_totals, home_stats);
               break;
           }
           // J then Z - GOOD FG-FAST BREAK & PAINT
           else if (who_did_it == app.home_team[index].number && (result_code == "z" || result_code == "Z")) {
               app.jz_good_fastb_paint(app.home_team[index], app.home_team, app.home_totals, home_stats);
               break;
           }
           // J then F - GOOD FG ON A FAST BREAK
           else if (who_did_it == app.home_team[index].number && (result_code == "f" || result_code == "F")) {
                 app.jf_good_fastb(app.home_team[index], app.home_team, app.home_totals, home_stats);
                 break;
           }
           // J then X - MISSED 3PT SHOT (REBOUND)
           else if (who_did_it == app.home_team[index].number && (result_code == "x" || result_code == "X")) {
               app.jx_missed_3(app.home_team[index], app.home_team, app.home_totals, home_stats);
               break;
           }
           // J then K - BLOCKED SHOT
           else if (who_did_it == app.home_team[index].number && (result_code == "k" || result_code == "K")) {
               app.jk_blocked_shot(app.home_team[index], app.home_team, app.home_totals, home_stats);
               break;
           }
         }
       } //end home calculations
       else {  // Visitor calculations
         for(index = 0; index < app.vis_team.length; index++)
         {
         console.log("who did it: " + who_did_it);
           // J then G or Q - good field goal (2 points)
           if(who_did_it == app.vis_team[index].number && (result_code == "g" || result_code == "G" || result_code == "q" || result_code == "Q"))
           {
               app.jgq_good(app.vis_team[index], app.vis_team, app.vis_totals, vis_stats);
               break;
           }
           // J then Y - good 3pt field goal
           else if((who_did_it == app.vis_team[index].number && (result_code == "y" || result_code == "Y"))) {
               app.jy_good_3(app.vis_team[index], app.vis_team, app.vis_totals, vis_stats);
               break;
           }
           // J then R - missed shot (rebound)
           else if (who_did_it == app.vis_team[index].number && (result_code == "r" || result_code == "R")) {
               app.jr_missed(app.vis_team[index], app.vis_team, app.vis_totals, vis_stats);
               break;
           }
           // J then P - field goal in the paint
           else if (who_did_it == app.vis_team[index].number && (result_code == "p" || result_code == "P")) {
               app.jp_good_paint(app.vis_team[index], app.vis_team, app.vis_totals, vis_stats);
               break;
           }
           // J then Z - GOOD FG-FAST BREAK & PAINT
           else if (who_did_it == app.home_team[index].number && (result_code == "z" || result_code == "Z")) {
               app.jz_good_fastb_paint(app.vis_team[index], app.vis_team, app.vis_totals, vis_stats);
               break;
           }
           // J then F - GOOD FG ON A FAST BREAK
           else if (who_did_it == app.vis_team[index].number && (result_code == "f" || result_code == "F")) {
               app.jf_good_fastb(app.vis_team[index], app.vis_team, app.vis_totals, vis_stats);
               break;
           }
           // J then X - MISSED 3PT SHOT (REBOUND)
           else if (who_did_it == app.vis_team[index].number && (result_code == "x" || result_code == "X")) {
               app.jx_missed_3(app.vis_team[index], app.vis_team, app.vis_totals, vis_stats);
               break;
           }
           // J then K - BLOCKED SHOT
           else if (who_did_it == app.vis_team[index].number && (result_code == "k" || result_code == "K")) {
               app.jk_blocked_shot(app.vis_team[index], app.vis_team, app.vis_totals, vis_stats);
               break;
           }
         }
       }//end visitor calculations
       */
     }// end J

     // K - blocked shot
     else if(e.keyCode == 75) {
      if(currentlyInputtingPlay == "") {
        userinput.value = "";
        currentlyInputtingPlay = "block";
        app.blocked_shot(e.keyCode, false);
      } else if(currentlyInputtingPlay == "shotattempt") {
        app.shot_attempt(e.keyCode);
      }
     }

     // M - used in timeout function (M is a full timeout) and turnover function (M is team turnover)
     // also used in rebound() to indicate a team rebound
     else if(e.keyCode == 77) {
        if(currentlyInputtingPlay == "timeout") {
          app.timeout(false, e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        }
     }

     // O - timeout
     else if(e.keyCode == 79) {
        currentlyInputtingPlay = "timeout";
        if(inputtext == "") {
          app.timeout(true, e.keyCode);
        } else{
          app.timeout(false, e.keyCode);
        }
     }

     // P - used as result code in shot_attempt()
     else if(e.keyCode == 80) {
        if(currentlyInputtingPlay == "") {
          app.shot_attempt(e.keyCode);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

    // R - rebound
     else if(e.keyCode == 82) {
      if(currentlyInputtingPlay == "") {
        userinput.value = "";
        currentlyInputtingPlay = "rebound";
        app.rebound(e.keyCode);
      } else if(currentlyInputtingPlay == "freethrow") {
        app.log_free_throw(e.keyCode, false);
      } else if(currentlyInputtingPlay == "shotattempt") {
        app.shot_attempt(e.keyCode);
      }    
     }

     // S - steal
     else if(e.keyCode == 83) {
        userinput.value = "";
        currentlyInputtingPlay = "steal";
        app.steal(e.keyCode);
     }

     // T - turnover
     else if(e.keyCode == 84) {
      if(currentlyInputtingPlay == "") {
          userinput.value = "";
          currentlyInputtingPlay = "turnover";
          app.turnover(e.keyCode);
      } else if(currentlyInputtingPlay == "timeout") {
          app.timeout(false, e.keyCode);
      } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
      } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
      }
     }

     // X - used as result code in shot_attempt()
     else if(e.keyCode == 88) {
        if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
      }

     // Y - used as result code in shot_attempt()
     else if(e.keyCode == 89) {
        if(currentlyInputtingPlay == "") {
          app.shot_attempt(e.keyCode);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // Z - used as result code in shot_attempt()
     else if(e.keyCode == 90) {
        if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 0
     else if(e.keyCode == 48) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 1
     else if(e.keyCode == 49) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 2
     else if(e.keyCode == 50) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 3 - used in timeout function (3 is a 30 second timeout)
     else if(e.keyCode == 51) {
        if(currentlyInputtingPlay == "timeout") {
          app.timeout(false, e.keyCode);
        } else if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 4
     else if(e.keyCode == 52) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 5
     else if(e.keyCode == 53) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 6
     else if(e.keyCode == 54) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 7
     else if(e.keyCode == 55) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 8
     else if(e.keyCode == 56) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

     // 9
     else if(e.keyCode == 57) {
        if(currentlyInputtingPlay == "changePlayerNumber") {
          app.change_player_number(false, e.keyCode);
        } else if(currentlyInputtingPlay == "substitution") {
          app.subs(false, e.keyCode);
        } else if(currentlyInputtingPlay == "foul") {
          app.foul(e.keyCode);
        } else if(currentlyInputtingPlay == "turnover") {
          app.turnover(e.keyCode);
        } else if(currentlyInputtingPlay == "assist") {
          app.assist(e.keyCode);
        } else if(currentlyInputtingPlay == "steal") {
          app.steal(e.keyCode);
        } else if(currentlyInputtingPlay == "rebound") {
          app.rebound(e.keyCode);
        } else if(currentlyInputtingPlay == "block") {
          app.blocked_shot(e.keyCode, false);
        } else if(currentlyInputtingPlay == "freethrow") {
          app.log_free_throw(e.keyCode, false);
        } else if(currentlyInputtingPlay == "shotattempt") {
          app.shot_attempt(e.keyCode);
        }
     }

   }, //end keycode method
   clear_input() {
        inputtext = ""; // clears inputtext variable that stores the key code sequence
        inputvalidator.innerText = "Enter input...";  // sets inputvalidator h3 equal to the initial text (Enter input...)
        userinput.value = "";  // clears the text box
        currentlyInputtingPlay = "";
        join_two_plays = "";
   },
   home_possession() {
       home = true;
       var h = document.getElementById("homescoreshowhide");
       var h2 = document.getElementById("pshometeamname");
       h.style.color = "red";
       h.style.textDecoration = "underline";
       h2.style.color = "red";
       h2.style.textDecoration = "underline";
       var v = document.getElementById("visitorscoreshowhide");
       var v2 = document.getElementById("psvisitorteamname");
       v.style.color = "white";
       v.style.textDecoration = "none";
       v2.style.color = "black";
       v2.style.textDecoration = "none";
   },
   vis_possession() {
       home = false
       var v = document.getElementById("visitorscoreshowhide");
       var v2 = document.getElementById("psvisitorteamname");
       v.style.color = "red";
       v.style.textDecoration = "underline";
       v2.style.color = "red";
       v2.style.textDecoration = "underline";
       var h = document.getElementById("homescoreshowhide");
       var h2 = document.getElementById("pshometeamname");
       h.style.color = "white";
       h.style.textDecoration = "none";
       h2.style.color = "black";
       h2.style.textDecoration = "none";
   },
   check_in_game(number, home_team) {
       if(home_team) {
         for(index = 0; index < app.home_team.length; index++)
         {
            if(number == app.home_team[index].number)
            {
                if(app.home_team[index].in_game == "*") {
                    return true;
                }
            }
         }
         return false;
       }
       else {
         for(index = 0; index < app.vis_team.length; index++)
         {
            if(number == app.vis_team[index].number)
            {
                if(app.vis_team[index].in_game == "*") {
                    return true;
                }
            }
         }
         return false;
       }
   },
   add_play(myPlayDcsrp) {
        if(home) {
            currTeam = app.teams[0];
        }
        else {
            currTeam = app.teams[1]
        }
        app.playlist.unshift({ time: document.getElementById('clockminutes').innerText + ':' + document.getElementById('clockseconds').innerText, team: currTeam, playdscrp: myPlayDcsrp, score: app.home_score + "-" + app.vis_score })
        //let keystrokes = "O T";
        //let keystroke2 = "j 16 g   h";
        //ipc.send('add-play',keystrokes);
   },
   shot_attempt(keyCode) {
      var char_entered = String.fromCharCode(keyCode);  // will be upper case
      if(keyCode == 13) char_entered = "ENTER";
      inputtext = inputtext + char_entered;
      if(char_entered == "ENTER") {
        
      } else if(char_entered == 'J') {
        inputvalidator.innerText = "Shot by player ##:";
      } else if(!isNaN(char_entered) && inputtext.length == 3) {
        var player_number = inputtext.substring(1,3);
        if(app.check_in_game(player_number, home)) {
          inputvalidator.innerText = "Enter result code: G or Q - good FG, Y - good 3pt FG, P - good FG in paint, Z - good FG fast break & paint, F - good FG fast break, R - missed shot (rebound), X - missed 3pt shot (rebound), K - blocked shot";
        } else {
          inputvalidator.innerText = "Player #" + player_number + " is not currently in the game. Press ESC/F10 to clear input";
        }
      } else if((char_entered == 'G' || char_entered == 'Q') && inputtext.length == 4) {
          inputvalidator.innerText = "G or Q pressed";
      } else if(char_entered == 'Y' && inputtext.length == 4) {
          inputvalidator.innerText = "Y pressed";
      } else if(char_entered == 'P' && inputtext.length == 4) {
          inputvalidator.innerText = "P pressed";
      } else if(char_entered == 'Z' && inputtext.length == 4) {
          inputvalidator.innerText = "Z pressed";
      } else if(char_entered == 'F' && inputtext.length == 4) {
          inputvalidator.innerText = "F pressed";
      } else if(char_entered == 'R' && inputtext.length == 4) {
          inputvalidator.innerText = "R pressed";
      } else if(char_entered == 'X' && inputtext.length == 4) {
          inputvalidator.innerText = "X pressed";
      } else if(char_entered == 'K' && inputtext.length == 4) {
          inputvalidator.innerText = "K pressed";
      }
   },
   timeout(first_input, keyCode) {
        if(first_input == true) {
          inputtext = "O";
          inputvalidator.innerText = "Enter T for media timeout or H for home timeout or V for visitor timeout";
        } else {
          var char_entered = String.fromCharCode(keyCode);  // will be upper case
          if(keyCode == 13) char_entered = "ENTER";
          console.log("char entered: *" + char_entered + "*");
          inputtext = inputtext + char_entered;
          if(char_entered == 'T') {
            inputvalidator.innerText = "Media timeout. Press ENTER to save play";
          } else if(char_entered == 'H') {
            inputvalidator.innerText = "Home timeout. Enter M for full timeout or 3 for 30 second timeout";
          } else if(char_entered == 'V') {
            inputvalidator.innerText = "Visitor timeout. Enter M for full timeout or 3 for 30 second timeout";
          } else if(char_entered == 'M') {
            inputvalidator.innerText = "Full timeout. Press ENTER to save play";
          } else if(char_entered == '3') {
            inputvalidator.innerText = "30 second timeout. Press ENTER to save play";
          } else if(char_entered == 'ENTER') {
            if(inputtext.substring(1,2) == 'T') { // media timeout
              app.add_play("Media timeout");
            } else if(inputtext.substring(1,2) == 'H' && inputtext.substring(2,3) == 'M') { // home full timeout
              if(app.home_full > 0) {
                app.home_full -= 1;
                app.add_play(app.teams[0] + " full timeout");
              } else {
                // inputvalidator.innerText = "Out of timeouts. Press ESC/F10 to clear input.";
              }
            } else if(inputtext.substring(1,2) == 'H' && inputtext.substring(2,3) == '3') { // home 30 sec timeout
              if(app.home_partial > 0) {
                app.home_partial -= 1;
                app.add_play(app.teams[0] + " partial timeout");
              } else {
                // inputvalidator.innerText = "Out of timeouts. Press ESC/F10 to clear input.";
              }
            } else if(inputtext.substring(1,2) == 'V' && inputtext.substring(2,3) == 'M') { // visitor full timeout
              if(app.vis_full > 0) {
                app.vis_full -= 1;
                app.add_play(app.teams[1] + " full timeout");
              } else {
                // inputvalidator.innerText = "Out of timeouts. Press ESC/F10 to clear input.";
              }
            } else if(inputtext.substring(1,2) == 'V' && inputtext.substring(2,3) == '3') { // visitor 30 sec timeout
              if(app.vis_partial > 0) {
                app.vis_partial -= 1;
                app.add_play(app.teams[1] + " partial timeout");
              } else {
                // inputvalidator.innerText = "Out of timeouts. Press ESC/F10 to clear input.";
              }
            }
          } else {
            inputvalidator.innerText = "Input not recognized";
          }
        }
        
   },
   // J then G or Q - good field goal (2 points)
   jgq_good(person, team, totals, stats) {
         person.fg += 1;
         person.fa += 1;
         person.tp += 2;
         totals.fg += 1;
         totals.fa += 1;

         //increase bench points
         if(!person.starter) {
            stats.benchpts += 1;
            console.log("benchpts: " + stats.benchpts)
         }

         // add to score
         if(home) {
            app.home_score += 2;
            score = app.home_score;
         }
         else {
            app.vis_score += 2;
            score = app.vis_score;
         }

         totals.tp = score;
         // add to play by play
         app.add_play(`${person.name} made a jump shot`);

         var total_attempts = 0;
         var total_fgs = 0;
         for(players = 0; players < team.length; players++)
         {
           total_attempts += (team[players].fa + team[players].a3);
           total_fgs += (team[players].fg + team[players].m3);
         }
         stats.fg = Number.parseFloat((total_fgs/total_attempts)*100).toFixed(2);

         // change possession
         if(home) {
            app.vis_possession();
         }
         else {
            app.home_possession();
         }
   },
   // J then Y - good 3pt field goal
   jy_good_3(person, team, totals, stats) {
         person.m3 += 1;
         person.a3 += 1;
         person.tp += 3;
         totals.m3 += 1;
         totals.a3 += 1;
         person.fa += 1;
         person.fg += 1;
         totals.fa += 1;
         totals.fg += 1;

         //increase bench points
         if(!person.starter) {
             stats.benchpts += 1;
             console.log("benchpts: " + stats.benchpts)
         }

         var total_attempts = 0;
         var total_fgs = 0;
         var total_threes_attmept = 0;
         var total_threes = 0;
         for(players = 0; players < team.length; players++)
         {
           total_attempts += (team[players].fa + team[players].a3);
           total_fgs += (team[players].fg + team[players].m3);
           total_threes += team[players].m3;
           total_threes_attmept += team[players].a3;
         }
         stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
         stats.tfg = Number.parseFloat(total_threes/total_threes_attmept).toFixed(2);
         if(home) {
            app.home_score += 3;
            score = app.home_score;
         }
         else {
            app.vis_score += 3;
            score = app.vis_score;
         }
         totals.tp = score;
         // add to play by play - VIS
         app.add_play(`${person.name} hit a 3-point jumper`);

         // change possession
         if(home) {
            app.vis_possession();
         }
         else {
            app.home_possession();
         }
   },
   // J then R - missed shot (rebound)
   jr_missed(person, team, totals, stats) {
         person.fa += 1;
         totals.fa += 1;
         // add to play by play - VIS
         app.add_play(`${person.name} missed a field goal`);
         var total_attempts = 0;
         var total_fgs = 0;
         for(players = 0; players < team.length; players++)
         {
           total_attempts += (team[players].fa + team[players].a3);
           total_fgs += (team[players].fg + team[players].m3);
         }
         stats.fg = Number.parseFloat((total_fgs/total_attempts)*100).toFixed(2);
         app.rebound();
   },
   // J then P - field goal in the paint
   jp_good_paint(person, team, totals, stats) {
         person.fa += 1;
         person.fg += 1;
         person.tp += 2;
         totals.fa += 1;
         totals.fg += 1;
         stats.paint += 1;

         //increase bench points
         if(!person.starter) {
              stats.benchpts += 1;
              console.log("benchpts: " + stats.benchpts)
         }

         if(home) {
            app.home_score += 2;
            score = app.home_score;
         }
         else {
            app.vis_score += 2;
            score = app.vis_score;
         }
         totals.tp = score;
         app.add_play(`${person.name} made a shot in the paint`);
         var total_attempts = 0;
         var total_fgs = 0;
         for(players = 0; players < team.length; players++)
         {
           total_attempts += team[players].fa;
           total_fgs += (team[players].fg + team[players].m3);
         }
         stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
         // change possession
         if(home) {
            app.vis_possession();
         }
         else {
            app.home_possession();
         }
   },
   // J then Z - GOOD FG-FAST BREAK & PAINT
   jz_good_fastb_paint(person, team, totals, stats) {
        //update boxscore
        person.fg += 1;
        person.fa += 1;
        person.tp += 2;

         //increase bench points
         if(!person.starter) {
             stats.benchpts += 1;
             console.log("benchpts: " + stats.benchpts)
         }

        if(home) {
            app.home_score += 2;
            score = app.home_score;
        }
        else {
            app.vis_score += 2;
            score = app.vis_score;
        }
        totals.tp = score;
        totals.fg += 1;
        totals.fa += 1;

        // update fast break and in the paint
        stats.fastb += 1;
        stats.paint += 1;

        // add to playby play
         app.add_play(`Fast Break: ${person.name} made a shot in the paint`);
         var total_attempts = 0;
         var total_fgs = 0;
         for(players = 0; players < team.length; players++)
         {
           total_attempts += team[players].fa;
           total_fgs += (team[players].fg + team[players].m3);
         }
         stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
         app.assist()
         // change possession
         if(home) {
            app.vis_possession();
         }
         else {
            app.home_possession();
         }
   },
   // J then F - GOOD FG ON A FAST BREAK
   jf_good_fastb(person, team, totals, stats) {
        //update boxscore
        person.fg += 1;
        person.fa += 1;
        person.tp += 2;

         //increase bench points
         if(!person.starter) {
             stats.benchpts += 1;
             console.log("benchpts: " + stats.benchpts)
         }

        if(home) {
            app.home_score += 2;
            score = app.home_score;
        }
        else {
            app.vis_score += 2;
            score = app.vis_score;
        }
        totals.tp = score;
        totals.fg += 1;
        totals.fa += 1;

        // update fast break
        stats.fastb += 1;

        // add to playby play
         app.add_play(`Fast Break: ${person.name} made a shot`);
         var total_attempts = 0;
         var total_fgs = 0;
         for(players = 0; players < team.length; players++)
         {
           total_attempts += team[players].fa;
           total_fgs += (team[players].fg + team[players].m3);
         }
         stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);

         app.assist()

         // change possession
         if(home) {
            app.vis_possession();
         }
         else {
            app.home_possession();
         }
   },
   // J then X - MISSED 3PT SHOT (REBOUND)
   jx_missed_3(person, team, totals, stats) {
         person.fa += 1;
         person.a3 += 1;
         totals.fa += 1;
         totals.a3 += 1;

         //increase bench points
         if(!person.starter) {
             stats.benchpts += 1;
             console.log("benchpts: " + stats.benchpts)
         }

         // add to play by play
         app.add_play(`${person.name} missed a 3-point jumper`);

         var total_attempts = 0;
         var total_fgs = 0;
         var total_threes_attmept = 0;
         var total_threes = 0;
         for(players = 0; players < team.length; players++)
         {
           total_attempts += (team[players].fa + app.vis_team[players].a3);
           total_fgs += (team[players].fg + team[players].m3);
           total_threes += team[players].m3;
           total_threes_attmept += team[players].a3;
         }
         stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
         stats.tfg = Number.parseFloat(total_threes/total_threes_attmept).toFixed(2);

         app.rebound();
   },
   // J then K - BLOCKED SHOT
   jk_blocked_shot(person, team, totals, stats) {
         person.fa += 1;
         totals.fa += 1;
         // add to play by play
         app.add_play(`${person.name} J -> K`);
         var total_attempts = 0;
         var total_fgs = 0;
         for(players = 0; players < team.length; players++)
         {
           total_attempts += (team[players].fa + team[players].a3);
           total_fgs += (team[players].fg + team[players].m3);
         }
         stats.fg = Number.parseFloat((total_fgs/total_attempts)*100).toFixed(2);
         app.blocked_shot();
   },
   //substitutions
   subs(first_input, keyCode) {
       if(first_input) {
          inputtext = "F6";
          userinput.value = "F6";
          inputvalidator.innerText = "Enter ## of player leaving on the " + (home ? "home" : "visiting") + " team";
       } else {
          var char_entered = String.fromCharCode(keyCode); // will be upper case
          if(keyCode == 13) char_entered = "ENTER";
          console.log("char entered: *" + char_entered + "*");
          inputtext = inputtext + char_entered;
          if(char_entered == "ENTER") {
             var who_came_out = inputtext.substring(2,4);
             var who_came_in = inputtext.substring(4,6);
             if(home == true) {
               for(index = 0; index < app.home_team.length; index++) {
                  if(who_came_out == app.home_team[index].number) {
                    app.home_team[index].in_game = " "
                    var came_out = index;
                  }
                  if(who_came_in == app.home_team[index].number) {
                    app.home_team[index].in_game = "*"
                    var came_in = index;
                  }
               }
               // add to play by play - HOME
               app.add_play(`${app.home_team[came_in].name} subbed in for ${app.home_team[came_out].name}`);
             }
             else {
               for(index = 0; index < app.vis_team.length; index++) {
                  if(who_came_out == app.vis_team[index].number) {
                    app.vis_team[index].in_game = " "
                    var came_out = index;
                  }
                  if(who_came_in == app.vis_team[index].number) {
                    app.vis_team[index].in_game = "*"
                    var came_in = index;
                  }
               }
               // add to play by play - VISITOR
               app.add_play(`${app.vis_team[came_in].name} subbed in for ${app.vis_team[came_out].name}`);
             }
          }
          if(inputtext.length == 4) { // 4 is the number of characters in F623 i.e. after user has entered exiting player's number
            if(app.check_in_game(inputtext.substring(2,4), home)) {
              inputvalidator.innerText = "Enter ## of player entering on the " + (home ? "home" : "visiting") + " team";
            } else {
              inputvalidator.innerText = "Player #" + inputtext.substring(2,4) + " is not in the game. Press ESC/F10 to clear input";
            }
            
          } else if(inputtext.length == 6) { // 6 is the number of characters in F62399 i.e. after user has entered exiting and entering player's number
              if(!app.check_in_game(inputtext.substring(4), home)) {
              inputvalidator.innerText = "#" + inputtext.substring(4,6) + " subbing in for #" + inputtext.substring(2,4) + ". Press ENTER to save play";
            } else {
              inputvalidator.innerText = "Player #" + inputtext.substring(4,6) + " is already in the game. Press ESC/F10 to clear input";
            }
          }

       }
   },
   //assists
   assist(keyCode) {
      var char_entered = String.fromCharCode(keyCode);
      if(keyCode == 13) char_entered = "ENTER";
      inputtext = inputtext + char_entered;
      if(char_entered == "ENTER") {
        var player_number = inputtext.substring(1,3);
        if(app.check_in_game(player_number, home)) {
          if(home) {
             for(index = 0; index < app.home_team.length; index++)
             {
                if(player_number == app.home_team[index].number)
                {
                    app.home_team[index].as += 1;
                    app.home_totals.as += 1;
                    app.add_play("Assist by " + app.home_team[index].name);
                }
             }
           }
           else {
             for(index = 0; index < app.vis_team.length; index++)
             {
                if(player_number == app.vis_team[index].number)
                {
                    app.vis_team[index].as += 1;
                    app.vis_totals.as += 1;
                    app.add_play("Assist by " + app.vis_team[index].name);
                }
             }
           }
        }
      } else if(char_entered == 'A') {
        inputvalidator.innerText = "Assist by: Key in a player ## or ENTER for no assist.";
      } else if(!isNaN(char_entered) && inputtext.length == 3) {
        var player_number = inputtext.substring(1,3);
        if(app.check_in_game(player_number, home)) {
          inputvalidator.innerText = "Assist by #" + player_number + ". Press ENTER to save play";
        } else {
          inputvalidator.innerText = "Player #" + player_number + " is not in the game. Press ESC/F10 to clear input.";
        }
      }
   },
   //steals
   steal(keyCode) {
      console.log("currentl inputting play:" + currentlyInputtingPlay);
      var char_entered = String.fromCharCode(keyCode);
      if(keyCode == 13) char_entered = "ENTER";
      inputtext = inputtext + char_entered;
      if(char_entered == "ENTER") {
        var player_number = inputtext.substring(1,3);
        if(app.check_in_game(player_number, home)) {
          if(home) {
             for(index = 0; index < app.home_team.length; index++)
             {
                if(player_number == app.home_team[index].number)
                {
                    app.home_team[index].stl += 1;
                    app.home_totals.stl += 1;
                    app.add_play("Steal by " + app.home_team[index].name);
                }
             }
           }
           else {
             for(index = 0; index < app.vis_team.length; index++)
             {
                if(player_number == app.vis_team[index].number)
                {
                    app.vis_team[index].stl += 1;
                    app.vis_totals.stl += 1;
                    app.add_play("Steal by " + app.vis_team[index].name);
                }
             }
           }
        }
      } else if(char_entered == 'S') {
        inputvalidator.innerText = "Steal by: Key in a player ##.";
      } else if(!isNaN(char_entered) && inputtext.length == 3) {
        var player_number = inputtext.substring(1,3);
        console.log("steal player num: *" + player_number + "*");
        if(app.check_in_game(player_number, home)) {
          inputvalidator.innerText = "Steal by #" + player_number + ". Press ENTER to save play";
        } else {
          inputvalidator.innerText = "Player #" + player_number + " is not in the game. Press ESC/F10 to clear input.";
        }
      }
   },
   //turnovers
   turnover(keyCode) {
      var char_entered = String.fromCharCode(keyCode);
      if(keyCode == 13) char_entered = "ENTER";
      inputtext = inputtext + char_entered;
      if(char_entered == "ENTER") {
        if(inputtext.substring(1,2) == 'M') {
          if(home) {
            home_stats.tvs += 1;
            app.home_totals.to += 1
            app.vis_possession(); // switch possession
          } else {
            vis_stats.tvs += 1;
            app.vis_totals.to += 1
            app.home_possession(); // switch possession
          }
        } else {
          var player_number = inputtext.substring(1,3);
          if(app.check_in_game(player_number, home)) {
            if(home) {
            for(index = 0; index < app.home_team.length; index++) {
              if(player_number == app.home_team[index].number) {
                  app.home_team[index].to += 1;
                  app.add_play("Turnover by " + app.home_team[index].name);
                  break;
              }
            }
           home_stats.tvs += 1;
           app.home_totals.to += 1
           app.vis_possession(); // switch possession
        } else {
          for(index = 0; index < app.vis_team.length; index++) {
                if(player_number == app.vis_team[index].number) {
                    app.vis_team[index].to += 1;
                    app.add_play("Turnover by " + app.vis_team[index].name);
                    break;
                }
           }
           vis_stats.tvs += 1;
           app.vis_totals.to += 1
           app.home_possession(); // switch possession
          }
          }
        }
      } else if(char_entered == 'T') {
        inputvalidator.innerText = "Turnover by: (Key in a player ##) or M for team turnover";
      } else if(char_entered == 'M') {
        inputvalidator.innerText = "Team turnover on the " + (home ? "home" : "visiting") + " team. Press ENTER to save play.";
      } else if(!isNaN(char_entered) && inputtext.length == 3) {
        if(app.check_in_game(inputtext.substring(1), home)) {
          inputvalidator.innerText = "Turnover on #" + inputtext.substring(1) + ". Press ENTER to save play.";
        } else {
          inputvalidator.innerText = "#" + inputtext.substring(1) + " is not currently in the game. Press ESC/F10 to clear input.";
        }
        
      }
   },
   //fouls
   foul(keyCode) {
      var char_entered = String.fromCharCode(keyCode);
      if(keyCode == 13) char_entered = "ENTER";
      inputtext = inputtext + char_entered;
      if(char_entered == "ENTER") {
        if(inputtext.substring(2,3) == 'B') {
          if(inputtext.substring(1,2) == 'H') {
            home = true;
            home_stats.tvs += 1;
            app.home_totals.to += 1
            app.home_totals.pf += 1
            app.add_play("Bench foul on the home team.");
            app.vis_possession(); // switch possession
        } else {
            home = false;
            vis_stats.tvs += 1;
            app.vis_totals.to += 1
            app.vis_totals.pf += 1;
            app.add_play("Bench foul on the visiting team.");
            app.home_possession(); // switch possession
        }
      } else if(inputtext.substring(2,3) == 'T') {
          if(inputtext.substring(1,2) == 'H') {
          home = true;
          var player_number = inputtext.substring(3,5);
          for(index = 0; index < app.home_team.length; index++)
           {
              if(player_number == app.home_team[index].number)
              {
                  // app.home_team[index].pf += 1; Technical fouls are not personal fouls
                  app.home_team[index].to += 1;  // Offensive fouls are turnovers
                  app.add_play("Technical foul on " + app.home_team[index].name);
              }
           }
            home_stats.tvs += 1;
            app.home_totals.to += 1
            app.home_totals.pf += 1
            app.vis_possession(); // switch possession
        } else {
            home = false;
            var player_number = inputtext.substring(3,5);
            for(index = 0; index < app.vis_team.length; index++)
             {
                if(player_number == app.vis_team[index].number)
                {
                    // app.vis_team[index].pf += 1; Technical fouls are not personal fouls
                    app.vis_team[index].to += 1;  // Offensive fouls are turnovers
                    app.add_play("Technical foul on " + app.vis_team[index].name);
                }
             }
            vis_stats.tvs += 1;
            app.vis_totals.to += 1
            app.vis_totals.pf += 1;
            app.home_possession(); // switch possession
        }
      } else {  // not a bench or technical foul
        if(inputtext.substring(1,2) == 'H') {
          home = true;
          var player_number = inputtext.substring(2,4);
          for(index = 0; index < app.home_team.length; index++)
           {
              if(player_number == app.home_team[index].number)
              {
                  app.home_team[index].pf += 1;
                  app.home_team[index].to += 1;  // Offensive fouls are turnovers
                  app.add_play("Foul on " + app.home_team[index].name);
              }
           }
          home_stats.tvs += 1;
          app.home_totals.to += 1
          app.home_totals.pf += 1
          app.vis_possession(); // switch possession
        } else {
          home = false;
          var player_number = inputtext.substring(2,4);
            for(index = 0; index < app.vis_team.length; index++)
             {
                if(player_number == app.vis_team[index].number)
                {
                    app.vis_team[index].pf += 1;
                    app.vis_team[index].to += 1;  // Offensive fouls are turnovers
                    app.add_play("Foul on " + app.vis_team[index].name);
                }
             }
             vis_stats.tvs += 1;
             app.vis_totals.to += 1
             app.vis_totals.pf += 1
             app.home_possession(); // switch possession
        }
      }
      } else if(char_entered == 'F') {
        inputvalidator.innerText = "Home or Visiting team foul? Enter H for home or V for visitor";
      } else if(char_entered == 'H') {
        inputvalidator.innerText = "Home foul on: (Key in a player ##). For a technical, press T and a player ## or B for bench";
      } else if(char_entered == 'V') {
        inputvalidator.innerText = "Visitor foul on: (Key in a player ##). For a technical, press T and a player ## or B for bench";
      } else if(char_entered == 'B' && inputtext.length == 3) {
        var foul_on_home_team = false;
        if(inputtext.substring(1,2) == 'H') {
            foul_on_home_team = true;
        }
        inputvalidator.innerText = "Bench foul on the " + (foul_on_home_team ? "home" : "visiting") + " team. Press ENTER to save foul.";
      } else if(char_entered == 'T') {
        inputvalidator.innerText = "Technical foul. Enter player ##.";
      } else if(!isNaN(char_entered) && (inputtext.length == 4 || (inputtext.length == 5 && inputtext.substring(2,3) == 'T'))) {
        if(inputtext.substring(2,3) == 'T') {
          inputvalidator.innerText = "Technical foul on #" + inputtext.substring(3,5) + ". Press ENTER to save foul.";
        } else {
          inputvalidator.innerText = "Foul on #" + inputtext.substring(2,4) + ". Press ENTER to save foul.";
        }
      }


   },
   //rebound
   rebound(keyCode) {
      var char_entered = String.fromCharCode(keyCode); // will be upper case
      if(keyCode == 13) char_entered = "ENTER";
      inputtext = inputtext + char_entered;
      if(char_entered == "ENTER") {
        console.log(inputtext.substring(1,2));
        console.log(inputtext.substring(2,3));
        console.log(((!isNaN(inputtext.substring(1,2))) && (!isNaN(inputtext.substring(2,3)))));
        if(inputtext.substring(1,2) == 'D') {
          if(inputtext.substring(2,3) == 'M') {
            app.rb_team(true);
          } else if(inputtext.substring(2,3) == 'B') {
            app.rb_deadball(true);
          } else if(!isNaN(inputtext.substring(2,3)) && !isNaN(inputtext.substring(3,4))) {
            app.rb_normal(inputtext);
          }
        } else {
          if(inputtext.substring(1,2) == 'M') {
            app.rb_team(false);
          } else if(inputtext.substring(1,2) == 'B') {
            app.rb_deadball(false);
          } else if((!isNaN(inputtext.substring(1,2))) && (!isNaN(inputtext.substring(2,3)))) {
            app.rb_normal(inputtext);
          }
        }
        inputtext = join_two_plays;
        if(inputtext.substring(0,1) == 'K') {  // block then rebound
          currentlyInputtingPlay = "block";
          if(inputtext.substring(1,2) == 'D') {
            app.blocked_shot(13, false);  // 13 is shot code for ENTER
          } else {
            app.blocked_shot(13, true);  // 13 is shot code for ENTER
          }
        } else if(inputtext.substring(0,1) == 'E') {
          console.log("rebound after ft inputtext:" + inputtext);
          currentlyInputtingPlay = "freethrow";
          if(inputtext.substring(1,2) == 'D') {
            app.log_free_throw(13, true);  // 13 is shot code for ENTER
          } else {
            app.log_free_throw(13, false);  // 13 is shot code for ENTER
          }
        }
        
      } else if(char_entered == 'R') {
        inputvalidator.innerText = "OFFENSIVE: player ## or M for team rebound or B for deadball\n" + "DEFENSIVE: D then player ## or DM for team rebound or DB for deadball";
      } else if(char_entered == 'D') {

      } else if(char_entered == 'M') {
        console.log(inputtext);
        if(inputtext.substring(1,2) == 'D') {
          inputvalidator.innerText = "Defensive team rebound. Press ENTER to save play.";
        } else {
          inputvalidator.innerText = "Offensive team rebound. Press ENTER to save play.";
        }
      } else if(char_entered == 'B') {
        if(inputtext.substring(1,2) == 'D') {
          inputvalidator.innerText = "Defensive deadball. Press ENTER to save play.";
        } else {
          inputvalidator.innerText = "Offensive deadball. Press ENTER to save play.";
        }
      } else if((!isNaN(char_entered) && inputtext.length == 3) || (!isNaN(char_entered) && inputtext.length == 4 && inputtext.substring(1,2) == 'D')) {
          var player_number = 0;
          if(inputtext.length == 3) {
            player_number = inputtext.substring(1,3);
          } else {
            player_number = inputtext.substring(2,4);
          }
          if(app.check_in_game(player_number, home)) {
            if(inputtext.substring(1,2) == 'D') {
              //app.rb_normal(inputtext);
              inputvalidator.innerText = "Defensive rebound for  #" + player_number + ". Press ENTER to save play.";
            } else {
              //app.rb_normal(inputtext);
              inputvalidator.innerText = "Offensive rebound for  #" + player_number + ". Press ENTER to save play.";
            }
            
          } else {
            inputvalidator.innerText = "Player #" + player_number + " is not in the game. Press ESC/F10 to clear input.";
          }
      }
    }, //end rebound method
    rb_normal(sequence) {
      console.log("inputtext:" + inputtext);
      var player_number = 0;
      if(inputtext.length == 8) { // R01ENTER is 8 characters
        player_number = inputtext.substring(1,3);
      } else {
        player_number = inputtext.substring(2,4);
      }
      if(inputtext.substring(1,2) == 'D') {
        if(!home) {
           for(index = 0; index < app.home_team.length; index++)
           {
              if(player_number == app.home_team[index].number)
              {
                  if(app.check_in_game(player_number, true)) {
                    app.home_team[index].rb_def += 1;
                    app.home_totals.rb_def += 1;
                    app.add_play("Defensive rebound by " + app.home_team[index].name);
                    app.home_possession();
                  } else {
                    inputvalidator.innerText = "Player #" + player_number + " is not in the game. Press ESC/F10 to clear input.";
                  }
                  
              }
           }
         }
         else {
           for(index = 0; index < app.vis_team.length; index++)
           {
              if(player_number == app.vis_team[index].number)
              {
                  if(app.check_in_game(player_number, false)) {
                    app.vis_team[index].rb_def += 1;
                    app.vis_totals.rb_def += 1;
                    app.add_play("Defensive rebound by " + app.vis_team[index].name);
                    app.vis_possession();
                  } else {
                    inputvalidator.innerText = "Player #" + player_number + " is not in the game. Press ESC/F10 to clear input.";
                  }
                  
              }
           }
         }
        // app.rb_normal(inputtext);
        // inputvalidator.innerText = "Defensive rebound for  #" + player_number + ". Press ENTER to save play.";
      } else {
        if(home) {
         for(index = 0; index < app.home_team.length; index++) {
            console.log("index, player_number:" + index + "," + player_number);
            if(player_number == app.home_team[index].number) {
              if(app.check_in_game(player_number, true)) {
                app.home_team[index].rb_off += 1;
                app.home_totals.rb_off += 1;
                app.add_play("Offensive rebound by " + app.home_team[index].name);
                app.home_possession();
              } else {
                inputvalidator.innerText = "Player #" + player_number + " is not in the game. Press ESC/F10 to clear input.";
              } 
            }
         }
      } else {
         for(index = 0; index < app.vis_team.length; index++) {
            if(player_number == app.vis_team[index].number) {
              if(app.check_in_game(player_number, false)) {
                app.vis_team[index].rb_off += 1;
                app.vis_totals.rb_off += 1;
                app.add_play("Offensive rebound by " + app.vis_team[index].name);
                app.vis_possession();
              } else {
                inputvalidator.innerText = "Player #" + player_number + " is not in the game. Press ESC/F10 to clear input.";
              }
            }
         }
       }
        // app.rb_normal(inputtext);
        // inputvalidator.innerText = "Offensive rebound for  #" + player_number + ". Press ENTER to save play.";
      }
    },
    rb_team(defensive_rebound) {
      if(defensive_rebound) {
        if(home) {
          app.vis_totals.rb_def += 1;
          app.vis_possession();
        } else {
          app.home_totals.rb_def += 1;
          app.home_possession();
        }

        app.add_play("Defensive Team Rebound");
      } else {
        if(home) {
          app.home_totals.rb_off += 1;
        } else {
          app.vis_totals.rb_off += 1;
        }
        app.add_play("Offensive Team Rebound");
      }
      // no possession change
    },
    rb_deadball(defensive_rebound) {
      if(defensive_rebound) {
        app.add_play("Defensive Deadball");
      } else {
        app.add_play("Offensive Deadball");
      }
      // change possession
      if(!home == defensive_rebound) {
          app.vis_possession();
      }
      else {
          app.home_possession();
      }
    },
    change_player_number(first_input, keyCode) {
    if(first_input) {
      inputtext = "F2";
      userinput.value = "F2";
      inputvalidator.innerText = "Enter H for home number change or V for visitor number change";
    } else {
      var char_entered = String.fromCharCode(keyCode); // will be upper case
      if(keyCode == 13) char_entered = "ENTER";
      console.log("char entered: *" + char_entered + "*");
      inputtext = inputtext + char_entered;
      if(char_entered == 'H') {
        inputvalidator.innerText = "Enter player number to change";
      } else if(char_entered == 'V') {
        inputvalidator.innerText = "Enter player number to change";
      } else if(!isNaN(char_entered) && inputtext.length == 5) {  // 5: length of the input with a player number: ex F2H34
        var old_number = inputtext.substring(3);
        var team_numbers = [];
        if(inputtext.substring(2,3) == 'H') {
          for(index = 0; index < app.home_team.length; index++) {
             team_numbers.push(app.home_team[index].number);
          }
        } else {
          for(index = 0; index < app.vis_team.length; index++) {
           team_numbers.push(app.vis_team[index].number);
         }
        }
        var number_is_valid = false;
        for(index = 0; index < team_numbers.length; index++) {
            if(old_number == team_numbers[index]) {
              number_is_valid = true;
              break;
            }
        }
        if(number_is_valid) {
          inputvalidator.innerText = "Enter new number";
        } else {
          inputvalidator.innerText = "Invalid number. No player has this number. Press ESC or F10 to clear input";
        }
      } else if(!isNaN(char_entered) && inputtext.length == 7) { // 7: length of the input with old and new player numbers: ex F2H3457
          var new_number = inputtext.substring(5);
          var team_numbers = [];
          if(inputtext.substring(2,3) == 'H') {
            for(index = 0; index < app.home_team.length; index++) {
              team_numbers.push(app.home_team[index].number);
            }
          } else {
            for(index = 0; index < app.vis_team.length; index++) {
            team_numbers.push(app.vis_team[index].number);
            }
          }
          if(team_numbers.includes(new_number)) {
              inputvalidator.innerText = "Invalid number. Another player already has this number. Press ESC or F10 to clear input";
          } else {
              inputvalidator.innerText = "Changing #" + inputtext.substring(3,5) + " to #" + inputtext.substring(5,7) + ". Press ENTER to save change.";
              if(inputtext.substring(2,3) == 'H') {
                  for(index = 0; index < team_numbers.length; index++) {
                    if(inputtext.substring(3,5) == team_numbers[index]) {
                      app.home_team[index].number = new_number;
                      break;
                    }
                  }
              } else {
                  for(index = 0; index < team_numbers.length; index++) {
                    if(inputtext.substring(3,5) == team_numbers[index]) {
                      app.vis_team[index].number = new_number;
                      break;
                    }
                  }
              }
          }
      } else if(char_entered == "ENTER") {
        //TODO save data to backend
      }

    }
  },
  log_free_throw(keyCode, switch_possession)
  {
      var char_entered = String.fromCharCode(keyCode); // will be upper case
      if(keyCode == 13) char_entered = "ENTER";
      inputtext = inputtext + char_entered;
      if(char_entered == "ENTER") {
        console.log("home before switch:" + home);
        if(!switch_possession) {
            home = !home;
          }
        console.log("home after switch:" + home);
        // if(inputtext.substring(2,3) == 'D') {
        //   home = !home;
        // }
        console.log(inputtext);
        if(inputtext.substring(3,4) == 'E') {
          if(home) {
            for(index = 0; index < app.home_team.length; index++) {
              if(ft_player_num == app.home_team[index].number) {
                app.home_team[index].ftm += 1;
                app.home_team[index].fta += 1;
                app.home_team[index].tp += 1;
                app.home_totals.ftm += 1;
                app.home_totals.fta += 1;
                app.home_totals.tp += 1;
                app.home_score += 1;
                app.add_play("Made free throw by " + app.home_team[index].name);
                home_stats.ftp = Number.parseFloat((app.home_totals.ftm/app.home_totals.fta)*100).toFixed(2);
              }
            }
            
          } else {
            for(index = 0; index < app.vis_team.length; index++) {
              if(ft_player_num == app.vis_team[index].number) {
                app.vis_team[index].ftm += 1;
                app.vis_team[index].fta += 1;
                app.vis_team[index].tp += 1;
                app.vis_totals.ftm += 1;
                app.vis_totals.fta += 1;
                app.vis_totals.tp += 1;
                app.vis_score += 1;
                app.add_play("Made free throw by " + app.vis_team[index].name);
                vis_stats.ftp = Number.parseFloat((app.vis_totals.ftm/app.vis_totals.fta)*100).toFixed(2);
              }
            }
          }
        } else if(inputtext.substring(3,4) == 'M') {
          if(home) {
          for(index = 0; index < app.home_team.length; index++) {
            if(ft_player_num == app.home_team[index].number) {
              app.home_team[index].fta += 1;
              app.home_totals.fta += 1;
              app.add_play("Missed free throw by " + app.home_team[index].name);
              home_stats.ftp = Number.parseFloat((app.home_totals.ftm/app.home_totals.fta)*100).toFixed(2);
            }
          }
        } else {
          for(index = 0; index < app.vis_team.length; index++) {
            if(ft_player_num == app.vis_team[index].number) {
              app.vis_team[index].fta += 1;
              app.vis_totals.fta += 1;
              app.add_play("Missed free throw by " + app.vis_team[index].name);
              vis_stats.ftp = Number.parseFloat((app.vis_totals.ftm/app.vis_totals.fta)*100).toFixed(2);
            }
          }
        }
        } else if(inputtext.substring(3,4) == 'R') {
          console.log("r pressed in free throw");
          var ft_player_num = inputtext.substring(1,3);
          if(home) {
            for(index = 0; index < app.home_team.length; index++) {
            if(ft_player_num == app.home_team[index].number) {
              app.home_team[index].fta += 1;
              app.home_totals.fta += 1;
              app.add_play("Missed free throw by " + app.home_team[index].name);
              home_stats.ftp = Number.parseFloat((app.home_totals.ftm/app.home_totals.fta)*100).toFixed(2);
            }
          }
          } else {
            for(index = 0; index < app.vis_team.length; index++) {
            if(ft_player_num == app.vis_team[index].number) {
              app.vis_team[index].fta += 1;
              app.vis_totals.fta += 1;
              app.add_play("Missed free throw by " + app.vis_team[index].name);
              vis_stats.ftp = Number.parseFloat((app.vis_totals.ftm/app.vis_totals.fta)*100).toFixed(2);
            }
          }
          }
        }
      } else if(char_entered == 'E' && inputtext.length < 4) {
        inputvalidator.innerText = "Free throw by player ##:";
      } else if(!isNaN(char_entered) && inputtext.length == 3) {
        ft_player_num = inputtext.substring(1,3);
        if(home) {
          var number_is_valid = false;
          for(index = 0; index < app.home_team.length; index++) {
            if(ft_player_num == app.home_team[index].number && app.check_in_game(ft_player_num, true)) {
              inputvalidator.innerText = "Free throw by #" + ft_player_num + ". Press E (made FT) or M (missed FT, no rebound) or R (missed FT, rebound).";
              number_is_valid = true;
            }
          }
          if(!number_is_valid) {
            inputvalidator.innerText = "Player #" + ft_player_num + " is not currently in the game. Press ESC/F10 to clear input.";
          }
        } else {
          for(index = 0; index < app.vis_team.length; index++) {
            if(ft_player_num == app.vis_team[index].number && app.check_in_game(ft_player_num, false)) {
              inputvalidator.innerText = "Free throw by #" + ft_player_num + ". Press E (made FT) or M (missed FT, no rebound) or R (missed FT, rebound).";
              number_is_valid = true;
            }
          }
          if(!number_is_valid) {
            inputvalidator.innerText = "Player #" + ft_player_num + " is not currently in the game. Press ESC/F10 to clear input.";
          }
        }
      } else if(char_entered == 'E' && inputtext.length == 4) {
        inputvalidator.innerText = "Made FT by player #" + ft_player_num + ". Press ENTER to save play.";
      } else if(char_entered == 'M' && inputtext.length == 4) {
        // miss, no rebound
        inputvalidator.innerText = "Missed FT by player #" + ft_player_num + ". Press ENTER to save play.";
      } else if(char_entered == 'R' && inputtext.length == 4) {
        //miss, rebound
        join_two_plays = inputtext;
        currentlyInputtingPlay = "rebound";
        inputtext = "";
        app.rebound(82);
      }
  },
  blocked_shot(keyCode, switch_possession)
  {
      var char_entered = String.fromCharCode(keyCode);
      if(keyCode == 13) char_entered = "ENTER";
      inputtext = inputtext + char_entered;
      if(char_entered == "ENTER") {
          var blocker = inputtext.substring(1,3);
          if(switch_possession) {
            home = !home;
          }
          if(!home) {
              for(index = 0; index < app.home_team.length; index++) {
                  console.log("blocker: " + blocker + " index_num: " + app.vis_team[index].number);
                  if(blocker == app.home_team[index].number && app.check_in_game(blocker, true)) {
                    app.home_team[index].blk += 1;
                    home_stats.blocks += 1;
                    app.vis_possession();
                    break;
                  }
              }
          }
          else {
            for(index = 0; index < app.vis_team.length; index++) {
                console.log("blocker: " + blocker + " index_num: " + app.vis_team[index].number);
                if(blocker == app.vis_team[index].number && app.check_in_game(blocker, false)) {
                  app.vis_team[index].blk += 1;
                  vis_stats.blocks += 1;
                  app.home_possession();
                  break;
                }
            }
          }
      } else if(char_entered == 'K') {
          inputvalidator.innerText = "Shot blocked by player ##:";
      } else if(!isNaN(char_entered) && inputtext.length == 3) {
          var blocker = inputtext.substring(1,3);
          var valid_number = false;
          if(!home) {
              for(index = 0; index < app.home_team.length; index++) {
                  if(blocker == app.home_team[index].number && app.check_in_game(blocker, true)) {
                    // inputvalidator.innerText = "Shot blocked by player #" + blocker + ". Press ENTER to save play.";
                    join_two_plays = inputtext;
                    currentlyInputtingPlay = "rebound";
                    inputtext = "";
                    app.rebound(82); // 82 is keycode for R
                    valid_number = true;
                    break;
                  }
              }
          }
          else {
            for(index = 0; index < app.vis_team.length; index++) {
                if(blocker == app.vis_team[index].number && app.check_in_game(blocker, false)) {
                  // inputvalidator.innerText = "Shot blocked by player #" + blocker + ". Press ENTER to save play.";
                  join_two_plays = inputtext;
                  currentlyInputtingPlay = "rebound";
                  inputtext = "";
                  app.rebound(82); // 82 is keycode for R
                  valid_number = true;
                  break;
                }
            }
          }
          if(!valid_number) {
              inputvalidator.innerText = "Player #" + blocker + " is not in the game. Press ESC/F10 to clear input.";
          }
      }
   }
}
})
