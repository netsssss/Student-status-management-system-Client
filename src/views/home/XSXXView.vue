<template>
    <div>
        <el-row>
            <span>搜索:&nbsp;</span>
            <el-input style="width:200px;" placeholder="身份证号" v-model="id_card" @blur="search"></el-input>
            <el-input style="width:200px;" placeholder="学生名" v-model="name" @blur="search"></el-input>
            <el-button type="primary" icon="el-icon-search" style="margin-right:0px;" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" style="margin-left:0px;" @click="doAdd">添加</el-button>
        </el-row>

        <DataTable :tableData="tableData">
            <el-table-column
                width="200"
                fixed="right"
                label="详细信息">
                <template slot-scope="scope">
                    <el-button type="info" plain @click="doDetail(scope.row)">详细信息</el-button>
                </template>
            </el-table-column>
        </DataTable>

        <SchoolRollDetail :form="form" :rolename="rolename" :isSubmit="isSubmit" :showDialog="showDialog" @handleCloseDialog="handleCloseDialog" @VerifyOK="VerifyOK" ></SchoolRollDetail>

    </div>
</template>

<script>
import rest from '../../service/rest'
import DataTable from '../../components/DataTable'
import SchoolRollDetail from '../../components/SchoolRollDetail'
import { mapMutations } from 'vuex'

let vm = new Object({
    data(){
        return{
            id_card: '',
            name: '',
            rolename: '',
            isSubmit: false,
            showDialog: false,
            form:{},
            tableData: {
                data: [],
                labels:['姓名','性别','身份证号','专业','注册状态'],
                props:['name','sex','id_card','major','regist'],
            }
        }
    },
    created(){
        this.search();
    },
    methods:{
        ...mapMutations(["startloading","closeloading"]),

        xsxxQuery(id_card, name){
            this.startloading();
            let username = JSON.parse(Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1])).username;
            let role = JSON.parse(Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1])).role;
            rest.service.roleUserQuery(role, username).then(res => {
                this.rolename = res.msg[0].rolename;
               
                rest.service.xsxxQuery(this.rolename, role, id_card, name).then(res => {
                    this.tableData.data = res.msg;
                    this.closeloading();
                },error =>{
                    console.log('XSXXerror:',error);
                    if(localStorage.getItem('user') == null){
                        this.$router.push('/login');
                    }else{
                        this.$notify.error(`查询失败`);
                    }
                });
            },error =>{
                console.log('ZYGLerror:',error);
                if(localStorage.getItem('user') == null){
                    this.$router.push('/login');
                }
            });
        },
        search(){
            this.xsxxQuery(this.id_card, this.name);
        },
        doAdd(){
            this.form = {
                isAdd: true,
                exist_avatar: false,
                name: '',
                sex: '',
                imageUrl: '',
                id_card: '',
                birth: '',
                school: '',
                major: '',
                birthplace: [],
                birthplace_detail: '',
                regist: '未注册',
                unusual_action: '在籍',
            };
            this.showDialog = true;
        },
        doDetail(index){
            this.form = {
                isAdd: false,
                exist_avatar: true,
                name: index.name,
                sex: index.sex,
                imageUrl: index.imageUrl,
                id_card: index.id_card,
                birth: index.birth,
                school: index.school,
                major: index.major,
                birthplace: index.birthplace.split(','),
                birthplace_detail: index.birthplace_detail,
                regist: index.regist,
                unusual_action: index.unusual_action,
            };
            this.showDialog = true;
        },
        VerifyOK(...thisData){
            rest.service.xsxxInsert(...thisData).then(res => {
                this.showDialog = false;
                this.isSubmit = true;
                this.$notify.success(`添加成功`);
                this.search();
            },error =>{
                console.log('XSXXerror:',error);
                this.$notify.error(`添加失败`);
            });
        },
        handleCloseDialog(){
            this.form = {};
            this.showDialog = false;
        },
    }
});

vm.components = { DataTable, SchoolRollDetail };

export default vm;
</script>

<style scoped>

</style>
