<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/users">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div>
      <el-input placeholder="请输入关键字" v-model="query"     class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" plain @click="showAddDialog">用户添加</el-button>
    </div>
    <!-- 列表渲染页 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        label="状态"
        width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatu(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check" @click="showAssignDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <el-pagination
    layout="prev, pager, next"
    :total="total"
    :page-size="pageSize"
    background
    @current-change="handleCurrentChange">
  </el-pagination> -->

  <!-- 完整分页 -->
   <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    background>
  </el-pagination>

  <!-- 添加对话框 -->
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="40%"
  >
    <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input placeholder="请输入电话" v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input placeholder="请输入电话" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="40%">
      <el-form ref="assignForm" :model="assignForm" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" prop="rid">
          <!-- 下拉框 -->
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      currentPage: 1,
      // 每页显示的条数
      pageSize: 2,
      total: 0,
      // 用户的列表数据
      userList: [],

      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确格式的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        rid: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignDialogVisible: false,
      assignForm: {
        id: '',
        username: '',
        rid: ''
      },
      roleList: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取所有角色
    async getRoleList() {
      let res = await this.axios.get('/roles')
      console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res.data)
      let { meta: { status }, data: { users, total } } = res
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    // 每页条数发生改变
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getUserList()
    },
    // 搜索功能
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    // 删除功能
    async delUser(id) {
      try {
        await this.$confirm('你确定要删除这个用户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`
        })
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
        if (res.meta.status === 200) {
          if (this.userList.length === 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUserList()
          this.$message.success('删除成功了')
        }
      } catch (error) {
        this.$message({
          type: 'error',
          message: '你取消了删除操作'
        })
      }

      // axiox({
      //   method: 'delete',
      //   url: `http://localhost:8888/api/private/v1/users{$id}`,

      // })
    },
    // 改变状态
    changeStatu({ id, mg_state: mgState }) {
      this.axios({
        method: 'put',
        url: `users/${id}/state/${mgState}`
      }).then(res => {
        if (res.meta.status === 200) {
          this.$message.success('修改状态成功了')
        } else {
          this.$message.error('修改状态失败了')
        }
      })
    },
    // 显示添加对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加用户
    addUser() {
      this.$refs['addForm'].validate(async valid => {
        if (!valid) return false

        let res = await this.axios({
          method: 'post',
          url: 'users',
          // data: {
          //   username: this.username,
          //   password: this.password,
          //   email: this.email,
          //   mobile: this.mobile
          // }
          data: this.addForm
        })
        let { meta: { status } } = res
        if (status === 201) {
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.getUserList()
          this.addDialogVisible = false
          this.$refs['addForm'].resetFields()
        }
      })
    },
    // 显示修改对话框
    showEditDialog(user) {
      this.editDialogVisible = true
      // 让数据回显, 把user中的值赋值editForm中
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 修改用户
    editUser() {
      this.$refs.editForm.validate(async valit => {
        if (!valit) return false

        let res = await this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        })
        let { meta: { status } } = res
        if (status === 200) {
          this.editDialogVisible = false
          this.getUserList()
        }
      })
    },
    // 显示分配角色
    async showAssignDialog(user) {
      this.assignDialogVisible = true
      console.log(user)
      this.assignForm.id = user.id
      this.assignForm.username = user.username

      let res = await this.axios.get(`users/${user.id}`)
      console.log(res)
      let { data: { rid }, meta: { status } } = res
      if (status === 200) {
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
      this.getRoleList()
    },
    // 分配角色
    assignRole() {
      this.$refs.assignForm.validate(async valit => {
        if (!valit) return false
        let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
          rid: this.assignForm.rid
        })
        if (res.meta.status === 200) {
          this.assignDialogVisible = false
          this.$refs.assignForm.resetFields()
          this.getUserList()
          this.$message.success('角色分配成功')
        }
      })
    }
  }
}
</script>

<style lang = "less" scoped>
.el-input {
  width: 400px;
  margin-bottom: 10px;
}
</style>
