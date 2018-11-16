<template>
  <div class="categories">
    <el-button type="success" @click="showAddDialog">添加分类</el-button>
    <!-- 展示表格 -->
    <el-table
      :data="categoryList"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        childKey="children"
        treeKey = "cat_id"
        parentKey = "cat_pid"
        levelKey = "cat_level"
        :indentSize = "20">
      </el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否删除">
        <template slot-scope="scope">
          {{scope.row.cat_deleted?"是":"否"}}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="delCategory(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            :options="options"
            :props="props"
            v-model="addForm.cat_pid"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      // 添加数据
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      options: [],
      props: {
        children: 'children',
        label: 'cat_name',
        value: 'cat_id'
      }
    }
  },
  methods: {
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      let { meta: { status }, data: { result, total } } = res
      if (status === 200) {
        this.categoryList = result
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
    // 展示添加的对话框
    async showAddDialog() {
      this.addDialogVisible = true
      let res = await this.axios.get('categories', {
        params: { type: 2 }
      })
      console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.options = data
      }
    },
    addCategory() {
      this.$refs.addForm.validate(async valit => {
        if (!valit) return false
        let res = await this.axios.post(`categories`, {
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0,
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length
        })
        if (res.meta.status === 201) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getCategoryList()
          this.$message.success('恭喜,添加分类成功')
        }
      })
    },
    // 删除分类
    async delCategory(cate) {
      console.log(cate)
      try {
        await this.$confirm('你确定要删除吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${cate.cat_id}`)
        if (res.meta.status === 200) {
          this.$message.success('恭喜你 删除成功')
          this.getCategoryList()
        }
      } catch (error) {
        this.$message.error('取消了删除')
      }
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
