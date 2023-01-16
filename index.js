import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = {
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/v2",
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      axios
        .post(`${this.url}/admin/signin`, this.user)
        .then((res) => {
          // console.log(res.data);
          const { token, expired } = res.data;
          // console.log(token, expired);
          document.cookie = `hexToken=${token}; expires=${expired};`;
          location.replace("./products.html");
        })
        .catch((err) => {
          // console.log(err);
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
          this.user.username = "";
          this.user.password = "";
        });
    },
  },
};

createApp(app).mount("#app");
