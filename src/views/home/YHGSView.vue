<template>
    <div>
        <el-row>
            <span>搜索:&nbsp;</span>
            <el-input style="width:200px;" placeholder="用户名" v-model="searchName" @blur="search"></el-input>
            <el-select style="width:200px;" placeholder="身份" v-model="searchRole" @change="handleRoleChange">
                <el-option label="" value=""></el-option>
                <el-option label="管理员" value="管理员"></el-option>
                <el-option label="省教育局" value="省教育局"></el-option>
                <el-option label="市教育局" value="市教育局"></el-option>
                <el-option label="学校" value="学校"></el-option>
            </el-select>
            <el-select style="width:200px;" placeholder="所属省" v-model="area.provname" v-if="showProv" @change="handleProvinceChange">
                <el-option label="" value=""></el-option>
                <el-option :label="item.provname" :value="item.provname" v-for="(item,index) in area.provnames" :key="index"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" style="margin-right:0px;" @click="search">搜索</el-button>
        </el-row>

        <DataTable :tableData="tableData"></DataTable>

    </div>
</template>

<script>
import rest from '@/service/rest'
import DataTable from '@/components/DataTable'
import { mapMutations } from 'vuex'

let vm = new Object({
    data() {
        return{
            searchName: '',
            searchRole: '',
            showProv: false,
            
            area:{
                provnames: [],
                provname: ''
            },
            tableData: {
                data: [],
                labels:['用户名','身份','所属省','所属市','所属院校'],
                props:['username','role','provname','cityname','schoolname'],
            }
        }
    },
    created(){
        this.search();
    },
    methods: {
        ...mapMutations(["startloading","closeloading"]),

        yhgsQuery(username, role, provname){
            this.startloading();
            rest.service.yhgsQuery(username, role, provname).then(res => {
                this.tableData.data = res.msg;
                this.closeloading();
            },error =>{
                console.log('YHGSerror:',error);
                this.$notify.error(`查询失败`);
            });
        },
        provQuery(){           
            rest.service.provinceQuery().then(res => {
                this.area.provnames = res.msg;
            },error =>{
                console.log('prov_query_error:',error);
            });
        },
        search(){
            this.yhgsQuery(this.searchName,this.searchRole,this.area.provname);
        },
        handleRoleChange(val){
            if(val == '') {
                this.area.provname = '';
                this.showProv = false;
            }else {
                this.showProv = true;
            }
            this.provQuery();
            this.search();
        },
        handleProvinceChange(val){
            this.area.provname = val;
            this.search();
        },
    }

});

vm.components = { DataTable };

export default vm;
</script>

<style scoped>

</style>
