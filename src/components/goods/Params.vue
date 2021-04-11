<template>
<div class="params">

    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 警告提示框 -->
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
        <!-- 选择商品分类区域 -->
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类: </span>
                <el-cascader v-model="selectedCateKeys" expand-trigger="hover" :options="cateList" :props="cateProps" @change="handleChange">

                </el-cascader>
                <!-- 选择商品分类的级联选择框 -->
            </el-col>

        </el-row>
        <!-- tab标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 添加动态参数的面板 -->
            <el-tab-pane label="动态参数" name="many">
                <!-- 添加参数按钮 -->
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamsDialogVisible = true">添加参数</el-button>
                <!-- 动态参数表单 -->
                <el-table :data="manyTableData" border stripe>
                    <!-- 动态参数表格 -->
                    <el-table-column type="expand">
                        <template v-slot="scope">
                            <!-- 循环渲染tag标签 -->
                            <el-tag type="success" v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClosed(i,scope.row)">
                                {{item}}
                            </el-tag>
                            <!-- 输入的文本框 -->
                            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <!-- 添加按钮 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="参数名称">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <!-- {{scope.row}} -->
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row) "></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)"></el-button>
                            </el-tooltip>
                        </template>

                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 添加静态属性的面板 -->
            <el-tab-pane label="静态属性" name="only">
                <!-- 添加属性按钮 -->
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamsDialogVisible = true">添加属性</el-button>
                <!-- 静态属性表单 -->
                <el-table :data="onlyTableData" border stripe>
                    <!-- 静态参数表格 -->
                   <el-table-column type="expand">
                        <template v-slot="scope">
                            <!-- 循环渲染tag标签 -->
                            <el-tag type="success" v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClosed(i,scope.row)">
                                {{item}}
                            </el-tag>
                            <!-- 输入的文本框 -->
                            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <!-- 添加按钮 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="属性名称">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" :enterable="false">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)"></el-button>
                            </el-tooltip>
                        </template>

                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addParamsDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog :title="'编辑'+titleText" :visible.sync="editParamsDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            cateList: [],
            // 级联选择框的配置对象
            cateProps: {
                value: 'cat_id',
                // 所看到的名字
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框双向绑定的数组，值等于cateProps中的value的值
            selectedCateKeys: [],
            // tab标签页默认选中的页签
            activeName: 'many',
            // 动态参数数据列表
            manyTableData: [],
            // 静态属性数据列表
            onlyTableData: [],
            // 添加动态参数对话框默认状态
            addParamsDialogVisible: false,
            // 添加参数表单数据对象
            addForm: {
                attr_name: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                attr_name: [{
                    required: true,
                    message: '请输入参数名称',
                    trigger: 'blur'
                }]

            },
            // 编辑对话框默认开关
            editParamsDialogVisible: false,
            // 添加参数表单数据对象
            editForm: {
                attr_name: ''
            },
            // 添加表单的验证规则对象
            editFormRules: {
                attr_name: [{
                    required: true,
                    message: '请输入参数名称',
                    trigger: 'blur'
                }]

            },
            // 解决空格符的问题
            tag_attr_avals: [],
            // 控制按钮与文本框的切换显示
            inputVisible: false,
            inputValue: ''

        }
    },
   
    methods: {
        // 获取商品分类列表
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            } else {
                this.cateList = res.data
                // console.log(this.cateList);
            }
        },
        // 级联选择框选中项会触发这个函数
        handleChange() {
            this.getParamsData()

        },
        // 切换tab标签会触发这个函数
        handleClick() {
            // console.log(666);
            // console.log(this.activeName);
            // 减少切换tab标签栏时的请求次数
            this.getParamsData()

        },
        // 获取参数列表
        async getParamsData() {
            // 证明选中的不是三级分类
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                this.manyTableData=[]
                this.onlyTableData=[]
                return
            } else {
                // 根据所选分类的ID，和当前所处的面板，获取对应的参数
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: this.activeName
                    }
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败')
                } else {
                    res.data.forEach(item => {
                        if(item.attr_vals.indexOf(',')!==-1){
                             item.attr_vals= item.attr_vals?item.attr_vals.split(','):[]
                        }else{
                            item.attr_vals= item.attr_vals?item.attr_vals.split(' '):[]
                        }
                        // 控制文本显示与隐藏
                        item.inputVisible = false
                        //文本框中输入的值
                        item.inputValue = ''
                        // console.log(item);
                    });
                    // console.log(res.data);
                    if (this.activeName === 'many') {
                        this.manyTableData = res.data
                    } else {
                        this.onlyTableData = res.data
                    }
                }
            }
        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击添加参数对话框确定按钮触发这个函数
        addParams() {
            // 表单验证
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return
                } else {
                    // 添加参数
                    const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加失败!')
                    } else {
                        this.$message.success('添加成功!')
                        this.addParamsDialogVisible = false
                        this.getParamsData()
                    }
                }
            })
        },
        async showEditDialog(scope) {

            // 根据属性ID查询对应参数
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${scope.attr_id}`, {
                params: {
                    attr_sel: this.activeName
                }
            })
            if (res.meta.status !== 200) {
                this.$message.error('获取参数失败')
            } else {
                this.editForm = res.data
            }
            this.editParamsDialogVisible = true

        },
        // 编辑对话框点击确定按钮触发按钮
        editParams() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) {
                    return
                } else {
                    const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('更新失败')
                    } else {
                        this.$message.success('更新成功')
                        this.editParamsDialogVisible = false
                        this.getParamsData()
                    }
                }

            })
        },
        // 监听修改对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 删除参数
        async removeParams(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已经取消删除')
            } else {
                const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if (res.meta.status !== 200) {
                    this.$message.error('删除失败')
                } else {
                    this.getParamsData()
                    this.$message.success('删除成功')

                }
            }
        },
        // 文本框失去焦点，或者按下enter键触发这个函数
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }else{
                // 如果没有return,则证明输入的内容需要做后续处理
                row.attr_vals.push(row.inputValue.trim())
                   // console.log(res);
                // 清空文本框
              
                  row.inputValue = ''
                // 关闭输入框
                row.inputVisible = false
                
               this.saveAttrVals(row)
           

        }
        

        },
        // 展示文本输入框
        showInput(row) {
            row.inputVisible = true
            // console.log(row);
            // 使文本框自动获取焦点
            // $nextTick方法的作用，就是当页面上元素重新渲染之后，才会指定回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除参数项
        handleClosed(i,row){
           row.attr_vals.splice(i,1)
            this.saveAttrVals(row)
        },
       async saveAttrVals(row){
             const {data:res} =await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                })
             
                 if(res.meta.status !== 200){
                this.$message.error('修改参数项失败')
            }else{
                this.$message.success('修改参数项成功')
            }
            }

    },
 created() {
        this.getCateList()
        this.getParamsData()
    },
    computed: {
        // 如果按钮需要被禁用则返回true，否则返回false
        isBtnDisabled() {
            if (this.selectedCateKeys.length !== 3) {
                return true
            } else {
                return false
            }
        },
        // 当前选中的三级分类的ID,因为这里只加最后一级分类的参数
        cateId() {
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            } else {
                return null
            }
        },
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            } else {
                return '静态属性'
            }
        }
    }

}
</script>

<style lang="less" scoped>
.params {
    margin: 20px;
}

.cat_opt {
    margin: 15px 0;
}

.el-tag {
    margin: 10px;
}

.input-new-tag {
    width: 100px;
}
</style>
