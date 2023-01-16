import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "./pagination.js";

let productModal = "";
let delModal = "";

const app = createApp({
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/v2",
      path: "sasimi",
      products: [],
      selectProduct: {
        imagesUrl: [],
      },
      page: {},
    };
  },
  methods: {
    getTokenFromCookie() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      this.setAxiosAuth(token);
    },
    setAxiosAuth(token) {
      axios.defaults.headers.common["Authorization"] = token;
    },
    chekcAuth() {
      // 確認是否登入並導頁
      axios
        .post(`${this.url}/api/user/check`)
        .then((res) => {
          // console.log(res);
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
          //失敗，回去首頁
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "Got It!",
          }).then((result) => {
            location.replace("./"); //按下 confirm button 後才進行跳轉
          });
        });
    },
    getProducts(page = 1) {
      // 取得資料頁
      axios
        .get(`${this.url}/api/${this.path}/admin/products/?page=${page}`)
        .then((res) => {
          console.log(res.data);
          this.page = res.data.pagination;
          this.products = Object.values(res.data.products);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
    openNewModal() {
      //新增
      this.selectProduct = {};
      productModal.show();
    },
    openEditModal(product) {
      //編輯
      this.selectProduct = { ...product };
      productModal.show();
    },
    openDeleteModal(product) {
      //刪除
      this.selectProduct = { ...product };
      delModal.show();
    },
    prodConfirm() {
      //productModal 按下確認鍵
      const index = this.products.findIndex(
        (product) => product.id === this.selectProduct.id
      );
      let url = "";
      let method = "";
      if (index === -1) {
        //新增產品
        url = `${this.url}/api/${this.path}/admin/product`;
        method = "post";
      } else {
        //編輯產品
        url = `${this.url}/api/${this.path}/admin/product/${this.selectProduct.id}`;
        method = "put";
      }

      axios[method](url, { data: this.selectProduct })
        .then((res) => {
          productModal.hide();
          this.selectProduct = {};
          this.getProducts();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
    prodDelete() {
      //delProductModal 按下確認鍵
      const url = `${this.url}/api/${this.path}/admin/product/${this.selectProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          delModal.hide();
          this.selectProduct = {};
          this.getProducts();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
  },
  components: {
    pagination,
  },
  mounted() {
    // 取 token，並放置到 axios 的 headers 中
    this.getTokenFromCookie();
    // 確認是否登入(檢查 cookie)
    this.chekcAuth();
    //在畫面完全生成之後，才去截取 dom 元素
    //bootstrap 初始化 new
    productModal = new bootstrap.Modal(
      document.querySelector("#productModal"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    delModal = new bootstrap.Modal(document.querySelector("#delProductModal"), {
      backdrop: "static",
      keyboard: false,
    });
  },
});

app.component("product-modal", {
  props: ["selectProduct", "prodConfirm"],
  template: "#product-modal-template",
});
app.component("delete-product-modal", {
  props: ["selectProduct"],
  template: "#product-delete-modal-template",
});
app.mount("#app");
