var TESTING_MODE = true;  // this signals that you are in testing mode and will disable the annoying password promt that happens every time you load the page. Set this to false when in production mode!
var home = true;

result_code_prompt = `
PRESS A RESULT CODE...

G (or Q) - GOOD FIELD GOAL               F - GOOD FG ON A FAST BREAK
Y - GOOD 3PT FIELD GOAL                  R - MISSED SHOT (REBOUND)
P - GOOD FG IN THE PAINT                  X - MISSED 3PT SHOT (REBOUND)
Z - GOOD FG- FAST BREAK & PAINT   K - BLOCKED SHOT
`;

help_menu = `HELP MENU: GAMETIME INPUT CODES AND KEYS

FIELD GOAL CODES                NON-FIELD GOAL CODES
    J - 2- or 3- point shot              E - Free Throw  K - Block
    Y - 3-point shot                        R - Rebound     T - Turnover
    D - Dunk                                    A - Assist          S - Steal
    L - Layup                                   F - Foul            O - Timeout
    P - Tip-in
    W - Wrong basket (defensive team scores in offensive team basket)

RESULT CODES
    G or Q - Good field goal (2- or 3-pointer)
    Y - Good 3-point field goal
    R - Missed field goal (followed by a rebound)
    X - Missed 3-point field goal (followed by a rebound)
    K - Missed field goal (due to a blocked shot)
    P - Made field goal in the paint
    F - Made field goal on a fast break
    Z - Made field goal in the paint on a fast break
    E - Made free throw

SPECIAL KEYS
    H or V - Select the home team or the visiting team
    C - Change time, period, stats
    F2 - Make "quick" roster changes to player numbers and names
    F6 - Make player substitutions
    F7 - Change the clock time
    F10 - Clear and do not complete any partially keyed action
    SPACEBAR - Start or Stop the Clock
    ESC - Return to Main Menu
`;

var home_stats = {fg: 0.0, tfg: 0.0, ftp: 0.0, tvs: 0, blocks: 0, steals: 0, paint: 0, offto: 0, sndch: 0, fastb: 0, fga: 0, tfga: 0}
Vue.component('home_team_stats', {
  template: `
  <div>
    <p>FG%: {{fg}}   3FG%: {{tfg}}   FT%: {{ftp}}</p>
    <p>TEAM: TURNVRS: {{tvs}}   BLOCKS: {{blocks}}   STEALS: {{steals}}</p>
    <p>paint: {{paint}}   offto: {{offto}}   2ndch: {{sndch}}   fastb: {{fastb}}</p>
  </div>
  `,
  data: function () {
    return home_stats
  }
})

var vis_stats = {fg: 0.0, tfg: 0.0, ftp: 0.0, tvs: 0, blocks: 0, steals: 0, paint: 0, offto: 0, sndch: 0, fastb: 0, fga: 0, tfga: 0}
Vue.component('vis_team_stats', {
  template: `
  <div>
    <p>FG%: {{fg}}   3FG%: {{tfg}}   FT%: {{ftp}}</p>
    <p>TEAM: TURNVRS: {{tvs}}   BLOCKS: {{blocks}}   STEALS: {{steals}}</p>
    <p>paint: {{paint}}   offto: {{offto}}   2ndch: {{sndch}}   fastb: {{fastb}}</p>
  </div>
  `,
  data: function () {
    return vis_stats
  }
})

window.onload = function () {
  if(!TESTING_MODE) {

    $(document.body).hide();
   var password = "";
   while(password != "123") {
    var password = prompt("Please enter the password to access this site.");
    if(password != "123") {
      alert("Incorrect password");
    }
   }
   if(password == "123") {
      $(document.body).show();
   }
  }

}

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

