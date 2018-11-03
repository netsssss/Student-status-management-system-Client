<template>
    <div>
        <el-row>
            <span>搜索:&nbsp;</span>
            <el-input style="width:200px;" placeholder="用户名" v-model="searchName" @blur="search"></el-input>
            <el-select style="width:200px;" placeholder="身份" v-model="searchRole" @change="search">
                <el-option label="" value=""></el-option>
                <el-option label="管理员" value="管理员"></el-option>
                <el-option label="省教育局" value="省教育局"></el-option>
                <el-option label="市教育局" value="市教育局"></el-option>
                <el-option label="学校" value="学校"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" style="margin-right:0px;" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" style="margin-left:0px;" @click="doAdd">添加</el-button>
            <el-button type="danger" icon="el-icon-delete" style="margin-left:0px;" @click="doDeleteAll">批量删除</el-button>
        </el-row>
        <DataTable :tableData="tableData" @selectionChange="handleSelectionChange">
            <el-table-column
                width="200"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="doUpdate(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="doDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </DataTable>

        <UserInfo :form="form" :isEdit="isEdit" :showDialog="showDialog" @handleCloseDialog="handleCloseDialog" @VerifyOK="VerifyOK"></UserInfo>

    </div>
</template>

<script>
import rest from '@/service/rest'
import DataTable from '@/components/DataTable'
import UserInfo from '@/components/UserInfo'
import { mapMutations } from 'vuex'

let vm = new Object({
    data() {
        return {
            searchName: '',
            searchRole: '',
            multipleSelection: [],
            visibleDel: false,
            isEdit: false,
            showDialog: false,
            form: {
                title: '',
                username: '',
                password: '',
                role: ''
            },
            tableData: {
                data: [],
                labels:['用户名','身份'],
                props:['username','role'],
            }
        }
    },
    created(){
        this.search();
    },
    methods: {
        ...mapMutations(["startloading","closeloading"]),

        yhglQuery(username,role){
            this.startloading();
            rest.service.yhglQuery(username,role).then(res => {
                this.tableData.data = res.msg;
                this.closeloading();
            },error => {console.log('YHGLerror:',error);});
        },
        search(){
            this.yhglQuery(this.searchName,this.searchRole);
        },
        doAdd(){
            this.isEdit = false;
            this.form.title = '添加',
            this.form.username = '';
            this.form.password = '';
            this.form.role = '';
            this.showDialog = true;
        },
        doUpdate(row){
            this.isEdit = true;
            this.form.title = '编辑',
            this.form.username = row.username;
            this.form.password = '';
            this.form.role = row.role;
            this.showDialog = true;
        },
        doDelete(row){
            this.$confirm('此操作将永久删除选中的数据, 是否继续?', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                rest.service.yhglDelete(row.username).then(res => {
                    this.$notify.success(`删除成功`);
                    this.search();
                },error =>{
                    console.log('YHGLerror:',error);
                    this.$notify.error(`删除失败`);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        doDeleteAll(){
            if(this.multipleSelection.length == 0){
                this.$message({
                    type: 'info',
                    message: '请选择至少一行'
                });   
            }else{
                this.$confirm('此操作将永久删除选中的多项数据, 是否继续?', '批量删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var params = [];
                    this.multipleSelection.forEach((item) => {
                        params.push(item.username)
                    });
                    rest.service.yhglDelete(params).then(res => {
                        this.multipleSelection = []
                        this.$notify.success(`删除成功`);
                        this.search();
                    },error =>{
                        console.log('YHGLerror:',error);
                        this.multipleSelection = []
                        this.$notify.error(`删除失败`);
                    });
                }).catch(() => {
                    this.multipleSelection = ''
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
        VerifyOK(...thisData){
            this.startloading();
            if(this.isEdit){
                rest.service.yhglUpdate(...thisData).then(res => {
                    this.closeloading();
                    this.$notify.success(`编辑成功`);
                    this.search();
                },error =>{
                    console.log('YHGLerror:',error);
                    this.$notify.error(`编辑失败`);
                    this.closeloading();
                });
            }else{
                rest.service.yhglInsert(...thisData).then(res => {
                    this.closeloading();
                    this.$notify.success(`添加成功`);
                    this.search();
                },error =>{
                    console.log('YHGLerror:',error);
                    this.$notify.error(`添加失败`);
                    this.closeloading();
                });
            }
            this.showDialog = false;
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        handleCloseDialog(){
            this.form = {};
            this.showDialog = false;
        }
    }
});

vm.components = { DataTable, UserInfo };

export default vm;
</script>

<style scoped>

</style>