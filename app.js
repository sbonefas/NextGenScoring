var TESTING_MODE = false;  // this signals that you are in testing mode and will disable the annoying password promt that happens every time you load the page. Set this to false when in production mode!
var home = true;
var teams = ["Wisconsin"];
result_code_prompt = `
PRESS A RESULT CODE...

G (or Q) - GOOD FIELD GOAL               F - GOOD FG ON A FAST BREAK
Y - GOOD 3PT FIELD GOAL                  R - MISSED SHOT (REBOUND)
P - GOOD FG IN THE PAINT                  X - MISSED 3PT SHOT (REBOUND)
Z - GOOD FG- FAST BREAK & PAINT   K - BLOCKED SHOT
`;
help_menu = `HELP!!!!!`;

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
    message: 'Hello and welcome!',
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
                {in_game: "*", number: "01", name: "Player_1", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "02", name: "Player_2", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "03", name: "Player_3", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "04", name: "Player_4", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "05", name: "Player_5", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "06", name: "Bench_1", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "07", name: "Bench_2", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "08", name: "Bench_3", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "09", name: "Bench_4", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "10", name: "Bench_5", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
              ],
    home_totals: {in_game: " ", number: " ", name: "Totals", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},

    vis_team: [
                {in_game: "*", number: "01", name: "Player_1", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "02", name: "Player_2", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "03", name: "Player_3", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "04", name: "Player_4", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: "*", number: "05", name: "Player_5", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "06", name: "Bench_1", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "07", name: "Bench_2", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "08", name: "Bench_3", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "09", name: "Bench_4", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},
                {in_game: " ", number: "10", name: "Bench_5", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
              ],
    vis_totals: {in_game: " ", number: " ", name: "Totals", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0},

    playlist: [
                {time: "19:85", team: "WISC", playdscrp: "Ethan Happ made a 3 point jumper", score: "100-2"},
                {time: "18:45", team: "MINN", playdscrp: "Foul on Nate Mason", score: "2-100"}
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

     // j then (g | q | y | r) - Jump Shots
     else if(e.keyCode == 74) {
       altHeld = false;
       who_did_it = window.prompt("SHOT BY: (Key in a player ##)");
       result_code = window.prompt(result_code_prompt);
       if(home == true) {
         for(index = 0; index < app.home_team.length; index++)
         {
           // good field goal (2 points)
           if(who_did_it == app.home_team[index].number && (result_code == "g" || result_code == "G" || result_code == "q" || result_code == "Q"))
           {
             app.home_team[index].fg += 1;
             app.home_team[index].fa += 1;
             app.home_totals.fg += 1;
             app.home_totals.fa += 1;
             // add to home team score
             app.home_score += 2;
             // add to play by play - HOME
             app.playlist.push({ time: "00:00", team: "Home", playdscrp: "J -> G | Q", score: app.home_score + "-" + app.vis_score })

             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.home_team.length; players++)
             {
               total_attempts += app.home_team[players].fa
               total_fgs += app.home_team[players].fg
             }
             home_stats.fg = (total_fgs/total_attempts)
             break;
           }
           // good 3pt field goal
           else if((who_did_it == app.home_team[index].number && (result_code == "y" || result_code == "Y"))) {
             app.home_team[index].m3 += 1;
             app.home_totals.m3 += 1;
             app.home_team[index].fa += 1;
             app.home_totals.fa += 1;
             // add to home team score
             app.home_score += 3;
             // add to play by play - HOME
             app.playlist.push({ time: "00:00", team: "Home", playdscrp: "J -> Y", score: app.home_score + "-" + app.vis_score })
             break;
           }
           // missed shot (rebound)
           else if (who_did_it == home_team[index].number && (result_code == "r" || result_code == "R")) {
             app.home_team[index].fa += 1;
             app.home_totals.fa += 1;
             // add to play by play - HOME
             app.playlist.push({ time: "00:00", team: "Home", playdscrp: "J -> R", score: app.home_score + "-" + app.vis_score })
             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < app.home_team.length; players++)
             {
               total_attempts += app.home_team[players].fa;
               total_fgs += app.home_team[players].fg;
             }
             home_stats.fg = Number.parseFloat(total_fgs/total_attempts).toFixed(2);
             break;
           }
         }
       }
     }

     // h - home team
     else if(e.keyCode == 72) {
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
     }

     // v - Visitor team
     else if(e.keyCode == 86) {
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
     }

     // F6 - Substitution
     else if(e.keyCode == 117){
       who_came_out = window.prompt("ENTER ## OF PLAYER LEAVING");
       who_came_in = window.prompt("ENTER ## OF PLAYER ENTERING");
       if(home == true)
       {
         for(index = 0; index < app.home_team.length; index++)
         {
            if(who_came_out == app.home_team[index].number)
            {
              app.home_team[index].in_game = " "
            }
            if(who_came_in == app.home_team[index].number)
            {
              app.home_team[index].in_game = "*"
            }
         }
         // add to play by play - HOME
         app.playlist.push({ time: "00:00", team: "Home", playdscrp: `${who_came_out} -> ${who_came_in}`, score: app.home_score + "-" + app.vis_score })
       }
       else {
         // add to play by play - VISITOR
         app.playlist.push({ time: "00:00", team: "Visitor", playdscrp: `${who_came_out} -> ${who_came_in}`, score: app.home_score + "-" + app.vis_score })
       }
     }
   }
  }
})
// try using sort() to make the most recent play at top
