var dirName = "Statcrew"
var xmlName = "XML"

function changeDir() {
    dirName = document.getElementById("userinput").value;
    console.log(dirName);
}

function changeXML() {
    dirName = document.getElementById("xmlinput").value;
    console.log(xmlName);
}

var app = new Vue({
    el: '#optionsapp',
    created() {
        document.addEventListener('keydown', this.keyevent);
        var x = document.getElementById("userinput");
        x.setAttribute("value", dirName);
        var y = document.getElementById("xmlinput");
        y.setAttribute("value", xmlName);
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
        },
        changeXML() {
            xmlName = document.getElementById("xmlinput").value;
        }
    }
})