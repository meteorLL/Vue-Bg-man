<template>
  <div class="order">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单浏览</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入要查询的订单号"
            clearable
            v-model="queryInfo.query"
          ></el-input>
        </el-col>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getOrderList"
        ></el-button>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" style="width: 100%" stripe="" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <el-tag type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ (scope.row.create_time * 1070) | dataFormat }}
          </template> </el-table-column
        ><el-table-column prop="order_id" label="操作">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-tooltip
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showAddressDialog"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="定位"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="success"
                icon="el-icon-location"
                @click="showProgressDialog"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="addressDialogVisibleClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
           <el-cascader
              v-model="addressForm.address1"
              :options="citydata"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
       <el-input v-model="addressForm.address2" placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </el-form>
 <div slot="footer" class="dialog-footer">
    <el-button @click="addressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAddress">确 定</el-button>
  </div>
    </el-dialog>
    <!-- 展示物流进度对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="progressDialogVisible" width="50%">
    <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "@/components/order/citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   订单总数
      total: 0,
      //   订单列表
      orderList: [],
      //   默认对话框展开状态
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      //   城市数据
      citydata: citydata,
      // 物流进度对话框
      progressDialogVisible: false,
      // 物流进度
      progressInfo: []
    };
  },
  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表数据失败");
      } else {
        this.total = res.data.total;
        this.orderList = res.data.goods;
        console.log(this.orderList);
      }
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    // 点击修改地址按钮触发,展示对话框
    showAddressDialog() {
      this.addressDialogVisible = true;
    },
    // 对话框关闭触发时间
    addressDialogVisibleClosed(){
    this.$refs.addressFormRef.resetFields()
    },
    // 点击对话框确定按钮
    editAddress(){
        this.$refs.addressFormRef.validate(valid=>{
            if(!valid){
                return
            }else{
            this.$message.success('修改地址成功')
        this.addressDialogVisible =false
        }
        })
        
    },
     dialogVisible () {
      let content = document.getElementsByClassName('el-dialog__wrapper')
      let inp1 = document.getElementsByClassName('el-input__inner')[2]
      let inp2 = document.getElementsByClassName('el-input__inner')[3]
      if (inp1.value !== '' && inp2.value !== '') {
        content[0].style.display = 'none'
      }
    },
    async showProgressDialog () {
      // 供测试的物流单号：1106975712662
      const { data: res } = await this.$http.get('https://www.liulongbin.top:8888/api/private/v1/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败!')
      }
      this.progressInfo = res.data
      this.progressDialogVisible = true
    }
  },

  created() {
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped>
.order {
  margin: 20px;
}
.el-cascader{
    width: 100%;
}
</style>
