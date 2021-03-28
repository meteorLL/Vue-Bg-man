<template>
<div class="list">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
        <!-- 搜索框和添加商品 -->
        <el-row :gutter="12">
            <!-- 搜索框 -->
            <el-col :span="8">
                <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="searchInputListCleared">
                    <el-button slot="append" icon="el-icon-search" @click="getGoodsList" ></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary">添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 商品列表 -->
        <el-table :data="goodsList" border>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称">
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)" width="100">
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量(KG)" width="100">
            </el-table-column>
            <el-table-column prop="goods_number" label="商品数量(个)" width="100">
            </el-table-column>
           
            
                    <el-table-column label="操作" width="120">
                    <template v-slot="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                    <el-button type="primary" icon="el-icon-edit" circle></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <el-button type="danger" icon="el-icon-delete" circle @click="goodsDelete(scope.row.goods_id)"></el-button></el-button>
                </el-tooltip>
         </template>
            </el-table-column>
                
           
            
        </el-table>
        <!-- 商品分页功能 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryInfo.pagenum" :page-sizes="[5, 10, 20,50]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

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
                query: '',
                // 当前页码
                pagenum: 1,
                // 当前每页显示条数
                pagesize: 10,
            },
            total: 0
        }
    },
    methods: {
        // 获取商品列表
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品列表失败')
            } else {
                this.goodsList = res.data.goods
                this.total = res.data.total
            }
        },
        // 分页切换当前页面数
        handleSizeChange(newSize) {
            // newSize代表当前页面显示条数
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 分页切换页数，newPage代表当前页码
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()

        },
        // 搜索框清空触发的监听事件
        searchInputListCleared(){
            this.getGoodsList()
        },
        // 删除商品
       async goodsDelete(id){
           const confirmResult=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !=='confirm'){
            return this.$message.info('已经取消删除')
        }else{
            const {data:res}=await this.$http.delete(`goods/${id}`)
            if(res.meta.status !==200){
                return this.$message.error('删除商品失败')
            }else{
                this.$message.success('删除商品成功')
                this.getGoodsList()
            }
        }
        }

    },
    created() {
        this.getGoodsList()
    },
}
</script>

<style lang="less" scoped>
.list {
    margin: 20px;
}
</style>
