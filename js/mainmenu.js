function quit() {
    if(confirm("Are you sure you want to logout?")) {
        window.location = "./login.html";
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
            //T - TEAMS
            if(e.keyCode == 84) {
                window.location = "./teams.html";
            }
            // G - Gametime scoring
            else if(e.keyCode == 71) {
                window.location = "./selectgame.html";
            }
            // O - Options
            else if(e.keyCode == 79) {
                window.location = "./options.html";
            }
            // H - Help
            else if(e.keyCode == 72) {
                window.location = "./help.html";
            }
            //Q - LOGOUT
            else if(e.keyCode == 81) {
                quit();
            }
        }
    }
})