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
      $('#clockdiv #clockh2').html('20:00');
    } else if(period == 2) {
      app.period = 'Half 2';
      $('#clockdiv #clockh2').html('20:00');
    } else if(period == 'OT' || period == 'ot') {
      app.period = 'OT';
      $('#clockdiv #clockh2').html('05:00');
    } else if(period == '2OT' || period == '2ot') {
      app.period = '2OT';
      $('#clockdiv #clockh2').html('05:00');
    } else if(period == '3OT' || period == '3ot') {
      app.period = '3OT';
      $('#clockdiv #clockh2').html('05:00');
    } else if(period == '4OT' || period == '4ot') {
      app.period = '4OT';
      $('#clockdiv #clockh2').html('05:00');
    } else if(period == '5OT' || period == '5ot') {
      app.period = '5OT';
      $('#clockdiv #clockh2').html('05:00');
    } else if(period == '6OT' || period == '6ot') {
      app.period = '6OT';
      $('#clockdiv #clockh2').html('05:00');
    }
  }
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
                //{time: "19:85", team: "WISC", playdscrp: "Ethan Happ made a 3 point jumper", score: "100-2"},
                //{time: "18:45", team: "MINN", playdscrp: "Foul on Nate Mason", score: "2-100"}
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

     // J then (G | Q | Y | R | P) - Jump Shots
     else if(e.keyCode == 74) {
       altHeld = false;
       who_did_it = window.prompt("SHOT BY: (Key in a player ##)");
       while(!app.check_in_game(who_did_it)) {
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
             app.home_totals.fg += 1;
             app.home_totals.fa += 1;
             // add to home team score
             app.home_score += 2;
             // add to play by play - HOME
             app.playlist.unshift({ time: document.getElementById('clockh2').innerText, team: app.teams[0], playdscrp: `${app.home_team[index].name} made a jump shot`, score: app.home_score + "-" + app.vis_score })

             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.home_team.length; players++)
             {
               total_attempts += (app.home_team[players].fa + app.home_team[players].a3);
               total_fgs += (app.home_team[players].fg + app.home_team[players].m3);
             }
             home_stats.fg = (total_fgs/total_attempts)
             // change possession
             app.vis_possession();
             break;
           }
           // J then Y - good 3pt field goal
           else if((who_did_it == app.home_team[index].number && (result_code == "y" || result_code == "Y"))) {
             app.home_team[index].m3 += 1;
             app.home_team[index].a3 += 1;
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
             // add to play by play - HOME
             app.playlist.unshift({ time: document.getElementById('clockh2').innerText, team: app.teams[0], playdscrp: `${app.home_team[index].name} hit a 3-point jumper`, score: app.home_score + "-" + app.vis_score })
             // change possession
             app.vis_possession();
             break;
           }
           // J then R - missed shot (rebound)
           else if (who_did_it == app.home_team[index].number && (result_code == "r" || result_code == "R")) {
             app.home_team[index].fa += 1;
             app.home_totals.fa += 1;
             // add to play by play - HOME
             app.playlist.unshift({ time: document.getElementById('clockh2').innerText, team: app.teams[0], playdscrp: `${app.home_team[index].name} J -> R`, score: app.home_score + "-" + app.vis_score })
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
             app.home_totals.fa += 1;
             app.home_totals.fg += 1;
             home_stats.paint += 1;
             app.home_score += 2;
             app.playlist.unshift({ time: document.getElementById('clockh2').innerText, team: app.teams[0], playdscrp: `${app.home_team[index].name} made a shot in the paint`, score: app.home_score + "-" + app.vis_score })
             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.home_team.length; players++)
             {
               total_attempts += app.home_team[players].fa;
               total_fgs += (app.home_team[players].fg + app.home_team[players].m3);
             }
             home_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
             // change possession
             app.vis_possession();
           }
         }
       }
       else {
            //visitor calculations
       }
     }
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
           who_came_out = window.prompt("Player " + who_came_out + " is not in game\n\nENTER ## OF PLAYER LEAVING");
       }
       who_came_in = window.prompt("ENTER ## OF PLAYER ENTERING");

       // check if player is in game, and let them re-enter number if wrong
       while(app.check_in_game(who_came_in)) {
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
         app.playlist.unshift({ time: document.getElementById('clockh2').innerText, team: app.teams[0], playdscrp: `${app.home_team[came_in].name} subbed in for ${app.home_team[came_out].name}`, score: app.home_score + "-" + app.vis_score })
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
         app.playlist.unshift({ time: document.getElementById('clockh2').innerText, team: app.teams[1], playdscrp: `${app.vis_team[came_in].name} subbed in for ${app.vis_team[came_out].name}`, score: app.home_score + "-" + app.vis_score })
       }
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
   rebound() {
        who_got_it = window.prompt("REBOUNDED BY: \n\n OFFENSIVE: Key in a player ## \n OFFENSIVE TEAM REBOUND: M \n OFFENSIVE DEADBALL: B \n" +
            "DEFENSIVE: D \n DEFENSIVE TEAM REBOUND: DM \n DEFENSIVE DEADBALL: DB");

        String.prototype.isNumber = function(){return /^\d+$/.test(this);}

        //offensive
        if(who_got_it.isNumber()) {
           while(!app.check_in_game(who_got_it)) {
                who_got_it = window.prompt("Player " + who_got_it + " is not in the game!\n\n REBOUNDED BY OFFENSIVE: Key in a player ##");
           }
           if(home) {
             for(index = 0; index < app.home_team.length; index++)
             {
                if(who_got_it == app.home_team[index].number)
                {
                    app.home_team[index].rb += 1;
                }
             }
           }
           else {
             for(index = 0; index < app.vis_team.length; index++)
             {
                if(who_got_it == app.vis_team[index].number)
                {
                    app.vis_team[index].rb += 1;
                }
             }
           }
        }
        //offensive team rebound
        else if(who_got_it == "m" || who_got_it == "M") {
            // what does this increment?
        }
        //offensive deadball
        else if(who_got_it == "b" || who_got_it == "B") {
            // what does this increment?
        }
        // defensive
        else if(who_got_it == "d" || who_got_it == "D") {
            who_got_it = window.prompt("REBOUNDED BY: \n\n DEFENSIVE: Key in a player ##");
            if(who_got_it.isNumber()) {
               while(!app.check_in_game(who_got_it)) {
                    who_got_it = window.prompt("Player " + who_got_it + " is not in the game!\n\n REBOUNDED BY OFFENSIVE: Key in a player ##");
               }
               if(!home) {
                 for(index = 0; index < app.home_team.length; index++)
                 {
                    if(who_got_it == app.home_team[index].number)
                    {
                        app.home_team[index].rb += 1;
                    }
                 }
               }
               else {
                 for(index = 0; index < app.vis_team.length; index++)
                 {
                    if(who_got_it == app.vis_team[index].number)
                    {
                        app.vis_team[index].rb += 1;
                    }
                 }
               }
            }
        }
        //defensive team rebound
        else if(who_got_it == "dm" || who_got_it == "dM" || who_got_it == "DM" || who_got_it == "Dm") {
            // what does this increment?
        }
        //defensive deadball
        else if(who_got_it == "db" || who_got_it == "dB" || who_got_it == "DB" || who_got_it == "Db") {
            // what does this increment?
        }
   }
  }
})
