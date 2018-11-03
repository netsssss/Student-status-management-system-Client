<template>
    <div>
        <el-row>
            <span>搜索:&nbsp;</span>
            <el-input style="width:200px;" placeholder="专业编号" v-model="majorid" @blur="search"></el-input>
            <el-input style="width:200px;" placeholder="专业名" v-model="majorname" @blur="search"></el-input>
            <el-button type="primary" icon="el-icon-search" style="margin-right:0px;" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" style="margin-left:0px;" @click="doAdd">添加</el-button>
        </el-row>

        <DataTable :tableData="tableData"></DataTable>

        <addMajor :form="form" :showDialog="showDialog" @majorTitleChange="handleMajorTitleChange" @handleCloseDialog="handleCloseDialog" @VerifyOK="VerifyOK"></addMajor>

    </div>
</template>

<script>
import rest from '@/service/rest'
import DataTable from '@/components/DataTable'
import addMajor from '@/components/addMajor'
import { mapMutations } from 'vuex'

let vm = new Object({
    data(){
        return{
            majorid: '',
            majorname: '',
            showDialog: false,
            form: {
                title: '',
                majorid: '',
                majorname: '',
                majorid_title: '',
            },
            tableData: {
                data: [],
                labels:['专业编号','专业名'],
                props:['majorid','majorname'],
            }
        }
    },
    created(){
        this.search();
    },
    methods:{
        ...mapMutations(["startloading","closeloading"]),

        zykQuery(majorid, majorname){
            this.startloading();
            rest.service.zykQuery(majorid, majorname).then(res => {
                this.tableData.data = res.msg;
                this.closeloading();
            },error =>{
                console.log('ZYKerror:',error);
                this.$notify.error(`查询失败`);
            });
        },
        search(){
            this.zykQuery(this.majorid,this.majorname);
        },
        doAdd(){
            this.form.title = '添加',
            this.form.majorid = '';
            this.form.majorname = '';
            this.form.majorid_title = '01';
            this.showDialog = true;
        },
        VerifyOK(...thisData){
            this.startloading();
            rest.service.zykInsert(...thisData).then(res => {
                this.closeloading();
                this.$notify.success(`添加成功`);
                this.search();
            },error =>{
                console.log('ZYKerror:',error);
                this.closeloading();
                this.$notify.error(`添加失败`);
            });
            this.showDialog = false;
        },
        handleMajorTitleChange(val){
            this.form.majorid_title = val;
        },
        handleCloseDialog(){
            this.form = {};
            this.showDialog = false;
        }
    }

});

vm.components = { DataTable, addMajor };

export default vm;
</script>

<style scoped>

</style>
