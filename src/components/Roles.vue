<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/roles">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="showAddDialog" type="success" plain>添加角色</el-button>
    <!-- 表单 -->
    <!-- 表单 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 暂无权限的提示 -->
          <el-row v-if="scope.row.children.length === 0">
            暂无权限
          </el-row>
          <el-row class="level1" v-for="level1 in scope.row.children"
          :key="level1.id">
            <el-col :span=4>
              <el-tag @close="deleteRight(scope.row,level1.id)" closable>{{level1.authName}}</el-tag>
            </el-col>
            <el-col :span=20>
              <!-- 二级权限 -->
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span=4>
                  <el-tag @close="deleteRight(scope.row,level2.id)" type="success" closable>{{level2.authName}}</el-tag>
                </el-col>
                <el-col :span=20>
                  <!-- 三级权限 -->
                  <el-tag @close="deleteRight(scope.row,level3.id)" class="level3" type="danger" closable v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色名称"></el-table-column>
      <el-table-column property="roleDesc" label="角色描述"></el-table-column>
      <el-table-column property="level" label="操作">
        <template slot-scope="scope">
          <el-button @click="showEditDialog(scope.row)" size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="deleteRole(scope.row)" size="small" plain type="danger" icon="el-icon-delete"></el-button>
          <el-button @click="showAssignRight(scope.row)" size="small" plain type="success" icon="el-icon-check">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 属性菜单 -->
    <el-dialog title="分配权限" :visible.sync="assignDialogVisible"
      width="40%">
      <el-tree
        ref="tree"
        :data="rightList"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      // 控制分配权限对话框
      assignDialogVisible: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      // 修改对话框
      editDialogVisible: false,
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('/roles')
      console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    async getRightList() {
      let res = await this.axios.get('rights/tree')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    async deleteRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        // console.log(data)
        role.children = data
        this.$message.success('恭喜你，删除成功')
      }
    },
    // 展示模态框
    showAssignRight(role) {
      // this.assignDialogVisible = true
      // 展示对话框
      this.roleId = role.id
      this.assignDialogVisible = true
      this.getRightList()
      this.$nextTick(() => {
        let temp = []
        role.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              temp.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 分配权限
    async assignRight() {
      let checked = this.$refs.tree.getCheckedKeys()
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      let all = [...checked, ...halfChecked]
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: all.join()
      })
      if (res.meta.status === 200) {
        this.assignDialogVisible = false
        this.getRoleList()
      }
    },
    // 删除角色
    async deleteRole(role) {
      try {
        await this.$confirm('你确定要删除这个角色吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        let res = await this.axios.delete(`roles/${role.id}`)
        let { meta: { status } } = res
        if (status === 200) {
          this.$message.success('恭喜你 删除成功')
          this.getRoleList()
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    },
    // 展示添加对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加角色
    addRole() {
      this.$refs['addForm'].validate(async valit => {
        if (!valit) return false
        let res = await this.axios.post('roles', this.addForm)
        if (res.meta.status === 201) {
          // 1. 重置表单
          this.$refs.addForm.resetFields()
          this.$message.success('添加成功')
          this.addDialogVisible = false
          this.getRoleList()
        }
      })
    },
    // 展示修改对话框
    showEditDialog(role) {
      this.editDialogVisible = true
      console.log(role)
      this.editForm.id = role.id
      this.editForm.roleName = role.roleName
      this.editForm.roleDesc = role.roleDesc
    },
    // 修改角色
    editRole() {
      this.$refs.editForm.validate(async valit => {
        if (!valit) return false
        let res = await this.axios.put(
          `roles/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status === 200) {
          this.editDialogVisible = false
          this.$refs.editForm.resetFields()
          this.getRoleList()
          this.$message.success('修改成功')
        }
      })
    }
  },
  async created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
