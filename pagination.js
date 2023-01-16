export default {
  props: ["pages", "getProducts"],
  methods: {
    emitPage(targetPage) {
      //targetPage: 想轉換的目標頁數
      this.$emit("change-page2", targetPage);
    },
  },
  template: `
  <nav aria-label="Page navigation">
    <!-- {{ page }} -->
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <!-- emit 法1 -->
        <a class="page-link" href="#" aria-label="Previous"
          @click.prevent="emitPage(pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item"
        :class="{ active: page === pages.current_page }"
        v-for="page in pages.total_pages" :key="page + 'page'">

        <!-- 已經 active 就取消<a>點擊，改成<span> -->
        <span class="page-link"
            v-if="page === pages.current_page"
            >{{ page }}</span>
        <!-- props -->
        <a class="page-link" href="#" 
            v-else
            @click.prevent="getProducts(page)">{{ page }}
        </a>
      </li>

      <li class="page-item" :class="{ disabled: !pages.has_next}">
        <!-- emit 法2 -->
        <a class="page-link" href="#" aria-label="Next"
          @click.prevent="$emit('change-page', pages.current_page+1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>`,
  mounted() {
    //為什麼空著的 ?
    // console.log("page", this.pages);
  },
};
