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
                user: "",
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
                    console.log("RES DATA URL:   ", response.data.url);
                    self.title = response.data.title;
                    self.description = response.data.description;
                    self.username = response.data.username;
                    self.created_at = response.data.created_at
                        .replace("T", " at ")
                        .slice(0, -8);
                })
                .catch(function (err) {
                    console.log("ERROR IN AXIOS: ", err);
                });
            axios
                .get("/comments/" + this.id)
                .then(function (response) {
                    console.log("COMMENTS:", response.data);
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
                        username: this.user,
                        comment: this.comment,
                    })
                    .then(function (response) {
                        console.log("POSTED COMMENT :", response.data);
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
            lastId: null,
            link: false,
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
            getMoreImages: function (id) {
                var self = this;
                axios.post("/images/more", { id }).then(function (response) {
                    console.log("PROVA: ", response.data);
                });
            },
        },
    });
})();
