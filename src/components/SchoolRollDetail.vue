<template>
<el-dialog :title="dialogtitle" :visible.sync="dialogVisible" width="674.5px" top="20px" @open="handleOpenDialog" @close="recoverAllChange">
    <el-form :model="form" :disabled="!form.isAdd" ref="sr_form" :rules="rules">
        <el-row>
            <el-col :span="11">
                <el-form-item label="基本信息" prop='name' :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="姓名" autocomplete="off"  class="fullwidth"></el-input>   
                </el-form-item>
            </el-col>
            <el-col :span="13">
                <el-form-item label="" prop='sex' label-width="0" style="margin-left:10px;">
                    <el-select v-model="form.sex" placeholder="性别" class="sexwidth">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                    <el-upload
                        style="width:90px;"
                        class="avatar-uploader"
                        :class="{'red-avatar-uploader' : avatar_is_red}"
                        :http-request="upload"
                        action="127.0.0.1:8088/api/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">点击上传照片</div>
                        <div :class="{'exist-avatar' : form.exist_avatar}"></div>
                    </el-upload>
                </el-form-item>
            </el-col>
        </el-row>
                
        <el-form-item label="身份证号" prop='id_card' :label-width="formLabelWidth">
            <el-input v-model="form.id_card" placeholder="身份证号" autocomplete="off" class="innerlittlewidth" @blur="handleIdCardBlur"></el-input>
        </el-form-item>

        <el-form-item label="出生日期" required :label-width="formLabelWidth">
            <el-date-picker
                :disabled="true"
                class="innerlittlewidth"
                v-model="form.birth"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>

        <el-row>
            <el-col :span="13">
                <el-form-item label="学校&专业" required :label-width="formLabelWidth">
                    <el-input v-model="form.school" :disabled="isSchool" placeholder="请输入" class="fullwidth"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="" prop='major' label-width="0px" style="margin-left:10px;">
                    <el-select v-model="form.major" filterable placeholder="试试搜索：哲学" class="majorwidth">
                        <el-option :label="item.majorid+'-'+item.majorname" :value="item.majorid+'-'+item.majorname" v-for="(item, index) in majors" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="生源地" prop='birthplace' :label-width="formLabelWidth" @change="handlePlaceChange">
            <el-cascader
                class="innerwidth"
                v-model="form.birthplace"
                placeholder="试试搜索：北京"
                @active-item-change="handlePlaceChange"
                :options="birthplace_options"
                filterable
            ></el-cascader>  
        </el-form-item>

        <el-form-item label="" prop='birthplace_detail' :label-width="formLabelWidth">
            <el-input v-model="form.birthplace_detail" placeholder="详细地址" autocomplete="off"  class="innerwidth"></el-input>
        </el-form-item>

        <el-row>
            <el-col :span="13">
                <el-form-item label="学籍状态" :label-width="formLabelWidth">
                    <el-input v-model="form.regist" :disabled="true" placeholder="选择状态" class="fullwidth"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="" label-width="0px" style="margin-left:10px;">
                    <el-input v-model="form.unusual_action" :disabled="true" placeholder="选择状态" class="unusual_actionwidth"></el-input>
                </el-form-item>
            </el-col>
        </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!form.isAdd" :loading="this.$store.state.isloading" @click="submitForm">确 定</el-button>
    </div>
</el-dialog>
    
</template>

<script>
/**
 * 组件说明：
 * 参数                说明                            类型        可选值        默认值        必选
 * form                表单数据                        array        ——            ——          Y
 * rolename            角色名称                        string       ——            ——          Y
 * isSubmit            是否可提交                      boolean      ——            ——          Y
 * showDialog          是否显示                        boolean      ——            ——          Y
 * 
 * 钩子                说明                            类型                                   必选
 * handleCloseDialog   关闭时                          function()                             Y
 * VerifyOK            输入验证通过后点击确定按钮时      function(name,sex,imageUrl,id_card,    N
 *                                                          birth,school,major,birthplace,
 *                                                          birthplace_detail,regist,
 *                                                          unusual_action)
 */

/**
 * 2018/10/27
 * submitForm注：
 * 在Promist中调用的this指向的是Pormise本身而不是Promise的上下文，因此需要在Promise方法前缓存当前Promise的上下文。
 * 但当Promise中传入的是箭头函数时，函数体内的this仍然指向Promise的上下文。例如：
 * new Promise((resolve, reject) => { console.log(this) }); 其中的this返回的就是当前Promise的上下文。
 * 现在已经有更好的方式代替Promise，使用ES7中的async和await可以很轻易地实现相同功能。
 */
import rest from '../service/rest'

