var number = {in_game: " ", number: "1", name: "Wood", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var number_2 = {in_game: "*", number: "2", name: "Not Wood", fg: 0, fa: 0, m3: 0, ftm: 0, fta: 0, rb: 0, as: 0, pf: 0, tp: 0}
var home_team = [number, number_2];
var home = true;
var teams = ["Wisconsin"];
result_code_prompt = `
PRESS A RESULT CODE...

G (or Q) - GOOD FIELD GOAL               F - GOOD FG ON A FAST BREAK
Y - GOOD 3PT FIELD GOAL                  R - MISSED SHOT (REBOUND)
P - GOOD FG IN THE PAINT                  X - MISSED 3PT SHOT (REBOUND)
Z - GOOD FG- FAST BREAK & PAINT   K - BLOCKED SHOT
`;
Vue.component('player', {
  template: `<table cellpadding="5">
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
    return number
  }
})
Vue.component('player_2', {
  template: `
           <table cellpadding="5">
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
    return number_2
  }
})
var home_stats = {fg: 0.0, tfg: 0.0, ftp: 0.0, tvs: 0, blocks: 0, steals: 0, paint: 0, offto: 0, sndch: 0, fastb: 0}
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
    message: 'Hello and welcome!'
  },
  created() {
   document.addEventListener('keydown', this.keyevent);
  },
  methods: {
   keyevent(e) {
     console.log(e.keyCode);
     if(e.keyCode == 74) {
       who_did_it = window.prompt("SHOT BY: (Key in a player ##)");
       result_code = window.prompt(result_code_prompt);
       if(home == true) {
         for(index = 0; index < home_team.length; index++)
         {
           if(who_did_it == home_team[index].number && (result_code == "g" || result_code == "G" || result_code == "q" || result_code == "Q"))
           {
             home_team[index].fg += 1;
             home_team[index].fa += 1;
             break;
           }
           else if((who_did_it == home_team[index].number && (result_code == "y" || result_code == "Y"))) {
             home_team[index].m3 += 1;
             home_team[index].fa += 1;
             break;
           }
         }
       }
     }
     else if(e.keyCode == 72) {
       window.alert("RECORDING HOME TEAM");
       home = true;
     }
     else if(e.keyCode == 86) {
       window.alert("RECORDING VISITING TEAM");
       home = false
     }
   }
  }
})
