// console.log('script.js is linked');

(function () {
    Vue.component("first-component", {
        template: "#template",
        props: ["id"],
        data: function () {
            return {
                title: "",
                description: "",
                username: "",
                url: "",
                comments: [],
                comment: "",
                created_at: "",
            };
        },
        mounted: function () {
            var self = this;
            console.log("ID: ", this.id);
            axios
                .get("/image/" + this.id)
                .then(function (response) {
                    console.log("RESPONSE: ", response);
                    self.url = response.data.url;
                    console.log("RES DATA URL ", response.data.url);
                    self.title = response.data.title;
                    self.description = response.data.description;
                    self.username = response.data.username;
                    self.created_at = response.data.created_at;
                })
                .catch(function (err) {
                    console.log("ERROR IN AXIOS: ", err);
                });
            axios
                .get("/comments/" + this.id)
                .then(function (response) {
                    console.log("comments:", response);
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("ERROR IN COMMENTS: ", err);
                });
        },
        methods: {
            closeModal: function () {
                this.$emit("close");
            },
            postComments: function (e) {
                var self = this;
                e.preventDefault();
                axios
                    .post("/comments", {
                        imageId: this.id,
                        username: this.username,
                        comment: this.comment,
                    })
                    .then(function (response) {
                        console.log("DIOCANEEEE :", response.data);
                        self.comments.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("err in POST /comment: ", err);
                    });
            },
        },
    });
    new Vue({
        el: "#main",
        data: {
            images: [],
            file: null,
            username: "",
            title: "",
            description: "",
            id: null,
            comment: "",
            created_at: "",
        },
        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                console.log("MOUNTED RESPONSE: ", response);
                self.images = response.data.reverse();
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
            imgClick: function (id) {
                console.log("this: ", this);
                this.id = id;
            },

            handleChange: function (e) {
                this.file = e.target.files[0];
            },
            closeMe: function () {
                this.id = null;
                console.log(
                    "closeMe in the instance / parent is running! This was emitted from the component"
                );
            },
        },
    });
})();
