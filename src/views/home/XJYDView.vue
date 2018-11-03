<template>
    <div>
        <el-row>
            <span>搜索:&nbsp;</span>
            <el-input style="width:200px;" placeholder="异动编号" v-model="id" @blur="search"></el-input>
            <el-input style="width:200px;" placeholder="身份证号" v-model="id_card" @blur="search"></el-input>
            <el-button type="primary" icon="el-icon-search" style="margin-right:0px;" @click="search">搜索</el-button>
            <el-button type="warning" icon="el-icon-edit-outline" v-if="role == '学校'" style="margin-left:0px;" @click="doPutUA">学籍异动</el-button>
        </el-row>
        <DataTable :tableData="tableData">
            <el-table-column
                sortable
                sort-by="ua_state"
                width="200"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button slot="reference" type="primary" v-if="!testRole(scope.row)" icon="el-icon-edit-outline" @click="doShowUpdate(scope.row.ua_id,'')">{{button_text}}</el-button>
                    <el-button slot="reference" type="info" plain v-if="role == '学校'" @click="doShowUpdate(scope.row.ua_id,'')">详情</el-button>
                </template>
            </el-table-column>
        </DataTable>

        <UnusualActionDialog :role="role" :showDialog="showDialog" :isadd="isadd" :ua_form="ua_form" @handleCloseDialog="handleCloseDialog" @VerifyOK="VerifyOK"></UnusualActionDialog>

    </div>
</template>

<script>
import rest from '../../service/rest'
import DataTable from '../../components/DataTable'
import UnusualActionDialog from '../../components/UnusualActionDialog'
import { mapMutations } from 'vuex'

