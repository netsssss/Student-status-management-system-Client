<template>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" :label-width="formLabelWidth" class="demo-ruleForm">
        <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" autocomplete="off" class="doubleinnerwidth"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off" class="doubleinnerwidth"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')" style="margin-left:31.4%;">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
let vm = new Object({
    data() {
        var validatePass = (rule, value, callback) => {
            console.log(value);
            
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
            if (this.ruleForm2.checkPass !== '') {
                this.$refs.ruleForm2.validateField('checkPass');
            }
            callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm2.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
                formLabelWidth: '120px',
                ruleForm2: {
                    pass: '',
                    checkPass: '',
                    age: ''
                },
                rules2: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
        };
    }
});

export default vm;
</script>

<style scoped>
.doubleinnerwidth{
    width:44.5%;
}
</style>
