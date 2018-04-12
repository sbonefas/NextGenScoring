var dirName = "Statcrew"

function changeDir() {
    dirName = document.getElementById("userinput").value;
    console.log(dirName);
}

var app = new Vue({
    el: '#optionsapp',
    created() {
        document.addEventListener('keydown', this.keyevent);
        var x = document.getElementById("userinput");
        x.setAttribute("value", dirName);
    },
    methods: {
        keyevent(e) {
            console.log(e.keyCode);
            if(e.keyCode == 13) {
                app.changeDir();
            }
        },
        changeDir() {
            dirName = document.getElementById("userinput").value;
        }
    }
})