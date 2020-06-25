// console.log('script.js is linked');

(function () {
    new Vue({
        el: "#main",
        data: {
            name: "dill",
            images: [],
        },
        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                self.images = response.data;
            });
        },
        methods: {
            myFunction: function () {
                console.log("myFunction is running!!!!!");
            },
        },
    });
})();
