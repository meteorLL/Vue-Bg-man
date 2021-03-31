<template>
<div class="cate">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <tree-table class="table" :data="cateList" :columns="columns" :show-row-hover="false" show-index index-text="#" :selection-type="false" :expand-type="false" border>
            <!-- '是否符合'列模板 -->
            <template slot="isOk" slot-scope="scope">
                <!-- <pre>{{scope.row}}</pre> -->
                <i class="el-icon-success" v-if="scope.row.cat_deleted ===false" style="color:lightgreen"></i>
                <i class="el-icon-error" v-else style="color:red"></i>

            </template>
            <template slot="sort" slot-scope="scope">
                <!-- '排序列'模板 -->
                <el-tag type="success" v-if="scope.row.cat_level ===0">一级</el-tag>
                <el-tag type="warning" v-if="scope.row.cat_level ===1">二级</el-tag>
                <el-tag type="danger" v-if="scope.row.cat_level ===2">三级</el-tag>
            </template>
            <!-- '操作'模板 -->
            <template slot="operation" slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                   <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)"></el-button>
          
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)"></el-button>
                </el-tooltip>
            </template>
        </tree-table>
        <!-- 商品分页功能 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryInfo.pagenum" :page-sizes="[ 5, 10,15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateClosed">
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateRuleFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <!-- 级联选择器 -->
                <!-- options用来指定数据源 -->
                <!-- props用来配置对象 -->
                <el-cascader v-model="selectedKeys" :options="parentCateList" expand-trigger="hover" change-on-select :props="cascaderProps" clearable @change="ParentCatehandleChanged"></el-cascader>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
   <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            queryInfo: {
                // 分类列表
                type: 3,
                // 当前页码
                pagenum: 1,
                //  当前每页显示条数
                pagesize: 5

            },
            cateList: [],
            total: 0,
            // 为table指定列的定义
            columns: [{
                    label: '分类名称',
                    prop: 'cat_name'
                }, {
                    label: '是否有效',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一系列使用模板名称
                    template: 'isOk'
                },
                {
                    label: '排序',
                    type: 'template',
                    // 表示当前这一系列使用模板名称
                    template: 'sort'

                },
                {
                    label: '操作',
                    type: 'template',
                    // 表示当前这一系列使用模板名称
                    template: 'operation'

                }
            ],
            addCateDialogVisible: false,
            addCateForm: {
                // 将要添加的分类名称
                cat_name: '',
                // 父级分类的id
                cat_pid: 0,
                //当前分类的等级,默认添加的是一级分类
                cat_level: 0
            },
            // 添加分类表单验证规则
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度不能超过30个字符', trigger: 'blur' }
                ],
            },
            // 父级分类数据列表
            parentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                // 指定选项的值为选项对象的某个属性值		                value: 'cat_id',
                // 指定选项标签为选项对象的某个属性值
                label: 'cat_name',
                // 指定选项的子选项为选项对象的某个属性值
                children: 'children',
            },
            // 选中的父级分类的Id数组
            selectedKeys: [],
            // 编辑分类对话框开关状态
            // 编辑对话框 控制
      editCateDialogVisible: false,
      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度不能超过30个字符', trigger: 'blur' }
                ]
      },
     // 编辑表单 绑定对象
      editCateForm: ''
        }
    },
    methods: {
        //获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类列表失败')
            } else {
                // 把数据赋值给catelist
                this.cateList = res.data.result
                this.total = res.data.total

            }

        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()

        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        showAddCateDialog() {
            this.getParentCateList()
            this.addCateDialogVisible = true

        },

        // 选择项发生变化触发这个函数
        ParentCatehandleChanged() {
            // 如果selectedKeys中的length的长度大于0，证明选中的父级分类
            // 反之则没有选中任何父级分类
            if (this.selectedKeys.length > 0) {
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                //    当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0

            }
        },
        // 点击确定按钮添加分类
        addCate() {
            // 表单预校验
            this.$refs.addCateRuleFormRef.validate(async valid => {
                if (!valid) {
                    return
                } else {
                    const { data: res } = await this.$http.post('categories', this.addCateForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加分类失败')
                    } else {
                        this.$message.success('添加分类成功')
                        this.getCateList()
                        this.addCateDialogVisible = false
                    }
                }

            })
        },
        // 添加分类对话框
        addCateClosed() {
            // 重置表单
            this.$refs.addCateRuleFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        // 获取父级分类列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: {
                    // 表示只获取一级和二级分类列表
                    type: 2
                }
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类列表失败')
            } else {
                this.parentCateList = res.data
            }

        },
        // 删除分类
    async removeCate (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除！') }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除商品分类失败！') }
      this.$message.success('删除商品分类成功！')
      this.getCateList()
    },
    // 显示编辑对话框
    async showEditCateDialog (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 编辑分类名
    editCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name
          })
        if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
        this.$message.success('更新分类名成功！')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    }

    },
    created() {
        this.getCateList()

    }

}
</script>

<style lang="less" scoped>
.cate {
    margin: 20px;
}

.table {
    margin-top: 15px;
}

.el-cascader {
    width: 100%;
}
</style>
