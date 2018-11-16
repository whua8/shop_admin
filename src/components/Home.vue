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
        :default-active="$route.path.slice(1).split('-')[0]"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        router>
        <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{menu.authName}}</span>
          </template>
          <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
            <i class="el-icon-setting"></i>
            <span slot="title">{{item.authName}}</span>
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
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    // 退出功能
    async logout() {
      try {
        await this.$confirm('你确定要退出系统吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: '取消了退出操作'
        })
      }
    }
  },
  async created() {
    let res = await this.axios.get('menus')
    console.log(res)
    let { meta: { status }, data } = res
    if (status === 200) {
      this.menuList = data
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
