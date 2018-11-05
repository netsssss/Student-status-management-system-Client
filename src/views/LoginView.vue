<template>
    <div class="login">
        <el-row type="flex" class="row-bg" justify="right">
            <el-col :span="14"></el-col>
            <el-col id="loginBox" :span="10">
                <LoginForm :onloading="onloading" @login='login'></LoginForm>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import LoginForm from '../components/LoginForm';
import rest from '../service/rest';
import { mapMutations } from 'vuex'


let vm = new Object({
    data(){
        return{
            onloading: false,
        }
    },
    created(){
        this.closeloading();
    },
    methods: {
        ...mapMutations(["startloading","closeloading"]),

        login(username,password){
            this.onloading = true;
            rest.service.login(username, password).then(res =>{
                if(localStorage.getItem('user') == null){
                    localStorage.setItem('user',JSON.stringify(res.msg));
                }else if(JSON.parse(localStorage.getItem('user')).token != res.msg.token){
                    localStorage.setItem('user',JSON.stringify(res.msg));
                }
                //设置请求中的token字段
                rest.instance.defaults.headers.common['access_token'] = res.msg.token;
                this.$message({
                    type: 'success',
                    message: '登录成功!'
                });
                this.onloading = false;
                this.$router.push('/');
            },error =>  {
                this.$notify.error(`登录失败`);
                this.onloading = false;
            });
            
        }
    }
});
vm.components = { LoginForm };

export default vm
</script>

<style scoped>
.login{
    width: 100%;
    height: 100%;
    background:url('../assets/bg.jpg') no-repeat;
    background-size: cover;
    background-position-y: 70%;
}
#loginBox{
    width:300px;
    float: right;
}
</style>



