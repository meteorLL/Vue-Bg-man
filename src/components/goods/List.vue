<template>
  <div class="list">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="el-table">
      <!-- 搜索框和添加商品 -->
      <el-row :gutter="12">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="searchInputListCleared"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140">
          <template v-slot="scope">
            {{ (scope.row.add_time * 1065) | dataFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="130">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditGoodDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="goodsDelete(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 商品分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 修改商品对话框 -->
      <el-dialog
        title="修改商品信息"
        :visible.sync="editGoodDialogVisible"
        width="50%"
      >
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          label-width="80px"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number" type="number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGood">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表
      goodsList: [],
      // 参数信息
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前页码
        pagenum: 1,
        // 当前每页显示条数
        pagesize: 10,
      },
      total: 0,
      //   控制编辑商品对话框的关启
      editGoodDialogVisible: false,
      editForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        pics: {},
        attrs: [],
      },
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
      goods_id: 0,
    };
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      } else {
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      }
    },
    // 分页切换当前页面数
    handleSizeChange(newSize) {
      // newSize代表当前页面显示条数
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 分页切换页数，newPage代表当前页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 搜索框清空触发的监听事件
    searchInputListCleared() {
      this.getGoodsList();
    },
    // 删除商品
    async goodsDelete(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      } else {
        const { data: res } = await this.$http.delete(`goods/${id}`);
        if (res.meta.status !== 200) {
          return this.$message.error("删除商品失败");
        } else {
          this.$message.success("删除商品成功");
          this.getGoodsList();
        }
      }
    },
    // 点击添加商品按钮，跳转到添加商品页面，路由导航
    goAddPage() {
      this.$router.push("/goods/add");
    },
    showEditGoodDialog(scope) {
      console.log(scope);
      this.editForm.goods_name = scope.goods_name;
      this.editForm.goods_price = scope.goods_price;
      this.editForm.goods_weight = scope.goods_weight;
      this.editForm.goods_number = scope.goods_number;
      this.goods_id = scope.goods_id;
      this.editGoodDialogVisible = true;
    },
    editGood() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          // console.log(this.editForm);
        //   console.log(this.goods_id);
          const { data: res } = await this.$http.put(`goods/${this.goods_id}`, {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_number: this.editForm.goods_number,
            goods_weight: this.editForm.goods_weight,
            goods_introduce: this.editForm.goods_introduce,
            pics: this.editForm.pics,
            attrs: this.editForm.attrs,
          });
          this.editGoodDialogVisible = false
          this.$message.success('商品修改成功')
        }
      });
    },
  },
  created() {
    this.getGoodsList();
  },
};
</script>

<style lang="less" scoped>
.list {
  margin: 20px;
}
</style>
