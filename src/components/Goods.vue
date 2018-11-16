<template>
  <div class="goods">
    <el-button type="success" @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table :data="goodList" style="width: 100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      background
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodList: [],
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getGoodList() {
      let res = await this.axios.get(`goods`, {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      let { meta: { status }, data: { goods, total } } = res
      if (status === 200) {
        this.goodList = goods
        this.total = total
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodList()
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style>
</style>