var app = new Vue({
  el: '#app',
  data: {
    teams: ["WISC", "AWAY"],
    period: 'Half 1',
    home_score: 0,
    home_fouls: 0,
    home_full: 0,
    home_partial: 0,
    vis_score: 0,
    vis_fouls: 0,
    vis_full: 0,
    vis_partial: 0,

    home_team: [
                {in_game: "*", number: "01", name: "Player_1", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "02", name: "Player_2", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "03", name: "Player_3", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "04", name: "Player_4", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "05", name: "Player_5", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "06", name: "Bench_1", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "07", name: "Bench_2", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "08", name: "Bench_3", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "09", name: "Bench_4", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "10", name: "Bench_5", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
              ],
    home_totals: {in_game: " ", number: " ", name: "Totals", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},

    vis_team: [
                {in_game: "*", number: "01", name: "Player_1", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "02", name: "Player_2", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "03", name: "Player_3", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "04", name: "Player_4", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "05", name: "Player_5", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "06", name: "Bench_1", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "07", name: "Bench_2", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "08", name: "Bench_3", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "09", name: "Bench_4", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "10", name: "Bench_5", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
              ],
    vis_totals: {in_game: " ", number: " ", name: "Totals", fg: 0, fa: 0, m3: 0, a3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},

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

     // alt + h - Help menu
     if(e.altKey && e.keyCode == 72) {
        window.alert(help_menu);
        altHeld = false;
     }

     // J then (G | Q | Y | R | P | Z | F | X | K) - Jump Shots
     else if(e.keyCode == 74) {
       altHeld = false;
       who_did_it = window.prompt("SHOT BY: (Key in a player ##)");
       while(!app.check_in_game(who_did_it)) {
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
             app.home_team[index].fg += 1;
             app.home_team[index].fa += 1;
             app.home_team[index].tp += 2;
             app.home_totals.fg += 1;
             app.home_totals.fa += 1;
             // add to home team score
             app.home_score += 2;
             app.home_totals.tp = app.home_score;
             // add to play by play - HOME
             app.add_play(`${app.home_team[index].name} made a jump shot`);

             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.home_team.length; players++)
             {
               total_attempts += (app.home_team[players].fa + app.home_team[players].a3);
               total_fgs += (app.home_team[players].fg + app.home_team[players].m3);
             }
             home_stats.fg = (total_fgs/total_attempts)
             app.assist()
             // change possession
             app.vis_possession();
             break;
           }
           // J then Y - good 3pt field goal
           else if((who_did_it == app.home_team[index].number && (result_code == "y" || result_code == "Y"))) {
             app.home_team[index].m3 += 1;
             app.home_team[index].a3 += 1;
             app.home_team[index].tp += 3;
             app.home_totals.m3 += 1;
             app.home_totals.a3 += 1;
             app.home_team[index].fa += 1;
             app.home_team[index].fg += 1;
             app.home_totals.fa += 1;
             var total_attempts = 0;
             var total_fgs = 0;
             var total_threes_attmept = 0;
             var total_threes = 0;
             for(players = 0; players < app.home_team.length; players++)
             {
               total_attempts += (app.home_team[players].fa + app.home_team[players].a3);
               total_fgs += (app.home_team[players].fg + app.home_team[players].m3);
               total_threes += app.home_team[players].m3;
               total_threes_attmept += app.home_team[players].a3;
             }
             home_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
             home_stats.tfg = Number.parseFloat(total_threes/total_threes_attmept).toFixed(2);
             // add to home team score
             app.home_score += 3;
             app.home_totals.tp = app.home_score;
             // add to play by play - HOME
             app.add_play(`${app.home_team[index].name} hit a 3-point jumper`);
             app.assist()
             // change possession
             app.vis_possession();
             break;
           }
           // J then R - missed shot (rebound)
           else if (who_did_it == app.home_team[index].number && (result_code == "r" || result_code == "R")) {
             app.home_team[index].fa += 1;
             app.home_totals.fa += 1;
             // add to play by play - HOME
             app.add_play(`${app.home_team[index].name} J -> R`);
             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.home_team.length; players++)
             {
               total_attempts += (app.home_team[players].fa + app.home_team[players].a3);
               total_fgs += (app.home_team[players].fg + app.home_team[players].m3);
             }
             home_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
             app.rebound();
             break;
           }
           // J then P - field goal in the paint
           else if (who_did_it == app.home_team[index].number && (result_code == "p" || result_code == "P")) {
             app.home_team[index].fa += 1;
             app.home_team[index].fg += 1;
             app.home_team[index].tp += 2;
             app.home_totals.fa += 1;
             app.home_totals.fg += 1;
             home_stats.paint += 1;
             app.home_score += 2;
             app.home_totals.tp = app.home_score;
             app.add_play(`${app.home_team[index].name} made a shot in the paint`);
             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.home_team.length; players++)
             {
               total_attempts += app.home_team[players].fa;
               total_fgs += (app.home_team[players].fg + app.home_team[players].m3);
             }
             home_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
             app.assist()
             // change possession
             app.vis_possession();
           }
           // J then Z - GOOD FG-FAST BREAK & PAINT
           else if (who_did_it == app.home_team[index].number && (result_code == "z" || result_code == "Z")) {
                //update boxscore
                app.home_team[index].fg += 1;
                app.home_team[index].fa += 1;
                app.home_team[index].tp += 2;
                app.home_score += 2;
                app.home_totals.tp = app.home_score;
                app.home_totals.fg += 1;
                app.home_totals.fa += 1;

                // update fast break and in the paint
                home_stats.fastb += 1;
                home_stats.paint += 1;

                // add to playby play
                 app.add_play(`Fast Break: ${app.home_team[index].name} made a shot in the paint`);
                 var total_attempts = 0;
                 var total_fgs = 0;
                 for(players = 0; players < app.home_team.length; players++)
                 {
                   total_attempts += app.home_team[players].fa;
                   total_fgs += (app.home_team[players].fg + app.home_team[players].m3);
                 }
                 home_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
                 app.assist()
                 // change possession
                 app.vis_possession();
           }
           // J then F - GOOD FG ON A FAST BREAK
           else if (who_did_it == app.home_team[index].number && (result_code == "f" || result_code == "F")) {
                console.log("J->F");
           }
           // J then X - MISSED 3PT SHOT (REBOUND)
           else if (who_did_it == app.home_team[index].number && (result_code == "x" || result_code == "X")) {
                console.log("J->X");
           }
           // J then K - BLOCKED SHOT
           else if (who_did_it == app.home_team[index].number && (result_code == "k" || result_code == "K")) {
                console.log("J->K");
           }
         }
       } //end home calculations
       else {  // Visitor calculations
         for(index = 0; index < app.vis_team.length; index++)
         {
         console.log(who_did_it);
           // J then G or Q - good field goal (2 points)
           if(who_did_it == app.vis_team[index].number && (result_code == "g" || result_code == "G" || result_code == "q" || result_code == "Q"))
           {
             app.vis_team[index].fg += 1;
             app.vis_team[index].fa += 1;
             app.vis_team[index].tp += 2;
             app.vis_totals.fg += 1;
             app.vis_totals.fa += 1;
             // add to vis team score
             app.vis_score += 2;
             app.vis_totals.tp = app.vis_score;
             // add to play by play - VIS
             app.add_play(`${app.vis_team[index].name} made a jump shot`);

             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.vis_team.length; players++)
             {
               total_attempts += (app.vis_team[players].fa + app.vis_team[players].a3);
               total_fgs += (app.vis_team[players].fg + app.vis_team[players].m3);
             }
             vis_stats.fg = (total_fgs/total_attempts)
             // change possession
             app.home_possession();
             break;
           }
           // J then Y - good 3pt field goal
           else if((who_did_it == app.vis_team[index].number && (result_code == "y" || result_code == "Y"))) {
             app.vis_team[index].m3 += 1;
             app.vis_team[index].a3 += 1;
             app.vis_team[index].tp += 3;
             app.vis_totals.m3 += 1;
             app.vis_totals.a3 += 1;
             app.vis_team[index].fa += 1;
             app.vis_team[index].fg += 1;
             app.vis_totals.fa += 1;
             var total_attempts = 0;
             var total_fgs = 0;
             var total_threes_attmept = 0;
             var total_threes = 0;
             for(players = 0; players < app.vis_team.length; players++)
             {
               total_attempts += (app.vis_team[players].fa + app.vis_team[players].a3);
               total_fgs += (app.vis_team[players].fg + app.vis_team[players].m3);
               total_threes += app.vis_team[players].m3;
               total_threes_attmept += app.vis_team[players].a3;
             }
             vis_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
             vis_stats.tfg = Number.parseFloat(total_threes/total_threes_attmept).toFixed(2);
             // add to vis team score
             app.vis_score += 3;
             app.vis_totals.tp = app.vis_score;
             // add to play by play - VIS
             app.add_play(`${app.vis_team[index].name} hit a 3-point jumper`);
             // change possession
             app.home_possession();
             break;
           }
           // J then R - missed shot (rebound)
           else if (who_did_it == app.vis_team[index].number && (result_code == "r" || result_code == "R")) {
             app.vis_team[index].fa += 1;
             app.vis_totals.fa += 1;
             // add to play by play - VIS
             app.add_play(`${app.vis_team[index].name} J -> R`);
             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.vis_team.length; players++)
             {
               total_attempts += (app.vis_team[players].fa + app.vis_team[players].a3);
               total_fgs += (app.vis_team[players].fg + app.vis_team[players].m3);
             }
             vis_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
             app.rebound();
             break;
           }
           // J then P - field goal in the paint
           else if (who_did_it == app.vis_team[index].number && (result_code == "p" || result_code == "P")) {
             app.vis_team[index].fa += 1;
             app.vis_team[index].fg += 1;
             app.vis_team[index].tp += 2;
             app.vis_totals.fa += 1;
             app.vis_totals.fg += 1;
             vis_stats.paint += 1;
             app.vis_score += 2;
             app.vis_totals.tp = app.vis_score;
             app.add_play(`${app.vis_team[index].name} made a shot in the paint`);
             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.vis_team.length; players++)
             {
               total_attempts += app.vis_team[players].fa;
               total_fgs += (app.vis_team[players].fg + app.vis_team[players].m3);
             }
             vis_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
             // change possession
             app.home_possession();
           }
           // J then Z - GOOD FG-FAST BREAK & PAINT
           else if (who_did_it == app.home_team[index].number && (result_code == "z" || result_code == "Z")) {
                //update boxscore
                app.vis_team[index].fg += 1;
                app.vis_team[index].fa += 1;
                app.vis_team[index].tp += 2;
                app.vis_score += 2;
                app.vis_totals.tp = app.vis_score;
                app.vis_totals.fg += 1;
                app.vis_totals.fa += 1;

                // update fast break and in the paint
                vis_stats.fastb += 1;
                vis_stats.paint += 1;

                // add to playby play
                 app.add_play(`Fast Break: ${app.vis_team[index].name} made a shot in the paint`);
                 var total_attempts = 0;
                 var total_fgs = 0;
                 for(players = 0; players < app.vis_team.length; players++)
                 {
                   total_attempts += app.vis_team[players].fa;
                   total_fgs += (app.vis_team[players].fg + app.vis_team[players].m3);
                 }
                 vis_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
                 app.assist()
                 // change possession
                 app.home_possession();
           }
           // J then F - GOOD FG ON A FAST BREAK
           else if (who_did_it == app.vis_team[index].number && (result_code == "f" || result_code == "F")) {
                //update boxscore
                app.vis_team[index].fg += 1;
                app.vis_team[index].fa += 1;
                app.vis_team[index].tp += 2;
                app.vis_score += 2;
                app.vis_totals.tp = app.vis_score;
                app.vis_totals.fg += 1;
                app.vis_totals.fa += 1;

                // update fast break
                vis_stats.fastb += 1;

                // add to playby play
                 app.add_play(`Fast Break: ${app.vis_team[index].name} made a shot`);
                 var total_attempts = 0;
                 var total_fgs = 0;
                 for(players = 0; players < app.vis_team.length; players++)
                 {
                   total_attempts += app.vis_team[players].fa;
                   total_fgs += (app.vis_team[players].fg + app.vis_team[players].m3);
                 }
                 vis_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
                 app.assist()
                 // change possession
                 app.home_possession();
           }
           // J then X - MISSED 3PT SHOT (REBOUND)
           else if (who_did_it == app.vis_team[index].number && (result_code == "x" || result_code == "X")) {
                console.log("J->X");
           }
           // J then K - BLOCKED SHOT
           else if (who_did_it == app.vis_team[index].number && (result_code == "k" || result_code == "K")) {
                console.log("J->K");
           }
         }
       }//end visitor calculations
     }// end J
     // H or left arrow - home team
     else if(e.keyCode == 72 || e.keyCode == 37) {
        app.home_possession();
     }
     // V or right arrow - Visitor team
     else if(e.keyCode == 86 || e.keyCode == 39) {
        app.vis_possession();
     }
     // F6 - Substitution
     else if(e.keyCode == 117){
       who_came_out = window.prompt("ENTER ## OF PLAYER LEAVING");
       // check if player is in game, and let them re-enter number if wrong
       while(!app.check_in_game(who_came_out)) {
           if(who_came_out == null) {
                return;
           }
           who_came_out = window.prompt("Player " + who_came_out + " is not in game\n\nENTER ## OF PLAYER LEAVING");
       }
       who_came_in = window.prompt("ENTER ## OF PLAYER ENTERING");

       // check if player is in game, and let them re-enter number if wrong
       while(app.check_in_game(who_came_in)) {
           if(who_came_in == null) {
                return
           }
           who_came_in = window.prompt("Player " + who_came_in + " is already in game\n\nENTER ## OF PLAYER ENTERING");
       }

       if(home == true)
       {
         for(index = 0; index < app.home_team.length; index++)
         {
            if(who_came_out == app.home_team[index].number)
            {
              app.home_team[index].in_game = " "
              var came_out = index;
            }
            if(who_came_in == app.home_team[index].number)
            {
              app.home_team[index].in_game = "*"
              var came_in = index;
            }
         }
         // add to play by play - HOME
         app.add_play(`${app.home_team[came_in].name} subbed in for ${app.home_team[came_out].name}`);
       }
       else {
         for(index = 0; index < app.vis_team.length; index++)
         {
            if(who_came_out == app.vis_team[index].number)
            {
              app.vis_team[index].in_game = " "
              var came_out = index;
            }
            if(who_came_in == app.vis_team[index].number)
            {
              app.vis_team[index].in_game = "*"
              var came_in = index;
            }
         }
         // add to play by play - VISITOR
         app.add_play(`${app.vis_team[came_in].name} subbed in for ${app.vis_team[came_out].name}`);
       }
     }
     // F2 - change player jersey number
     else if(e.keyCode == 113) {
       app.change_player_number();
     }
     // F10 - clear and do not complete any partially keyed action
     else if(e.keyCode == 121) {

     }

     // E - Free Throw
     else if(e.keyCode == 69) {

     }

     // F - Foul
     else if(e.keyCode == 70) {
      app.foul();
     }

     // T - turnover
     else if(e.keyCode == 84) {

     }

     // R - rebound
     else if(e.keyCode == 82) {
        app.rebound();
     }

     // A - assist
     else if(e.keyCode == 65) {
        app.assist();
     }

     // S - steal
     else if(e.keyCode == 83) {

     }

     // K - blocked shot
     else if(e.keyCode == 75) {

     }

     // O - timeout
     else if(e.keyCode == 79) {

     }

     // C - Change time, period, stats
     else if(e.keyCode == 67) {

     }

     // Esc - Return to main menu
     else if(e.keyCode == 27) {

     }

   }, //end keycode method
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
   check_in_game(number) {
       if(home) {
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
   },
   assist() {
        who_assist = window.prompt("ASSIST BY: \n\n Key in a player ## or press ENTER for no assist");

        String.prototype.isNumber = function(){return /^\d+$/.test(this);}

        if(who_assist.isNumber()) {
           while(!app.check_in_game(who_assist)) {
               if(who_assist == null) {
                    return
               }
                who_assist = window.prompt("Player " + who_assist + " is not in the game!\n\n ASSIST BY OFFENSIVE: Key in a player ## or press ENTER for no assist");
           }
           if(home) {
             for(index = 0; index < app.home_team.length; index++)
             {
                if(who_assist == app.home_team[index].number)
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
                if(who_assist == app.vis_team[index].number)
                {
                    app.vis_team[index].as += 1;
                    app.vis_totals.as += 1;
                    app.add_play("Assist by " + app.vis_team[index].name);
                }
             }
           }
        }
        else if(who_assist == "") {
            // Enter - no assist
        }
   },
   foul() {
        var team = window.prompt("Foul on Home or Visiting team?\nEnter H for Home or V for Visitor"); // team will be h or v
        var valid_team = false;
        if(team == 'h' || team == 'H' || team == 'v' || team == 'V') {
          valid_team = true;
        }
        if(!valid_team) {
          window.alert("Please select H or V");
        }
        if(valid_team) {
          var player = window.prompt("Foul on: (Key in a player ##:\nFor a technical, press T and a player ## or B for bench");
        }
        if(team == 'h' || team == 'H') {
          home = true;
          if(player.charAt(0) == 't' || player.charAt(0) == 'T') { // technical foul TODO figure out if we have to store any info on technicals
            var player_number = player.substring(1,3);
            for(index = 0; index < app.home_team.length; index++)
             {
                if(player_number == app.home_team[index].number)
                {
                    app.home_team[index].pf += 1;
                    app.add_play("Foul on " + app.home_team[index].name);
                }
             }
          }
          if(player.charAt(0) == 'b' || player.charAt(0) == 'B') { // bench foul
            
          }
          var player_number = player.substring(0,2);
            for(index = 0; index < app.home_team.length; index++)
             {
                if(player_number == app.home_team[index].number)
                {
                    app.home_team[index].pf += 1;
                    app.add_play("Foul on " + app.home_team[index].name);
                }
             }
             app.home_totals.pf += 1
             app.vis_possession(); // switch possession
        }
        if(team == 'v' || team == 'V') {
          home = false;
          if(player.charAt(0) == 't' || player.charAt(0) == 'T') { // technical foul TODO figure out if we have to store any info on technicals
            var player_number = player.substring(1,3);
            for(index = 0; index < app.vis_team.length; index++)
             {
                if(player_number == app.vis_team[index].number)
                {
                    app.vis_team[index].pf += 1;
                    app.add_play("Foul on " + app.vis_team[index].name);
                }
             }
          }
          if(player.charAt(0) == 'b' || player.charAt(0) == 'B') { // bench foul
            
          }
          var player_number = player.substring(0,2);
            for(index = 0; index < app.vis_team.length; index++)
             {
                if(player_number == app.vis_team[index].number)
                {
                    app.vis_team[index].pf += 1;
                    app.add_play("Foul on " + app.vis_team[index].name);
                }
             }
             app.vis_totals.pf += 1
             app.home_possession(); // switch possession
        }

   },
   rebound() {
        who_got_it = window.prompt("REBOUNDED-- \n\n OFFENSIVE: Key in a player ## or M for team rebound or B for deadball" +
            "DEFENSIVE: D then player ## or DM for team rebound or DB for deadball");

        String.prototype.isNumber = function(){return /^\d+$/.test(this);}

        //offensive
        if(who_got_it.isNumber()) {
           while(!app.check_in_game(who_got_it)) {
               if(who_got_it == null) {
                    return
               }
                who_got_it = window.prompt("Player " + who_got_it + " is not in the game!\n\n REBOUNDED BY OFFENSIVE: Key in a player ##");
           }
           if(home) {
             for(index = 0; index < app.home_team.length; index++)
             {
                if(who_got_it == app.home_team[index].number)
                {
                    app.home_team[index].rb += 1;
                    app.home_totals.rb += 1;
                    app.add_play("Offensive rebound by " + app.home_team[index].name);
                }
             }
           }
           else {
             for(index = 0; index < app.vis_team.length; index++)
             {
                if(who_got_it == app.vis_team[index].number)
                {
                    app.vis_team[index].rb += 1;
                    app.vis_totals.rb += 1;
                    app.add_play("Offensive rebound by " + app.vis_team[index].name);
                }
             }
           }
        }
        //offensive team rebound
        else if(who_got_it == "m" || who_got_it == "M") {
            // add to play by play
            app.add_play("Offensive Team Rebound");
            // no possession change
        }
        //offensive deadball
        else if(who_got_it == "b" || who_got_it == "B") {
            // add to play by play
            app.add_play("Offensive Deadball");
            // change possession
            if(home) {
                app.vis_possession();
            }
            else {
                app.home_possession();
            }
        }
        // defensive
        else if(who_got_it == "d" || who_got_it == "D") {
            who_got_it = window.prompt("REBOUNDED BY: \n\n DEFENSIVE: Key in a player ##");
            if(who_got_it.isNumber()) {
               while(!app.check_in_game(who_got_it)) {
                   if(who_got_it == null) {
                        return
                   }
                    who_got_it = window.prompt("Player " + who_got_it + " is not in the game!\n\n REBOUNDED BY OFFENSIVE: Key in a player ##");
               }
                // change possession
                if(home) {
                    app.vis_possession();
                }
                else {
                    app.home_possession();
                }

               if(home) {
                 for(index = 0; index < app.home_team.length; index++)
                 {
                    if(who_got_it == app.home_team[index].number)
                    {
                        app.home_team[index].rb += 1;
                        app.home_totals.rb += 1;
                        app.add_play("Defensive rebound by " + app.home_team[index].name);
                    }
                 }
               }
               else {
                 for(index = 0; index < app.vis_team.length; index++)
                 {
                    if(who_got_it == app.vis_team[index].number)
                    {
                        app.vis_team[index].rb += 1;
                        app.vis_totals.rb += 1;
                        app.add_play("Defensive rebound by " + app.vis_team[index].name);
                    }
                 }
               }
            }
        }
        //defensive team rebound
        else if(who_got_it == "dm" || who_got_it == "dM" || who_got_it == "DM" || who_got_it == "Dm") {
            // add to play by play
            app.add_play("Defensive Team Rebound");
            // change posession
            if(home) {
                app.vis_possession();
            }
            else {
                app.home_possession();
            }
        }
        //defensive deadball
        else if(who_got_it == "db" || who_got_it == "dB" || who_got_it == "DB" || who_got_it == "Db") {
            // add to play by play
            app.add_play("Defensive Deadball");
            // no change in posession
        }
    }, //end rebound method
    change_player_number() {
       var team = window.prompt("ENTER TEAM TO CHANGE PLAYER NUMBER (H: HOME   V: VISITOR)");
       team_numbers = [];
       var number = window.prompt("ENTER PLAYER ## TO CHANGE");
       if(team == 'h' || team == 'H')
       {
           for(index = 0; index < app.home_team.length; index++)
           {
             team_numbers.push(app.home_team[index].number);
           }
           for(index = 0; index < app.home_team.length; index++)
           {
               if(app.home_team[index].number == number)
               {
                 var new_number;
                 while(team_numbers.includes(new_number) || new_number == null)
                 {
                   new_number = window.prompt("ENTER NEW PLAYER ##");
                 }
                 app.home_team[index].number = new_number;
                 break;
               }
           }
       }
       else if(team == 'v' || team == 'V')
       {
         for(index = 0; index < app.vis_team.length; index++)
         {
           team_numbers.push(app.vis_team[index].number);
         }
         for(index = 0; index < app.vis_team.length; index++)
         {
             if(app.vis_team[index].number == number)
             {
               var new_number;
               while(team_numbers.includes(new_number) || new_number == null)
               {
                 new_number = window.prompt("ENTER NEW PLAYER ##");
               }
               app.vis_team[index].number = new_number;
               break;
             }
         }
    }
  }    
   }
})
