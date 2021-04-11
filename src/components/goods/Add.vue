<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false">
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
        class="demo-ruleForm"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                expand-trigger="hover"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="val"
                  v-for="(val, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的API地址 -->
            <!-- on-preview代表点击图片会触发的事件 -->
            <!-- on-remove点击图片×号的时候回触发 -->
            <!-- list-type可以控制upload渲染出来的ui结构 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button class="addGood" type="primary" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览 -->
      <el-dialog
        title="图片预览"
        :visible.sync="previewDialogVisible"
        width="40%"
      >
        <img :src="previewPath" class="previewImg" />
      </el-dialog>
      
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条默认展示步骤
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片临时地址数组
        pics: [],
        // 商品详情
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
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
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 商品分类数据
      cateList: [],
      cascaderProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      //   商品图片上传地址
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 因为upload组件不是用的axios请求，而是它自己有一套ajax请求，
      // 所以在main.js里面设置的不是token在这里无效，所以需要重新设置一个header
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //   预览图片地址
      previewPath: "",
      //   控制预览图片的开关
      previewDialogVisible: false,
     
    };
  },
  methods: {
    //   获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据列表失败！");
      }
      this.cateList = res.data;
    },
    // 级联选择器选中变化，会触发这个函数
    handleChange() {
      // console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activeName, oldactiveName) {
      if (this.addForm.goods_name.trim() == "") {
        this.$message.error("请输入商品名称");
        this.addForm.goods_name = "";
        return false;
      } else if (oldactiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");

        return false;
      }
    },
    async tabClicked() {
      // 如果进入到了动态参数面板
      // console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        // 获取动态参数列表
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败");
        } else {
          // this.$message.success('获取动态参数成功')
          // console.log(res);
          // console.log(res.data);
          res.data.forEach((item) => {
            if (item.attr_vals.indexOf(",") !== -1) {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            } else {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            }
          });
          this.manyTableData = res.data;
          // console.log(this.manyTableData);
        }
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败");
        } else {
          this.onlyTableData = res.data;
          // console.log(this.onlyTableData);
        }
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // file参数代表将要删除的图片信息
      //   console.log(file);
      // 获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path;
      // console.log(filePath);
      //   获取将要删除图片的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);

      this.addForm.pics.splice(i, 1);
      console.log(this.addForm.pics);
    },
    // 图片上传成功触发这个函数
    handleSuccess(response) {
      // console.log(response);
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm);
    },
    // 点击添加商品按钮
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        } else {
          // 添加商品
          // 把goods_cat转化为以,分割的字符串
          /*   下面这行代码会出问题，因为在商品信息哪儿个tab标签栏级联选择器
                v-modal绑定了goods_cat,因为级联选择器只能和数组数据双向绑定，
                所以这里点添加商品会报错， */
          // this.addForm.goods_cat =this.addForm.goods_cat.join(',')
          // 所以需要对goods_cat进行深拷贝
          const form = JSON.parse(JSON.stringify(this.addForm));
          // console.log(form)
          form.goods_cat = form.goods_cat.join(",");
          // console.log(form.goods_cat);
          //   处理动态参数
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" "),
            };
            this.addForm.attrs.push(newInfo);
          });
          //   处理静态属性
          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            this.addForm.attrs.push(newInfo);
          });
          form.attrs = this.addForm.attrs;

          // 发起添加商品请求
          const { data: res } = await this.$http.post("goods", form);
          if (res.meta.status !== 201) {
            this.$message.error("添加商品失败");
          } else {
            this.$message.success("添加商品成功");
            this.$router.push("/goods");
          }
        }
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style lang="less" scoped>
.add {
  margin: 20px;
}
.el-checkbox {
  margin: 5px 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addGood {
  margin-top: 20px;
}
</style>
