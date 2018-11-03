<template>
    <div>
        <el-row>
            <span>搜索:&nbsp;</span>
            <el-input style="width:200px;" placeholder="身份证号" v-model="id_card" @blur="search"></el-input>
            <el-input style="width:200px;" placeholder="学生名" v-model="name" @blur="search"></el-input>
            <el-button type="primary" icon="el-icon-search" style="margin-right:0px;" @click="search">搜索</el-button>
            <el-button type="success" icon="el-icon-check" style="margin-left:0px;" @click="doSubmitAll">批量{{button_text}}</el-button>
        </el-row>

        <DataTable :tableData="tableData" @selectionChange="handleSelectionChange">
            <el-table-column
                sortable
                sort-by="regist"
                width="200"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="info" plain @click="doDetail(scope.row)">详细信息</el-button>
                    <el-button slot="reference" type="success" v-if="!testRole(scope.row.regist)" icon="el-icon-check" @click="doSubmit(scope.row.id_card)">{{button_text}}</el-button>
                </template>
            </el-table-column>
        </DataTable>

        <SchoolRollDetail :form="form" rolename="is_no_School" :isSubmit="isSubmit" :showDialog="showDialog" @handleCloseDialog="handleCloseDialog" ></SchoolRollDetail>

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
            username: JSON.parse(Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1])).username,
            role: JSON.parse(Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1])).role,
            rolename: '管理员',
            button_text: '',
            id_card: '',
            name: '',
            form:{},
            isSubmit: false,
            showDialog: false,
            multipleSelection: [],
            tableData: {
                data: [],
                labels:['姓名','性别','身份证号','学校','注册状态'],
                props:['name','sex','id_card','school','regist'],
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
            if(this.role == '管理员'){
                this.xsxxQueryReal('','',id_card, name);
            }else{
                rest.service.roleUserQuery(this.role, this.username).then(res => {
                    this.rolename = res.msg[0].rolename;
                    this.xsxxQueryReal(this.rolename, this.role, id_card, name);
                    this.closeloading();
                },error =>{
                    console.log('XJZMerror:',error);
                    if(localStorage.getItem('user') == null){
                        this.$router.push('/login');
                    }
                });
            }
        },
        xsxxQueryReal(rolename, role, id_card, name){
            rest.service.xsxxQuery(rolename, role, id_card, name).then(res => {
                this.tableData.data = res.msg;
                this.closeloading();
            },error =>{
                console.log('XJZMerror:',error);
                this.$notify.error(`查询失败`);
            });
        },
        search(){
            this.xsxxQuery(this.id_card, this.name);
            this.testRole();
        },
        testRole(regist){
            let result = true;
            switch(this.role){
                case '管理员':
                    this.button_text = '注册';
                    result = regist == '已注册';
                    break;
                case '省教育局':
                    this.button_text = '通过';
                    result = regist != '省教育局审核中';
                    break;
                case '市教育局':
                    this.button_text = '通过';
                    result = regist != '市教育局审核中';
                    break;
                case '学校':
                    this.button_text = '提交';
                    result = regist != '未注册';
                    break;
            }
            return result;
        },
        doSubmit(id_card){
            this.$confirm('确定'+this.button_text+'吗?', this.button_text, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                rest.service.xjzmUpdate(this.role, id_card).then(res => {
                    this.$notify.success(this.button_text+`成功`);
                    this.xsxxQuery('','');
                },error =>{
                    console.log('XJZMerror:',error);
                    if(localStorage.getItem('user') == null){
                        this.$router.push('/login');
                    }else{
                        this.$notify.error(`操作失败`);
                    }
                });
            }).catch(() => {
                this.multipleSelection = ''
                this.$message({
                    type: 'info',
                    message: '已取消'+this.button_text
                });          
            });
            
        },
        doSubmitAll(){
            if(this.multipleSelection.length == 0){
                this.$message({
                    type: 'info',
                    message: '请选择至少一行'
                });   
            }else{
                this.$confirm('此操作将'+this.button_text+'所有选中行, 是否继续?', '批量'+this.button_text, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let params = [];
                    let hasPower = true;
                    this.multipleSelection.forEach((item) => {
                        if(this.testRole(item.regist)){
                            this.$message({
                                type: 'error',
                                message: '请勿越权操作'
                            });
                            hasPower = false;
                        }
                        params.push(item.id_card)
                    });
                    if(hasPower){
                        rest.service.xjzmUpdate(this.role, params).then(res => {
                            this.$notify.success(this.button_text+`成功`);
                            this.xsxxQuery('','');
                        },error =>{
                            console.log('XJZMerror:',error);
                            if(localStorage.getItem('user') == null){
                                this.$router.push('/login');
                            }else{
                                this.$notify.error(`操作失败`);
                            }
                        });
                    }
                }).catch(() => {
                    this.multipleSelection = ''
                    this.$message({
                        type: 'info',
                        message: '已取消'+this.button_text
                    });
                });
            }
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
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        handleCloseDialog(){
            this.form = {};
            this.showDialog = false;
        }
    }
});

vm.components = { DataTable, SchoolRollDetail };

export default vm;
</script>

<style scoped>
</style>