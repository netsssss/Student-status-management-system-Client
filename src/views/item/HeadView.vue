<template>
    <el-row>
        <el-col id="title" :span="20">
            <slot name='title'></slot>
        </el-col>
        
        <el-col :span="4">
            <el-row id="setting">
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="el-icon-setting" circle></i>
                        <span>{{username}}[{{rolename}}]</span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="own">个人中心</el-dropdown-item>
                        <el-dropdown-item command="set">设置</el-dropdown-item>
                        <el-dropdown-item command="out" divided>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-row>          
        </el-col>
    </el-row>
</template>

<script>
/**
 * 头部组件，需要传入两个参数“用户名和角色名”；
 * 点击按钮对父组件分别触发三个事件：“own：个人中心，set：设置，out：退出登录”。
 */
import rest from '@/service/rest'

let vm = new Object({
    props:[
        "username",
        "rolename"
    ],
    methods: {
        out(){
            this.$confirm('此操作将退出当前登录账户, 是否继续?', '退出', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit("out");
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消退出'
                });          
            });
        },
        handleCommand(command) {
            switch(command){
                case 'own':
                    this.$emit("own");
                    break;
                case 'set':
                    this.$emit("set");
                    break;
                case 'out':
                    this.out();
                    break;
            }
        }
    }
});


export default vm;
</script>

<style>
#title{
    margin-top: 20px;
    font-size: 16px;
    font-weight: bold;
    color:#409EFF;
}

#setting{
    margin-top: 20px;
    float: right;
}

#setting :hover{
    cursor: pointer;
    color: #409EFF;
}
</style>
