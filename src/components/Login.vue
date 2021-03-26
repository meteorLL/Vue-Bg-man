
<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区 -->
            <div class="avatar_box">
                <img src="../assets/logo.jpg" alt="">
            </div>
            <!-- 登录表单区 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username" >
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom" placeholder="用户名"></el-input>
                </el-form-item>
            <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock"   type="password" placeholder="密码">
            
                    </el-input>
                </el-form-item>
            <!-- 按钮区域 -->
                <el-form-item class="btns" >
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="button" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>


export default {
    
    data(){
        return {
            //这是登录表单的数据表单对象
            loginForm:{
                username:'',
                password:''
            },
            // 这是表单验证规则的对象
            loginFormRules:{
                // 验证用户名是否合法
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        resetLoginForm(){
            // console.log(this);
            // 这是在上面对组件实例进行了定义，名为loginFormRef，然后调用resetFields()，所以就实现了重置
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            // 预校验
            this.$refs.loginFormRef.validate(async(valid)=>{
                // console.log(valid);
               if(!valid) {
                   return;
                   }
               else{
                //login是请求路径，this.loginForm是请求对象
               const { data:res } = await this.$http.post('login',this.loginForm)
            //    console.log(res);
                if(res.meta.status !== 200) {
                   return this.$message.error('登录失败')
                   }else{
                       this.$message.success('登录成功');
                    //    将登录成功后的token，保存到客户端的sessionStorage中，因为需要登录成功后才能访问其它API
                       window.sessionStorage.setItem('token',res.data.token);
                    //    将导航栏路径改为/home
                       this.$router.push('/home')

                   }
               }
               
            });
        }
    }
}
</script>
<style lang="less" scoped>
// 注意：less表示这里可以使用less语法，scoped代表样式只在这个login组件生效，去掉后则会全局生效
.login_container{
    position: relative;
    background-color: #2b4b6b ;
    height: 100%;
}
.login_box{
    position: absolute;
    transform: translate(-50%,-50%);
    left: 50%;
    top: 50%;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
.avatar_box{
    position: absolute;
    left: 50%;
    top: 3px;
    transform: translate(-50%,-50%);
    height: 130px;
    width: 130px;
    border:1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    // padding: 10px;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;

    }
}

}
.btns {
    display: flex;
    justify-content: flex-end;
}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>