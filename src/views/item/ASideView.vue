<template>
    <el-col :span="24">
        <el-menu
        :default-active="this.$route.path"
        :unique-opened=true
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
        :router=true>
            <el-menu-item index="/home/mmgl" v-if="DisplayAdmin() || DisplayProvince() || DisplayCity() || DisplaySchool()">
                <template slot="title">
                    <i class="el-icon-edit-outline"></i>
                    <span>密码管理</span>
                </template>
            </el-menu-item>

            <el-submenu index="1" v-if="DisplayAdmin()">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="/home/yhgl">用户管理</el-menu-item>
                <el-menu-item index="/home/yhgs">用户归属</el-menu-item>
            </el-submenu>

            <el-menu-item index="/home/zyk" v-if="DisplayAdmin() || DisplayProvince()">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>专业库</span>
                </template>
            </el-menu-item>

            <el-menu-item index="/home/zygl" v-if="DisplaySchool()">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>专业管理</span>
                </template>
            </el-menu-item>

            <!-- <el-menu-item index="/home/xsxx" v-if="DisplaySchool()">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>学生基本信息维护</span>
                </template>
            </el-menu-item> -->

            <el-submenu index="3" v-if="DisplayAdmin() || DisplayCity() || DisplaySchool() || DisplayProvince()">
                <template slot="title">
                    <i class="el-icon-document"></i>
                    <span>学籍管理</span>
                </template>
                <el-menu-item index="/home/xjzm">学籍证明</el-menu-item>
                <el-menu-item index="/home/xjyd">学籍异动</el-menu-item>
            </el-submenu>

            <el-submenu index="4" v-if="DisplayAdmin() || DisplayProvince() || DisplayCity()">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>信息管理</span>
                </template>
                <el-menu-item index="/home/xxtj">信息统计</el-menu-item>
                <el-menu-item index="/home/xxcx">信息查询</el-menu-item>
            </el-submenu>

            <el-menu-item index="/home/xsxx" v-if="DisplaySchool()">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>信息维护</span>
                </template>
            </el-menu-item>

            <el-menu-item index="/home/bysh" v-if="DisplayAdmin()">
                <template slot="title">
                    <i class="el-icon-circle-check"></i>
                    <span>毕业审核</span>
                </template>
            </el-menu-item>

            <el-menu-item index="/home/bygl" v-if="DisplayCity() || DisplaySchool()">
                <template slot="title">
                    <i class="el-icon-circle-check"></i>
                    <span>毕业管理</span>
                </template>
            </el-menu-item>
        </el-menu>
    </el-col>
</template>

<script>
let Base64 = require('js-base64').Base64;

let vm = new Object({
    data() {
        return{
            role: '',
        }
    },
    created() {
        if(localStorage.getItem('user') == null) {
            this.role = '';
        } else {
            var decodeToken = Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1]);
            decodeToken = JSON.parse(decodeToken);
            this.role = (decodeToken.role);
        }
    },
    methods:{
        handleOpen(index){
        },
        handleSelect(index){
        },
        handleClose(index){
        },
        DisplayAdmin() {
            if(['管理员'].indexOf(this.role) == -1){
                return false
            }else{
                return true;
            } 
        },
        DisplayProvince() {
            if(['省教育局'].indexOf(this.role) == -1){
                return false
            }else{
                return true;
            } 
        },
        DisplayCity() {
            if(['市教育局'].indexOf(this.role) == -1){
                return false
            }else{
                return true;
            } 
        },
        DisplaySchool() {
            if(['学校'].indexOf(this.role) == -1){
                return false
            }else{
                return true;
            } 
        }
    }
});

export default vm;
</script>

<style scoped>

</style>
