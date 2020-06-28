// console.log('script.js is linked');

(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            file: null,
            username: "",
            title: "",
            description: "",
        },
        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                console.log("MOUNTED RESPONSE: ", response);
                self.images = response.data;
            });
        },
        methods: {
            handleClick: function (e) {
                var self = this;
                e.preventDefault();
                console.log("this! ", this);
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        self.images.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function (e) {
                this.file = e.target.files[0];
            },
        },
    });
})();
