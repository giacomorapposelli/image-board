// console.log('script.js is linked');

(function () {
    new Vue({
        // el - represents which element in our html will have access to our Vue code
        el: "#main",
        // an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            name: "dill",
            seen: false,
            cities: [],
        },
        mounted: function () {
            // console.log('my vue has MOUNTED!!!!');
            // console.log('this outside axios: ', this);

            var self = this;
            axios.get("/cities").then(function (response) {
                // console.log('this INSIDE axios: ', self);
                // console.log('response from /cities: ', response);
                //axios will ALWAYS store the info coming from the server inside a 'data' property
                self.cities = response.data;
            });
        },
        methods: {
            myFunction: function () {
                console.log("myFunction is running!!!!!");
            },
        },
    });
})();
