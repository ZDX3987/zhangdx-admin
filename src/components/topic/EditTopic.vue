<template>
  <div class="edit-topic">
    <el-form ref="topicForm" :inline="true" :model="topicForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col>
          <el-form-item label="专题名称" prop="title">
            <el-input v-model="topicForm.title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveTopic('topicForm')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button size="small" type="primary" plain @click="openArticleDialog">添加文章</el-button>
          <el-button size="small" type="danger" @click="multiDeleteArticle" plain>删除文章</el-button>
          <el-table ref="selectArticleTable" :data="topicForm.articleList" size="medium"
                    @selection-change="selectArticle" @row-click="rowClick">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" width="300" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="author.username" label="作者" width="120" align="center"></el-table-column>
            <el-table-column label="标签" width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
            <span v-for="(tag, index) of scope.row.categories" :key="tag.id">
              {{ index !== 0 ? '/' : '' + tag.cateName }}
            </span>
                <span v-if="scope.row.categories.length === 0">/</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="发布时间" :formatter="dateFormat" width="120" align="center">
            </el-table-column>
            <el-table-column width="120" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteArticle(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <article-multi-sel-dialog ref="articleDialog" @select-article="addArticle"></article-multi-sel-dialog>
  </div>
</template>

<script>
import ArticleMultiSelDialog from "../dialog/ArticleMultiSelDialog";

export default {
  name: "EditTopic",
  data() {
    return {
      operate: '',
      topicForm: {
        id: null,
        title: '',
        articleList: [],
      },
      rules: {
        title: [{required: true, message: '请输入专题名称', trigger: 'blur'}]
      },
      selectList: [],
    }
  },
  components: {
    ArticleMultiSelDialog
  },
  created() {
    this.operate = this.$route.params.operate;
    if (this.operate === 'update') {
      this.topicForm = this.$route.params.topic;
      this.$api.topic.getTopicById(this.topicForm.id).then(res => {
        this.topicForm = res.data;
      }).catch(error => this.$message.error('查询失败'));
    }
  },
  methods: {
    saveTopic(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        } else if (this.topicForm.articleList.length === 0) {
          this.$message.warning('请添加文章');
          return false;
        }
        this.$api.topic.saveTopic(this.topicForm).then(res => {
          this.$message.success('保存成功');
          this.$router.push({name: 'TopicList'})
        }).catch(error => this.$message.error('保存失败'));
      });
    },
    selectArticle(list) {
      this.selectList = list;
    },
    openArticleDialog() {
      this.$refs.articleDialog.articleDialogVisible = true;
    },
    addArticle(list) {
      let articleIds = this.topicForm.articleList.map(article => article.id);
      list = list.filter(select => !articleIds.includes(select.id));
      this.topicForm.articleList = this.topicForm.articleList.concat(list);
    },
    deleteArticle(index) {
      this.topicForm.articleList.splice(index, 1);
    },
    multiDeleteArticle() {
      if (this.selectList.length === 0) {
        return;
      }
      this.topicForm.articleList = this.topicForm.articleList.filter(article =>
          this.selectList.findIndex(select => select.id === article.id) === -1);
    },
    rowClick(row) {
      this.$refs.selectArticleTable.toggleRowSelection(row);
    },
    dateFormat(row, column) {
      return this.$options.filters['dateFormat'](row.createDate, 'yyyy-MM-DD')
    },
  }
}
</script>

<style scoped>
.edit-topic {
  background-color: #FFF;
  padding: 20px;
}
</style>
