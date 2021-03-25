<template>
    <div class="users">
        <!-- 面包屑导航区域 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card class="box-card">
  <!-- 搜索与添加区域 -->
  
<el-row :gutter="20">
    <el-col :span="9">
        <el-input placeholder="请输入要查询的用户名" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
  </el-input>
    </el-col>
    <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
    </el-col>

</el-row>
  <el-table
      :data="userList"
      border
      stripe>
      <el-table-column
         type="index" label="#">
      </el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态"
        >
        <template v-slot="scope">
            <!-- {{scope.row}} -->
        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
</el-switch>
        </template>
        </el-table-column>
        <el-table-column
        prop=""
        label="操作"
        width="180px"
        >
        <template v-slot="scope">
            <!-- {{scope.row}} -->
 <!-- 修改按钮 -->
 <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
       <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">

       </el-button>
    </el-tooltip>

 <!-- 删除按钮 -->
 <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
     <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
    </el-tooltip>
 
 <!-- 分配角色按钮 -->
 <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
       <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
    </el-tooltip>

        </template>
        </el-table-column>
    </el-table>
    <!-- 分页区域 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @close='addDialogClosed'>
  <!-- 内容主题区域 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机号" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <!-- 对话框底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改用户信息对话框 -->
<el-dialog
  title="修改用户对话框"
  :visible.sync="EditDialogVisible"
  width="50%"
  @close='editDialogClosed'>
    <!-- 内容主题区域 -->
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
  <el-form-item label="用户名" >
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <!-- 对话框底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="EditDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
</el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            // 获取用户列表的参数对象
            queryInfo:{
            // 搜索关键字
            query:'',
            // 当前页码
            pagenum:1,
            // 当前每页显示条数
            pagesize:2,
            },
            userList:[],
            total:0,
            // 控制对话框的显示与隐藏
            addDialogVisible:false,
            // 添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 添加用户的表单规则
            addFormRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                 password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                 email:[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                 mobile: [
          // 添加正则表达式 pattern: /^1[3|5|7|8|9]\d{9}$/，验证手机号是否正确
                { required: true, message: '请输入手机号', trigger: 'change' },
                { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change' }
                ],
                 
            },
            editFormRules:{
                 email:[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                 mobile: [
          // 添加正则表达式 pattern: /^1[3|5|7|8|9]\d{9}$/，验证手机号是否正确
                { required: true, message: '请输入手机号', trigger: 'change' },
                { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change' }
                ],
                 
            },
            // 控制用户修改信息对话框的显示与隐藏
            EditDialogVisible:false,
            // 查询到订单用户信息对象
            editForm:{

            },
            scope_id:''


        
        }
    },
    methods:{
        async getUserList(){
           const {data:res}=await this.$http.get('users',{
                params:this.queryInfo
            })
            // console.log(res);
            if(res.meta.status !== 200){
                return this.$message.error('获取用户列表失败')
            }
            this.userList =res.data.users
            this.total =res.data.total
            // console.log(this.userList);
        },
        // 监听pagesize改变的事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        // 重新获取用户数据
        this.getUserList()
        console.log(newSize);

    },
    handleCurrentChange(newPage){
        // console.log(newPage);
        this.queryInfo.pagenum =newPage
        // 重新获取用户数据
        this.getUserList()

    },
    // 监听用户状态开关
    async userStateChange(userInfo){
        // console.log(userInfo);
        const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        console.log(res);
        if(res.meta.status !== 200){
            userInfo.mg_state =!userInfo.mg_state
            return this.$message.error('更新状态失败')
        }else{
            this.$message.success('更新状态成功')

        }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()

    },
    // 添加用户
    addUser(){
        this.$refs.addFormRef.validate(async valid =>{
            // 校验成功则为true，校验石失败则为false
            // console.log(valid);
            // 如果校验失败，则直接return，就不走添加的逻辑
            if(!valid){
                return
            }else{
                // 如果校验成功则执行添加逻辑，发起网络请求，完成添加用户
                const {data : res}=await this.$http.post('users',this.addForm)
                // console.log(res);
                if(res.meta.status !== 201){
                    if(res.meta.status == 400){
                        this.$message.warning('用户已存在')
                        }else{
                            this.$message.error('添加用户失败')
                        }
                    
                } else{
                    this.$message.success('用户添加成功')
                    // 关闭添加用户对话框
                    this.addDialogVisible = false
                    // 刷新列表，调用获得用户列表即可
                    this.getUserList()
                }

            }
        })
    },
      // 展示编辑用户的对话框
    async showEditDialog(id){
       const {data:res} = await this.$http.get(`users/${id}`)
    //    console.log(res);
       if(res.meta.status !== 200){
           return this.$message.error('查询用户信息失败')
       }else{
        this.editForm =res.data
       }
       this.scope_id=id
        this.EditDialogVisible = true
        
        // console.log(id);
    },
    // 监听修改用户关闭事件
    editDialogClosed(){
        this.$refs.editFormRef.resetFields()
    },
    // 点击修改用户对话框确定按钮，执行监听事件
    editUser(){
        // 对话框预校验
        this.$refs.editFormRef.validate( async valid => {
            // console.log(valid);
            // 预校验不通过
            if(!valid){
                return
            }else{
                const {data :res}=await this.$http.put(`users/${this.scope_id}`,
                {email:this.editForm.email,mobile:this.editForm.mobile})
                // console.log(res);
                if(res.meta.status !== 200){
                    return this.$message.error('修改用户信息失败')
                }else{
                    this.EditDialogVisible =false
                    this.getUserList();
                    this.$message.success('修改用户信息成功')
                }
            }
        })
    },
    // 根据id删除对应的用户信息
    async removeUserById(id){
        // console.log(id);
        // 先弹窗询问用户是否删除
         const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户点击确认删除按钮，则返回值为字符串 confirm
        // 如果用户点击取消删除按钮，则返回值为字符串 cancel

        // console.log(typeof(confirmResult));
        if(confirmResult !=='confirm'){
            return this.$message.info('已经取消删除')
        }else{
            const {data:res}=await this.$http.delete(`users/${id}`)
            if(res.meta.status !==200){
                return this.$message.error('删除用户失败')
            }else{
                this.$message.success('删除用户成功')
                this.getUserList()
            }
        }
    }
    },
// 生命周期函数
    created(){
        this.getUserList()
        

    }
}
</script>
<style lang="less" scoped>
.users {
    margin: 20px
}
</style>