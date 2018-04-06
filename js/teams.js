var app = new Vue({
  el: '#team_app',
  data: {
    message: "SELECT A TEAM",
    teams: [
            {name: "WISCONSIN"},
            {name: "MARQUETTE"},
            {name: "MINNESOTA"},
            {name: "PURDUE"},
            {name: "MARYLAND"},
            {name: "NORTHWESTERN"},
            {name: "ILLINOIS"},
            {name: "INDIANA"},
            {name: "MICHIGAN STATE"},
            {name: "MICHIGAN"},
            {name: "PURDUE"},
            {name: "MARYLAND"},
            {name: "NORTHWESTERN"},
            {name: "ILLINOIS"},
            {name: "INDIANA"},
            {name: "MICHIGAN STATE"},
            {name: "MICHIGAN"},
            {name: "INDIANA"},
            {name: "MICHIGAN STATE"},
            {name: "MICHIGAN"},
            {name: ""},
            {name: ""}
          ],
    roster_options: [
      {name: "<ENTER> - EDIT TEAM"},
      {name: "N - CREATE NEW TEAM"},
      {name: "F9 - DELETE TEAM"}
    ]
  }
})
