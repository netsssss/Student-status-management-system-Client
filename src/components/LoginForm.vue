<template>
	<div id="content">
		<div>
			<h1>login<span>学籍管理系统</span></h1>
		</div>
		<el-form class='demo-ruleForm'>
			<el-form-item class="nomargin">
				<el-col :span='4'>
					<span>用户名:</span>
				</el-col>
				<el-col :span='20'>
					<el-input id="inputname" placeholder='用户名' v-model='username' @blur="checkname" @keyup.enter.native="submitMsg"></el-input>
					<div class="empty-box">
						<span class="" v-bind:class="{'value-empty':nameEmpty}">请输入用户名</span>
					</div>
				</el-col>
			</el-form-item>

			<el-form-item class="nomargin">
				<el-col :span='4'>
					<span>密码:</span>
				</el-col>
				<el-col :span='20'>
					<el-input type='password' auto-complete='off' placeholder='密码' v-model='password' @blur="checkpass" @keyup.enter.native="submitMsg"></el-input>
					<div class="empty-box">
						<span class="" v-bind:class="{'value-empty':passEmpty}">请输入密码</span>
					</div>
				</el-col>
			</el-form-item>

			<el-form-item class="nomargin">
				<el-button type="primary" id="loginSubmit" :loading="loading_button" class='btn' @click='submitMsg'>
					<span>登录</span>
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
/**
 * 组件说明：
 * 参数                说明                            类型        可选值        默认值        必选
 * onloading           登录加载动画                    boolean       ——           ——          Y
 * 
 * 钩子                说明                            类型                                   必选
 * login     		   用户操作无误后点击登录按钮时      function(username,password)            Y
 */
let vm = new Object({
	props:{
		onloading: Boolean
	},
	data(){
		return {
			username:'',
			password:'',
			nameEmpty: true,
			passEmpty: true,
			loading_button: false,
		}
	},
	computed: {
        listenOnloading() {
            return this.onloading;
        },
    },
    watch:{
        listenOnloading:function(newd,old){
            this.loading_button = newd;
        },
    },
	methods:{
		checkname: function(){
			if(this.username){
				this.nameEmpty = true
			}else{
				this.nameEmpty = false
			}
		},
		checkpass: function(){
			if(this.password){
				this.passEmpty = true
			}else{
				this.passEmpty = false
			}
		},
		submitMsg: function(){
			if(!this.username || !this.password){
				this.$notify.error(`请输入账号密码`);
				return false;
			}else{
				this.loading_button = true;
				this.$emit('login', this.username,this.password);
			}
		}
	}
})

export default vm
</script>

<style scoped>
.nomargin{
	margin: 0px;
}
#content{
	margin-top: 70%;
}
#content h1{
	color: #409EFF;
	margin-bottom: 14px;
}
#content h1 span{
	font-size: 14px;
	font-weight: 100;
	margin-left: 14px;
}
.empty-box{
	color:brown;
}
.value-empty{
	visibility: hidden;
}
#loginSubmit{
	float: right;
}
</style>


