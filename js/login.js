function pswrdEntered() {
    var password = document.getElementById("pswrd").value;
    console.log(password)
    if(password == "123") {
        window.location = "./mainmenu.html"
    }
    else {
        var y = document.getElementById("forgot");
        y.style.display = "none"
        var x = document.getElementById("errormsg");
        x.style.display = "block"
    }
}

function forgotPswd() {
        var x = document.getElementById("errormsg");
        x.style.display = "none"
        var y = document.getElementById("forgot");
        y.style.display = "block"
}


var app = new Vue({
    el: '#login',
    created() {
        document.addEventListener('keydown', this.keyevent);
    },
    methods: {
        keyevent(e) {
            console.log(e.keyCode);
            if(e.keyCode == 13) {
                app.pswrdEntered();
            }
        },
        pswrdEntered() {
            var password = document.getElementById("pswrd").value;
            console.log(password)
            if(password == "123") {
                window.location = "./mainmenu.html"
            }
            else {
                var y = document.getElementById("forgot");
                y.style.display = "none"
                var x = document.getElementById("errormsg");
                x.style.display = "block"
            }
        }
    }
})