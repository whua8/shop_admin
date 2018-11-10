<template>
<el-container class="home">
  <el-header>
    <div class="login"></div>
    <div class="logout">
      欢迎光临
      <a href="javascript:;" @click="logout">退出</a>
    </div>
    <h1 class="title">电商后台管理系统</h1>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <el-menu
        default-active="/users"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/users">
            <i class="el-icon-setting"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item index="2-1">
            <i class="el-icon-menu"></i>
            <span slot="title">角色列表</span>
          </el-menu-item>
          <el-menu-item index="2-2">
            <i class="el-icon-menu"></i>
            <span slot="title">权限列表</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  methods: {
    // 退出功能
    logout() {
      this.$confirm('你确定要退出系统吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '取消了退出操作'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;

  .el-header {
    background-color: #b3c1cd;

    .login {
      width: 180px;
      height: 60px;
      float: left;
      background-image: url('../assets/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .logout {
      width: 180px;
      height: 60px;
      float: right;
      line-height: 60px;
      text-align: right;
      font-weight: 700;
      a {
        color: darkorange;
      }
    }

    h1 {
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 28px;
      color: #fff;
    }
  }

  .el-aside {
    background-color: #545c64;

    .el-submenu {
      width: 200px;
    }
  }

  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
