<template>
  <div>
    <div class="article-content">
      <el-row>
        <el-col :span="12">
          <h2 class="article-title">{{ articleDTO.title }}</h2>
          <el-row class="article-info">
            <el-col :span="8" class="article-date">
              <span class="fa fa-calendar-o"></span>
              {{ articleDTO.updateDate | dateFormat }}
            </el-col>
            <el-col :span="12" class="article-author" v-if="articleDTO.author">
              <el-avatar
                  :src="articleDTO.author.avatar"
                  size="small"
              ></el-avatar>
              {{ articleDTO.author.username }}
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" :offset="8">
          <el-popconfirm v-if="articleDTO.status === 0 || articleDTO.status === 1" title="确定通过该文章吗？"
                         @confirm="checkArticle">
            <el-button type="primary" slot="reference" icon="fa fa-check-circle">
              {{ articleDTO.status === 0 ? '提交发布' : '通过审核' }}
            </el-button
            >
          </el-popconfirm>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-image v-if="articleDTO.coverImg"
                class="article-coverImg"
                :src="articleDTO.coverImg"
                fit="scale-down"
      ></el-image>
      <div id="showText" ref="showText"></div>
    </div>
  </div>
</template>

<script>
import marked from "marked";
import VditorPreview from 'vditor/dist/method.min'

export default {
  name: "ArticlePreview",
  data() {
    return {
      articleDTO: {
        id: '',
        title: "",
        text: "",
        coverImg: "",
        status: 0,
        author: null,
        createDate: new Date(),
        updateDate: new Date(),
      },
    };
  },
  mounted() {
    VditorPreview.mermaidRender(document);
    this.articleDTO.id = this.$route.params.id;
    this.$api.article
        .getArticleById(this.articleDTO.id)
        .then((res) => {
          this.articleDTO = res.data;
          this.$route.meta.title = this.articleDTO.title;
          this.renderArticle(this.articleDTO);
        })
        .catch((error) => {
          this.$message.error(error);
        });
  },
  methods: {
    renderArticle(article) {
      this.$nextTick(() => {
        if (article.source === 2) {
          VditorPreview.preview(this.$refs.showText, article.text);
        } else {
          this.$refs.showText.innerHTML = article.text;
        }
      });
    },
    checkArticle() {
      let toStatus = this.articleDTO.status === 0 ? 1 : 2;
      this.$api.article.toCheckArticle(this.articleDTO.id, toStatus).then(res => {
        this.$message.success(res.msg);
        this.$router.push({name: 'DraftBox'})
      }).catch(error => this.$message.error(res.msg));
    },
    convertHtml(markdownText) {
      return marked(markdownText);
    }
  }
};
</script>

<style scoped>
.article-content {
  background-color: #fff;
  padding: 40px;
}

.article-title {
  margin: 0;
}

.article-info {
  margin-top: 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
}

.article-author {
  line-height: 40px;
  height: 40px;
}

.article-coverImg {
  width: 30%;
}
</style>