let vm = new Object({
    props:{
        form: Array,
        rolename: String,
        isSubmit: Boolean,
        showDialog: Boolean
    },
    data(){
        return{
            isSchool: false,
            dialogVisible: false,
            avatar_is_red: false,
            dialogtitle:'学生基本信息',
            formLabelWidth: '120px',
            majors: [],
            birthplace_options: [{value:'haha',label:'aa'}],
            rules: {
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '性别不能为空', trigger: 'change' }
                ],
                id_card: [
                    { required: true, message: '身份证号不能为空', trigger: 'blur' },
                    { pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '身份证号格式不对', trigger: 'blur'}
                ],
                major: [
                    { required: true, message: '专业不能为空', trigger: 'change' }
                ],
                birthplace: [
                    { required: true, message: '生源地不能为空', trigger: 'change' }
                ],
                birthplace_detail: [
                    { required: true, message: '详细地址不能为空', trigger: 'blur' }
                ],
            }
        }
    },
    computed: {
        listenshowDialog(){
            return this.showDialog;
        }
    },
    watch:{
        listenshowDialog:function(newd, old){
            this.dialogVisible = newd;
        }
    },
    methods:{
        submitForm(){
            if(this.form.imageUrl == ''){
                this.avatar_is_red = true;
            }
            let _self=this
            //判断是否全部通过
            var result = new Promise(function(resolve, reject) {
                _self.$refs['sr_form'].validate((valid) => {
                    if (valid) {
                        resolve();
                    } else { reject() }
                })
            });
            
            result.then(function() { //都通过了
                _self.$emit("VerifyOK",_self.form.name,_self.form.sex,_self.form.imageUrl,_self.form.id_card,_self.form.birth,_self.form.school,_self.form.major,_self.form.birthplace,_self.form.birthplace_detail,_self.form.regist,_self.form.unusual_action);
            }).catch(function(err) {
                console.log(err);
            });
        },
        getSchoolName(){
            if(this.rolename == "is_no_School"){
                this.isSchool = false;
            }else{
                this.isSchool = true;
                this.form.school = this.rolename;
                if(this.form.major == ''){
                    this.getMajor(this.form.school);
                }
            }
        },
        getMajor(schoolname){
            rest.service.majorSchoolQuery(schoolname).then(res => {
                this.majors = res.msg;
            },error =>{
                if(localStorage.getItem('user') == null){
                    this.$router.push('/login');
                }else{
                    console.log('majorSchoolRollerror:',error);
                }
            });
        },
        getArea(){
            function getprov(){
                let getprov = new Promise((resolve, reject) => {
                    rest.service.provinceQuery().then(res => {
                        resolve(res.msg);
                    },error =>{
                        if(localStorage.getItem('user') == null){
                            this.$router.push('/login');
                        }else{
                            console.log('provSchoolRollerror:',error);
                        }
                        reject(res);
                    });
                });
                return getprov;
            }

            function getcity(provname){
                let getcity = new Promise((resolve, reject) => {
                    rest.service.cityQuery(provname).then(res => {
                        resolve(res.msg);
                    },error =>{
                        if(localStorage.getItem('user') == null){
                            this.$router.push('/login');
                        }else{
                            console.log('citySchoolRollerror:',error);
                        }
                        reject(res)
                    });
                });
                return getcity;
            }

            getprov().then((provnames) => {

                provnames.forEach(item => {
                    getcity(item.provname).then((citynames) => {
                        this.birthplace_options.push({
                            value:item.provname,
                            label:item.provname,
                            children: citynames
                        });
                    }).catch((err) => {
                        console.log(err);
                    });

                });

            }).catch((err) => {
                console.log(err);
            });          
        },
        upload(file){
            var data = new FormData();
            data.append("file",file.file)
            rest.service.avatarUpload('/upload',data).then((res) => {
                if(res.status === 200){
                    this.form.imageUrl = res.msg;
                }
            });           
        },
        handleAvatarSuccess(res, file) {
            // this.avatarUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            this.deleteFailImageUrl();
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 < 200;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 200KB!');
            }
            return isJPG && isLt2M;
        },
        handleOpenDialog(){
            if(this.$refs['sr_form'] != null){
                this.$refs['sr_form'].resetFields();
            }
            this.getSchoolName();
            if(this.form.birthplace.length == 0){
                this.getArea();
            }else{
                this.birthplace_options = [{
                    value: this.form.birthplace[0],
                    label: this.form.birthplace[0],
                    children: [{
                        value: this.form.birthplace[1],
                        label: this.form.birthplace[1]
                    }]
                }];
            }
        },
        recoverAllChange(){
            this.avatar_is_red = false;
            this.isSchool = false;
            this.majors = [];
            this.birthplace_options = [];
            this.deleteFailImageUrl();
            this.dialogVisible = false;
            this.$emit("handleCloseDialog");
        },
        deleteFailImageUrl(){
            if(this.form.imageUrl && !this.isSubmit && this.form.isAdd){
                rest.service.avatarDelete(this.form.imageUrl.split('/')[4]).then((res) => {
                    if(res.status === 200){
                        // console.log('ok');
                    }
                });
            }
        },
        handleIdCardBlur(){
            if(this.form.isAdd){
                this.form.birth = this.form.id_card.substring(6,10) +'-'+ this.form.id_card.substring(10,12) +'-'+ this.form.id_card.substring(12,14);
            }
        },
        handlePlaceChange(val) {
            
        }
    }
});

export default vm;
</script>

<style scoped>
.innerwidth{
    width:90%;    
}
.innerlittlewidth{
    width:70%;    
}
.doubleinnerwidth{
    width:44.5%;
}
.Tripleinnerwidth{
    width:34.5%;
}
.fullwidth{
    width:100%;
}
.sexwidth{
    width:53.9%;
}
.majorwidth, .unusual_actionwidth{
    width:81.9%;
}
</style>
