<template>

<el-container class="home-container">
  <!-- 头部 -->
  <el-header>
      <div>
          <!-- <img src="" alt=""> -->
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' :'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单效果 -->
        <el-menu
      background-color="#333744"
      text-color="#fff"
      :unique-opened="true"
      active-text-color="#409EFF" 
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subItem.path  " v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
          <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
    </el-aside>
    <!-- 主体区域 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
  created(){
    this.getMenuList()
// console.log(666);
    this.activePath = window.sessionStorage.getItem('activePath')
  },
    data(){
        return{
          menuList:[],
          iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      //是否折叠
      isCollapse:false,
      // 被激活的链接地址
      activePath:''

        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
            this.$message('退出成功');

        },
        // 获取所有的菜单
        async getMenuList(){
          //结构赋值
          const {data : res} =await this.$http.get('menus')
          if(res.meta.status !==200){
            return this.$message.error(res.meta.msg)
          }
          this.menuList =res.data
          // console.log(res);
        },
        toggleCollapse(){
          this.isCollapse = !this.isCollapse;

        },
        saveNavState(activePath){
          window.sessionStorage.setItem('activePath',activePath)
    this.activePath = window.sessionStorage.getItem('activePath')

        }
    }
}
</script>
<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    display: flex;
    justify-content: space-between;
    padding-left: 15px;
    background-color: #373d41;
    align-items: center;
    color: #fff;
    font-size: 20px;
}
.el-aside{
    background-color: #333744;
    .el-menu {
      border-right:none
    }
}
.el-main{
    background-color: #eaedf1;
    padding: 0;
}
.iconfont{
  margin-right:10px ;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>