let vm = new Object({
    data(){
        return{
            username: JSON.parse(Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1])).username,
            role: JSON.parse(Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1])).role,
            xsxxData: [],
            id:'',
            id_card: '',
            name: '',
            form: {},
            showDialog: false,
            isadd:false,
            ua_form: {},
            tableData: {
                data: [],
                labels:['异动编号','身份证号','异动栏目','异动时间','异动状态'],
                props:['ua_id','ua_id_card','ua_type','ua_date','ua_state'],
            }
        }
    },
    created(){
        this.search();
    },
    methods:{
        ...mapMutations(["startloading","closeloading"]),

        xjydQuery(id,id_card){
            this.startloading();
            rest.service.xjydQuery(id,id_card).then(res => {
                this.tableData.data = res.msg;
                this.closeloading();
            },error =>{
                console.log('XJYDerror:',error);
            });
        },
        /**
        * 根据身份证号和姓名查询学生信息的方法
        * 如果是管理员将可以拥有最高级权限：查询所有学生的信息
        */
        xsxxQuery(id_card, name){
            let xx = new Promise((resolve,reject) => {
                if(this.role == '管理员'){
                    rest.service.xsxxQuery('', '', id_card, name).then(res => {
                        this.xsxxData = res.msg;
                        resolve(res.msg);
                    },error =>{
                        console.log('XJYDerror:',error);
                        if(localStorage.getItem('user') == null){
                            this.$router.push('/login');
                        }
                        reject('err');
                    });
                }else{
                    rest.service.roleUserQuery(this.role, this.username).then(res => {
                        let rolename = res.msg[0].rolename;
                        rest.service.xsxxQuery(rolename, this.role, id_card, name).then(res => {
                            this.xsxxData = res.msg;
                            resolve(res.msg);
                        },error =>{
                            console.log('XJYDerror:',error);
                            if(localStorage.getItem('user') == null){
                                this.$router.push('/login');
                            }
                            reject('err');
                        });
                    },error =>{
                        console.log('XJYDerror:',error);
                        if(localStorage.getItem('user') == null){
                            this.$router.push('/login');
                        }
                    });
                }
            });
            return xx;
        },
        search(){
            this.xjydQuery(this.id, this.id_card);
        },
        testRole(row){
            let result = true;
            switch(this.role){
                case '管理员':
                    this.button_text = '详情';
                    result = row.ua_state == '在籍'||row.ua_state == '已通过';
                    break;
                case '省教育局':
                    this.button_text = '详情';
                    result = row.ua_state != '省教育局审核中';
                    break;
                case '市教育局':
                    this.button_text = '详情';
                    result = row.ua_state != '市教育局审核中';
                    break;
                case '学校':
                    this.button_text = '异动';
                    result = true;
                    break;
            }
            return result;
        },
        doPutUA(){
            this.isadd = true;
            this.$prompt('请输入身份证号', '学籍异动', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                inputErrorMessage: '身份证格式不正确',
                lockScroll:false,
                }).then(({ value }) => {
                    this.doShowUpdate('', value);
                }).catch((err) => {
                    console.log(err);
            });
        },
        // row,
        doShowUpdate(id, ua_id_card){;
            this.isadd = false;
            let _self = this;
            let getinfo = new Promise((resolve,reject) => {
                rest.service.xjydQuery(id, ua_id_card).then(res => {
                    let msg = res.msg[0];
                    let ua_form = {};
                    if(msg != null){
                        this.ua_form = {
                            ua_isSchool: false,
                            ua_school: msg.ua_school,
                            ua_id: msg.ua_id,
                            ua_id_card: msg.ua_id_card,
                            ua_type: msg.ua_type,
                            ua_date: msg.ua_date,
                            ua_state: msg.ua_state,
                            ua_describe: msg.ua_describe,
                            ua_oldmajor: msg.ua_oldmajor,
                            ua_newmajor: msg.ua_newmajor,
                        }
                    }else{
                        this.ua_form = {
                            ua_isSchool: true,
                            ua_school: '',
                            ua_id: '自动分配',
                            ua_id_card: ua_id_card,
                            ua_type: '',
                            ua_date: '',
                            ua_state: '',
                            ua_describe: '',
                            ua_oldmajor: '',
                            ua_newmajor: '',
                        }
                    }
                    resolve(ua_form);
                },error =>{
                    console.log('XJYDerror:',error);
                    if(localStorage.getItem('user') == null){
                        this.$router.push('/login');
                    }
                    reject('err');
                });
            })

            getinfo.then((ua_form) => {
                return this.xsxxQuery('',ua_id_card);
            }).then((data) => {
                _self.xsxxData = data;
                if(this.role == '学校'){
                    let data = _self.xsxxData[0];
                    console.log(this.ua_form)
                    if((this.ua_form.ua_state == '' || this.ua_form.ua_state == '已通过') && this.isadd == true){
                        this.ua_form = {
                            ua_isSchool: true,
                            ua_school: data.school,
                            ua_id: data.ua_id,
                            ua_id_card: data.id_card,
                            ua_type: '',
                            ua_date: '尚未异动',
                            ua_state: data.unusual_action,
                            ua_describe: '',
                            ua_oldmajor: data.major,
                            ua_newmajor: '',
                        }
                        
                    }else{
                        // this.ua_form = ua_form;
                    }
                    this.showDialog = true;
                }else{
                    // this.ua_form = ua_form;
                    this.showDialog = true;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        VerifyOK(...thisData){
            if(this.role == '学校'){
                rest.service.xjydInsert(...thisData).then(res => {
                    this.search();
                    this.$notify.success(`操作成功`);
                },error =>{
                    console.log('UAerror:',error);
                    this.$notify.error(`操作失败`);
                });
            } else {
                rest.service.xjydUpdate(...thisData).then(res => {
                    this.search();
                    this.$notify.success(`操作成功`);
                },error =>{
                    console.log('UAerror:',error);
                    this.$notify.error(`操作失败`);
                });
            }
            this.showDialog = false;
        },
        handleCloseDialog(){
            this.ua_form = {};
            this.showDialog = false;
        },
    }
});

vm.components = { DataTable, UnusualActionDialog };

export default vm;
</script>

<style scoped>

</style>