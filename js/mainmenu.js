function quit() {
    if(confirm("Are you sure you want to quit?")) {
        window.close();
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
            } else if(e.keyCode == 71) {
                window.location = "./index.html";
            }
            //Q - QUIT
            else if(e.keyCode == 81) {
                quit();
            }
        }
    }
})