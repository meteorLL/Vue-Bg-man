<template>
<div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 搜索与添加区域 -->
        <el-row>
            <!-- 添加角色区域 -->
            <el-col>
                <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <el-table :data="rolesList" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template v-slot="scope">
                    <!-- <pre>{{scope.row}}</pre> -->
                    <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" :gutter="24" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row, item1.id)">
                                {{ item1.authName }}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环嵌套渲染二级权限 -->
                            <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>

                                <el-col :span="18">
                                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                                        {{ item3.authName }}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="roleName" label="权限名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column prop="level" label="操作" width="180px">
                <template v-slot="scope">
                    <!-- <pre>{{scope.row}}</pre> -->
                    <!-- 修改按钮 -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                        </el-button>
                    </el-tooltip>

                    <!-- 删除按钮 -->
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleInfo(scope.row.id)"></el-button>
                    </el-tooltip>
                    <!-- 分配角色按钮 -->
                    <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleClosed">
            <!-- 内容主题区域 -->
            <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName" label-width="80px">
                    <el-input v-model="addRoleForm.roleName" width="100px"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色信息对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleClosed">
            <!-- 内容主题区域 -->
            <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName" label-width="80px">
                    <el-input v-model="editRoleForm.roleName" width="100px"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole(editRoleForm.roleId)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <el-tree :data="rightsList" :props="treeProps" default-expand-all show-checkbox node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [],
            // 控制对话框显示与隐藏
            addRoleDialogVisible: false,
            // 添加角色的表单数据
            addRoleForm: {
                roleName: "",
                roleDesc: "",
            },
            // 添加角色的表单规则
            addRoleFormRules: {
                roleName: [
                    { required: true, message: "请输入角色名称", trigger: "blur" },
                    { min: 2, max: 8, message: "长度在 2 到 8个字符", trigger: "blur" },
                ],
                roleDesc: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 3,
                        max: 15,
                        message: "长度在 3 到 15 个字符",
                        trigger: "blur",
                    },
                ],
            },
            // 修改角色信息
            // 控制对话框显示与隐藏
            editRoleDialogVisible: false,
            // 查询到订单影虎信息对象
            // 修改角色信息的表单数据
            editRoleForm: {},
            // 修改角色信息的表单规则
            editRoleFormRules: {
                roleName: [
                    { required: true, message: "请输入角色名称", trigger: "blur" },
                    { min: 2, max: 8, message: "长度在 2 到 8个字符", trigger: "blur" },
                ],
                roleDesc: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 3,
                        max: 15,
                        message: "长度在 3 到 15 个字符",
                        trigger: "blur",
                    },
                ],
            },
            // 分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            // 所以权限数据列表
            rightsList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                children: "children",
                label: "authName",
            },
            // 默认选中的节点Id值数组
            defKeys: [],
            // 当前即将分配角色权限的id
            roleId: "",
        };
    },
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get("roles", {
                param: this.rolesList,
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败");
            } else {
                this.rolesList = res.data;
            }
        },
        // 添加角色对话框关闭触发时间
        addRoleClosed() {
            this.$refs.addRoleFormRef.resetFields();
        },
        // 添加角色
        addRole() {
            this.$refs.addRoleFormRef.validate(async (valid) => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 预校验没通过，则进行添加角色，调用添加角色API
                    const { data: res } = await this.$http.post(
                        "roles",
                        this.addRoleForm
                    );
                    if (res.meta.status !== 201) {
                        this.$message.error("角色添加失败");
                    } else {
                        this.$message.success("角色添加成功");
                        this.addRoleDialogVisible = false;
                        this.getRolesList();
                    }
                }
            });
        },
        // 编辑角色
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`roles/${id}`);
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error("查询角色信息失败");
            } else {
                this.editRoleForm = res.data;
                // console.log(this.EditRoleForm);
            }
            this.editRoleDialogVisible = true;
        },
        // 监听修改用户关闭事件
        editRoleClosed() {
            this.$refs.editRoleFormRef.resetFields();
        },
        // 点击确认编辑按钮
        editRole(id) {
            // 预校验
            this.$refs.editRoleFormRef.validate(async (valid) => {
                if (!valid) {
                    return;
                } else {
                    const { data: res } = await this.$http.put(
                        `roles/${id}`,
                        this.editRoleForm
                    );
                    if (res.meta.status !== 200) {
                        return this.$message.error("修改角色信息失败");
                    } else {
                        this.editRoleDialogVisible = false;
                        this.getRolesList();
                        this.$message.success("修改角色信息成功");
                    }
                }
            });
        },
        // 根据id删除角色信息
        async removeRoleInfo(id) {
            //    console.log(id);
            // 先弹窗提示是否删除
            const confirmResult = await this.$confirm(
                "此操作将永久删除该角色, 是否继续?",
                "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            // 如果用户点击确认删除按钮，则返回值为字符串 confirm
            // 如果用户点击取消删除按钮，则返回值为字符串 cancel

            // console.log(typeof(confirmResult));
            if (confirmResult !== "confirm") {
                return this.$message.info("已经取消删除");
            } else {
                const { data: res } = await this.$http.delete(`roles/${id}`);
                if (res.meta.status !== 200) {
                    return this.$message.error("删除角色失败");
                } else {
                    this.$message.success("删除角色成功");
                    this.getRolesList();
                }
            }
        },
        // 移除指定角色的权限功能
        async removeRightById(role, rightId) {
            // 先弹窗提示是否删除
            const confirmResult = await this.$confirm(
                "此操作将永久删除该角色, 是否继续?",
                "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            // 如果用户点击确认删除按钮，则返回值为字符串 confirm
            // 如果用户点击取消删除按钮，则返回值为字符串 cancel

            // console.log(typeof(confirmResult));
            if (confirmResult !== "confirm") {
                return this.$message.info("已经取消删除");
            } else {
                console.log(role);
                // scope.id代表角色id，rightId代表要删除的权限id
                const { data: res } = await this.$http.delete(
                    `roles/${role.id}/rights/${rightId}`
                );
                if (res.meta.status !== 200) {
                    return this.$message.error("取消权限失败");
                } else {
                    this.$message.success("取消权限成功");
                    // 防止重新刷新页面，导致拓展关闭
                    role.children = res.data;
                }
            }
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role) {
            this.roleId = role.id;
            const { data: res } = await this.$http.get("rights/tree");
            if (res.meta.status !== 200) {
                return this.$message.error("获取权限列表失败");
            } else {
                // 把获取到的数据保存到rightList中
                this.rightsList = res.data;
            }
            //    递归获取三级节点的Id
            this.getLeafKeys(role, this.defKeys);
            //    console.log(this.rightsList);
            this.setRightDialogVisible = true;
        },
        // 通过递归的形式获取角色下所以三级权限的Id，并保存到defkeys数组中
        getLeafKeys(node, arr) {
            // console.log(node);
            // 如果当前node节点不包含children属性，则是三级节点
            if (!node.children) {
                return arr.push(node.id);
            } else {
                node.children.forEach((item) => {
                    this.getLeafKeys(item, arr);
                });
            }
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClosed() {
            this.defKeys = [];
        },
        // 为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ];
            const idStr = keys.join(",");
            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`, { rids: idStr }
            );

            if (res.meta.status !== 200) {
                return this.$message.error("分配权限失败");
            } else {
                this.$message.success("分配权限成功");
                this.getRolesList();
                this.setRightDialogVisible = false;
            }
        },
    },
    created() {
        this.getRolesList();
    },
};
</script>

<style lang="less" scoped>
.roles {
    margin: 20px;
}

// 使一级标签有一点间隙
.el-tag {
    margin: 7px;
}

// 在一级标签的第一个标签头部加上边框
.bdtop {
    border-top: 1px solid #eee;
}

// 在每一个一级标签底部加上边框
.bdbottom {
    border-bottom: 1px solid #eee;
}

// 使一级菜单垂直居中
.vcenter {
    display: flex;
    align-items: center;
}
</style>
