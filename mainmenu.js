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