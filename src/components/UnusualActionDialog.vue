<template>
    <el-dialog title="学籍异动" :visible.sync="dialogVisible" width="674.5px" top="20px" @open="handleOpenDialog" @close="recoverAllChange">
        <el-form :model="ua_form" ref="ua_form" :disabled="!ua_form.ua_isSchool" :rules="rules">
            <el-form-item label="异动编号" :label-width="formLabelWidth">
                <el-input v-model="ua_form.ua_id" :disabled="true" class="innerwidth"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth">
                <el-input v-model="ua_form.ua_id_card" :disabled="true" class="innerwidth"></el-input>
            </el-form-item>
            <el-form-item label="异动栏目" :label-width="formLabelWidth">
                <el-select v-model="ua_form.ua_type" prop='select' placeholder="请选择栏目" class="innerwidth" @change="handleYdSelectChange">
                    <el-option label="在籍" value="在籍"></el-option>
                    <el-option label="休学" value="休学"></el-option>
                    <el-option label="转专业" value="转专业"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="异动时间" :label-width="formLabelWidth">
                <el-input v-model="ua_form.ua_date" :disabled="true" class="innerwidth"></el-input>
            </el-form-item>
            <el-form-item label="异动状态" :label-width="formLabelWidth">
                <el-input v-model="ua_form.ua_state" :disabled="true" class="innerwidth"></el-input>
            </el-form-item>
            
            <el-row>
                <el-col :span="11">
                    <el-form-item label="现专业" v-if="selectmajor" :label-width="formLabelWidth">
                        <el-input v-model="ua_form.ua_oldmajor" :disabled="true" class="fullwidth"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                    <el-form-item label="新专业" v-if="selectmajor" prop='newmajor' label-width="80px">
                        <el-select v-model="ua_form.ua_newmajor" filterable placeholder="试试搜索：哲学" class="olemajorwidth">
                            <el-option :label="item.majorid+'-'+item.majorname" :value="item.majorid+'-'+item.majorname" v-for="(item, key) in majors" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            
            <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ua_form.ua_describe" class="innerwidth"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false;">取 消</el-button>
            <el-button type="success" @click="doUA">{{buttonText}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
/**
 * 组件说明：
 * 参数                说明                            类型        可选值        默认值        必选
 * ua_form             表单数据                        array        ——            ——          Y
 * role                角色名                          string       ——            ——          Y
 * isadd               是否为添加状态                   boolean      ——            ——          Y
 * showDialog          是否显示                        boolean      ——            ——          Y
 * 
 * 钩子                说明                            类型                                   必选
 * handleCloseDialog   关闭时                          function()                             Y
 * VerifyOK            输入验证通过后点击确定按钮时,添加：function(ua_id_card, ua_type,          N
 *                                                          '市教育局审核中' ,ua_state, 
 *                                                          ua_describe, ua_oldmajor, 
 *                                                          ua_newmajor)
 *                                                查看：function(role, ua_id, ua_id_card,      N
 *                                                          ua_type, ua_oldmajor, 
 *                                                          ua_newmajor)
 */
import rest from '../service/rest'

let vm = new Object({
    props:[
        "role",
        "isadd",
        "ua_form",
        "showDialog"
    ],
    data(){
        return{
            formLabelWidth: '120px',
            dialogVisible: this.showDialog,
            selectmajor: false,
            buttonText: '',
            majors: [],
            rules: {
                select: [
                    { required: true, message: '栏目不能为空', trigger: 'change' }
                ],
                newmajor: [
                    { required: true, message: '新专业不能为空', trigger: 'change' },
                ],
            }
        }
    },
    computed: {
        listenshowDialog() {
            return this.showDialog;
        },
        listenUAType() {
            return this.ua_form.ua_type;
        },
    },
    watch:{
        listenshowDialog:function(newd,old){
            this.dialogVisible = newd;
        },
        listenUAType:function(newd,old){
            if(newd == '转专业'){
                this.selectmajor = true;
            }
        },
    },
    methods:{
        doUA(){
            if(this.role == '学校'){
                this.$emit('VerifyOK',this.ua_form.ua_id_card, this.ua_form.ua_type, '市教育局审核中' ,this.ua_form.ua_state, this.ua_form.ua_describe, this.ua_form.ua_oldmajor, this.ua_form.ua_newmajor);
            }else{
                this.$emit('VerifyOK',this.role, this.ua_form.ua_id, this.ua_form.ua_id_card, this.ua_form.ua_type, this.ua_form.ua_oldmajor, this.ua_form.ua_newmajor)
            }
        },
        getMajor(schoolname){
            rest.service.majorSchoolQuery(schoolname).then(res => {
                this.majors = res.msg;
            },error => console.log('majorSchoolRollerror:',error));
        },
        getButtonText(){
            switch(this.role){
                case '管理员':
                    this.buttonText = '通过';
                    break;
                case '省教育局':
                    this.buttonText = '通过'
                    break;
                case '市教育局':
                    this.buttonText = '通过';
                    break;
                case '学校':
                    this.buttonText = '提交';
                    break;
                default:
                    break;
            }
        },
        handleYdSelectChange(val){
            if(val == '转专业'){
                this.selectmajor = true;
            }
            if(val != '转专业'){
                this.majors = [];
                this.selectmajor = false;
            }
        },
        handleOpenDialog(){
            if(this.$refs['ua_form'] != null){
                this.$refs['ua_form'].resetFields();
            }
            this.getButtonText();
            this.getMajor(this.ua_form.ua_school);
        },
        recoverAllChange(){
            this.$refs['ua_form'].resetFields();
            this.majors = [];
            this.selectmajor = false;
            this.dialogVisible = false;
            this.$emit('handleCloseDialog');
        },
    }
});

export default vm;
</script>

<style scoped>
.innerwidth{
    width:90%;    
}
.fullwidth{
    width:100%;
}
.olemajorwidth{
    width:80.5%;
}
</style>
