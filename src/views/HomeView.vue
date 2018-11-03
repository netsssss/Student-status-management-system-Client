<template>
    <el-container>
        <el-header>
            <HeadView @out="logOut" :username="header_info.username" :rolename="header_info.rolename">
                <span slot="title">学籍管理系统</span>
            </HeadView>
        </el-header>
        <el-container>
            <el-aside width="220px">
                <ASideView></ASideView>
            </el-aside>
            <el-main>
                <keep-alive>
                    <router-view name="table"></router-view>
                </keep-alive>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import rest from '@/service/rest'
import HeadView from '@/views/item/HeadView'
import ASideView from '@/views/item/ASideView'
import { mapState } from 'vuex'

let vm = new Object({
    data() {
        return{
            header_info: {
                username: '',
                rolename: '',
            },
        }
    },
    created() {
        this.getHeaderInfo();
    },
    computed: {
        ...mapState([
            'isloading',
        ]),
    },
    watch:{
        isloading:function(newd,old){
            if(newd == true){
                this.$loading();
            }else{
                this.$loading().close();
            }
            
        },
    },
    methods: {
        getHeaderInfo() {
            var decodeToken = Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1])
            decodeToken = JSON.parse(decodeToken);
            this.header_info.username = decodeToken.username;
            let role = decodeToken.role;

            if(role != '管理员'){
                this.getRoleName(role);
            }else{
                this.header_info.rolename = '管理员'
            }
        },
        getRoleName(role) {
            rest.service.roleUserQuery(role, this.header_info.username).then(res => {
                this.header_info.rolename = res.msg[0].rolename;

            },error => console.log("get_rolename_err"));
        },
        logOut() {
            this.$router.push('/login');
            rest.instance.defaults.headers.common['access_token'] = null;
            localStorage.removeItem('user');
            this.$message({
                type: 'success',
                message: '退出成功!'
            });
        }
    }
});

vm.components = { HeadView, ASideView };

export default vm;
</script>

<style scoped>
header{
    border-bottom: 1px #EBEEF5 solid;
}

</style>

