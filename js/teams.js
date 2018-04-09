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
}

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
