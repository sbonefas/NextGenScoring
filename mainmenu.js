var TESTING_MODE = false;  // this signals that you are in testing mode and will disable the annoying password promt that happens every time you load the page. Set this to false when in production mode!

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

var app = new Vue({
    el: '#menu',
    created() {
        document.addEventListener('keydown', this.keyevent);
    },
    methods: {
        keyevent(e) {
            console.log(e.keyCode);
            if(e.keyCode == 72) {
                window.alert("menu");
            }
        }
    }
})