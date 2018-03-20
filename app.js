var home_1 = {in_game: "*", number: "01", name: "Player_1", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_2 = {in_game: "*", number: "02", name: "Player_2", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_3 = {in_game: "*", number: "03", name: "Player_3", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_4 = {in_game: "*", number: "04", name: "Player_4", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_5 = {in_game: "*", number: "05", name: "Player_5", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_6 = {in_game: " ", number: "06", name: "Bench_1", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_7 = {in_game: " ", number: "07", name: "Bench_2", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_8 = {in_game: " ", number: "08", name: "Bench_3", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_9 = {in_game: " ", number: "09", name: "Bench_4", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_10 = {in_game: " ", number: "10", name: "Bench_5", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_totals = {in_game: " ", number: " ", name: "Totals", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}

var home_team = [home_1, home_2, home_3, home_4, home_5, home_6, home_7, home_8, home_9, home_10];
var home = true;
var altHeld = false;
var teams = ["Wisconsin"];
result_code_prompt = `
PRESS A RESULT CODE...

G (or Q) - GOOD FIELD GOAL               F - GOOD FG ON A FAST BREAK
Y - GOOD 3PT FIELD GOAL                  R - MISSED SHOT (REBOUND)
P - GOOD FG IN THE PAINT                  X - MISSED 3PT SHOT (REBOUND)
Z - GOOD FG- FAST BREAK & PAINT   K - BLOCKED SHOT
`;
help_menu = `HELP!!!!!`;

// Vue components for home players
Vue.component('player_h01', {
  template: `<table cellpadding="3" class="playerstats">
                <tr>
                    <td> {{in_game}} </td>
                    <td> {{number}} </td>
                    <td> {{name}} </td>
                    <td> {{fg}} </td>
                    <td> {{fa}} </td>
                    <td> {{m3}} </td>
                    <td> {{ftm}} </td>
                    <td> {{fta}} </td>
                    <td> {{rb}} </td>
                    <td> {{as}} </td>
                    <td> {{pf}} </td>
                    <td> {{tp}} </td>
                </tr>
             </table>`,
  data: function () {
    return home_1
  }
})
Vue.component('player_h02', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_2
  }
})
Vue.component('player_h03', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_3
  }
})
Vue.component('player_h04', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_4
  }
})
Vue.component('player_h05', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_5
  }
})
Vue.component('player_h06', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_6
  }
})
Vue.component('player_h07', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_7
  }
})
Vue.component('player_h08', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_8
  }
})
Vue.component('player_h09', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_9
  }
})
Vue.component('player_h10', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_10
  }
})
Vue.component('player_total', {
  template: `
           <table cellpadding="3">
             <tr>
               <td> {{in_game}} </td>
               <td> {{number}} </td>
               <td> {{name}} </td>
               <td> {{fg}} </td>
               <td> {{fa}} </td>
               <td> {{m3}} </td>
               <td> {{ftm}} </td>
               <td> {{fta}} </td>
               <td> {{rb}} </td>
               <td> {{as}} </td>
               <td> {{pf}} </td>
               <td> {{tp}} </td>
             </tr>
           </table>`,
  data: function () {
    return home_totals
  }
})



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

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello and welcome!',
    home_score: 0,
    home_fouls: 0,
    home_full: 0,
    home_partial: 0,
    vis_score: 0,
    vis_fouls: 0,
    vis_full: 0,
    vis_partial: 0,

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
     if(e.keyCode == 18) {
        altHeld = true;
     }
     if(altHeld && e.keyCode == 72) {
        window.alert(help_menu);
        altHeld = false;
     }
     //BUG: if press alt then not h, altHeld is still true

     // j then (g | q | y | r) - Jump Shots
     else if(e.keyCode == 74) {
       altHeld = false;
       who_did_it = window.prompt("SHOT BY: (Key in a player ##)");
       result_code = window.prompt(result_code_prompt);
       if(home == true) {
         for(index = 0; index < home_team.length; index++)
         {
           // good field goal (2 points?)
           if(who_did_it == home_team[index].number && (result_code == "g" || result_code == "G" || result_code == "q" || result_code == "Q"))
           {
             home_team[index].fg += 1;
             home_team[index].fa += 1;
             home_totals.fg += 1;
             home_totals.fa += 1;
             // add to home team score
             app.home_score += 2; // add 2 or 3?
             // add to play by play - HOME
             app.playlist.push({ time: "00:00", team: "Home", playdscrp: "J -> G | Q", score: app.home_score + "-" + app.vis_score })

             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < home_team.length; players++)
             {
               total_attempts += home_team[players].fa
               total_fgs += home_team[players].fg
             }
             home_stats.fg = (total_fgs/total_attempts)
             break;
           }
           // good 3pt field goal
           else if((who_did_it == home_team[index].number && (result_code == "y" || result_code == "Y"))) {
             home_team[index].m3 += 1;
             home_totals.m3 += 1;
             home_team[index].fa += 1;
             home_totals.fa += 1;
             // add to home team score
             app.home_score += 3;
             // add to play by play - HOME
             app.playlist.push({ time: "00:00", team: "Home", playdscrp: "J -> Y", score: app.home_score + "-" + app.vis_score })
             break;
           }
           // missed shot (rebound)
           else if (who_did_it == home_team[index].number && (result_code == "r" || result_code == "R")) {
             home_team[index].fa += 1;
             home_totals.fa += 1;
             // add to play by play - HOME
             app.playlist.push({ time: "00:00", team: "Home", playdscrp: "J -> R", score: app.home_score + "-" + app.vis_score })
             var total_attempts = 0;
             var total_fgs = 0;
             for(players = 0; players < home_team.length; players++)
             {
               total_attempts += home_team[players].fa;
               total_fgs += home_team[players].fg;
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

     // s - Substitution
     else if(e.keyCode == 83){
       who_came_out = window.prompt("ENTER ## OF PLAYER LEAVING");
       who_came_in = window.prompt("ENTER ## OF PLAYER ENTERING");
       if(home == true)
       {
         for(index = 0; index < home_team.length; index++)
         {
            if(who_came_out == home_team[index].number)
            {
              home_team[index].in_game = " "
            }
            if(who_came_in == home_team[index].number)
            {
              home_team[index].in_game = "*"
            }
         }
         // add to play by play - HOME
         app.playlist.push({ time: "00:00", team: "Home", playdscrp: "Sub", score: "" })
       }
       else {
         // add to play by play - VISITOR
         app.playlist.push({ time: "00:00", team: "Visitor", playdscrp: "Sub", score: "" })
       }
     }
   }
  }
})
// try using sort() to make the most recent play at top