<template>
    <el-dialog :title="form.title" :visible.sync="dialogVisible" @close="recoverAllRoleChange">
        <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.username" autocomplete="off" :disabled="isEdit" class="innerwidth"></el-input>
            </el-form-item>

            <el-form-item label="密码" :label-width="formLabelWidth" v-if="!isEdit">
                <el-input v-model="form.password" autocomplete="off" type="password" class="innerwidth"></el-input>
            </el-form-item>

            <el-form-item label="身份" :label-width="formLabelWidth">
                <el-select v-model="form.role" placeholder="请选择用户身份" class="innerwidth" @change="handleRoleChange">
                    <el-option label="管理员" value="管理员"></el-option>
                    <el-option label="省教育局" value="省教育局"></el-option>
                    <el-option label="市教育局" value="市教育局"></el-option>
                    <el-option label="学校" value="学校"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="地区" :label-width="formLabelWidth" v-if="isProvince || isCity">
                <el-select v-model="area.provname" placeholder="请选择省" class="areainnerwidth" @change="handleProvinceChange">
                    <el-option :label="item.provname" :value="item.provname" v-for="(item, index) in area.provnames" :key="index"></el-option>
                </el-select>

                <el-select v-model="area.cityname" placeholder="请选择市" :disabled="isProvince && !isCity" class="areainnerwidth" @change="handleCityChange" >
                    <el-option :label="item.cityname" :value="item.cityname" v-for="(item, index) in area.citynames" :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="学校" :label-width="formLabelWidth" v-if="isSchool">
                <el-select v-model="area.schoolname" placeholder="请选择学校" class="innerwidth" @change="handleSchoolChange">
                    <el-option :label="item.schoolname" :value="item.schoolname" v-for="(item, index) in area.schoolnames" :key="index"></el-option>
                </el-select>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
/**
 * 组件说明：
 * 参数                说明                            类型        可选值        默认值        必选
 * form                表单数据                        array        ——            ——          Y
 * isEdit              是否为编辑                      boolean      ——            ——          Y
 * showDialog          是否显示                        boolean      ——            ——          Y
 * 
 * 钩子                说明                            类型                                   必选
 * handleCloseDialog   关闭时                          function()                             Y
 * VerifyOK            输入验证通过后点击确定按钮时,编辑：function(username,role,provname,       N
 *                                                          cityname,schoolname)
 *                                                添加：function(username,password,role,       N
 *                                                          provname,cityname,schoolname)
 */
import rest from '@/service/rest'
import { mapMutations } from 'vuex'

let vm = new Object({
    props: {
        form: Array,
        isEdit: Boolean,
        showDialog: Boolean,
    },
    data(){
        return{
            formLabelWidth: '120px',
            dialogVisible: false,
            isProvince: false,
            isCity: false,
            isSchool: false,
            area: {
                provnames:[],
                citynames:[],
                schoolnames:[],
                provname: '',
                cityname: '',
                schoolname: ''
            },
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
        ...mapMutations(["startloading","closeloading"]),

        provQuery(){
            rest.service.provinceQuery().then(res => {
                this.area.provnames = res.msg;
            },error =>{
                console.log('prov_query_error:',error);
                if(localStorage.getItem('user') == null){
                    this.$router.push('/login');
                }
            });
        },
        cityQuery(){
            rest.service.cityQuery(this.area.provname).then(res => {
                this.area.citynames = res.msg;
            },error =>{
                console.log('city_query_error:',error);
                if(localStorage.getItem('user') == null){
                    this.$router.push('/login');
                }
            });
        },
        schoolQuery(){
            rest.service.schoolQuery(this.area.provname).then(res => {
                this.area.schoolnames = res.msg;
            },error =>{
                console.log('school_query_error:',error);
                if(localStorage.getItem('user') == null){
                    this.$router.push('/login');
                }
            });
        },
        //$store.state
        submitForm(){
            if(this.isEdit){
                if(this.area.provname == '' && this.area.cityname == '' && this.area.schoolname == ''){
                    console.log('edit is none')
                }else{
                    this.$emit("VerifyOK",this.form.username,this.form.role,this.area.provname,this.area.cityname,this.area.schoolname);
                }
            }else{
                this.$emit("VerifyOK",this.form.username,this.form.password,this.form.role,this.area.provname,this.area.cityname,this.area.schoolname);
            }
        },
        handleRoleChange(val){
            switch(val){
                case '省教育局':
                    this.provQuery();
                    this.isProvince = true;
                    this.isCity = false;
                    this.isSchool = false;
                    this.area.cityname = '';
                    this.area.schoolname = '';
                    break;
                case '市教育局':
                    if(this.area.provname != ''){
                        this.cityQuery();
                    }else{
                        this.provQuery();
                    }
                    this.isProvince = true;
                    this.isCity = true;
                    this.isSchool = false;
                    this.area.schoolname = '';
                    break;
                case '学校':
                    if(this.area.cityname != ''){
                        this.schoolQuery();
                    }else if(this.area.provname != ''){
                        this.cityQuery();
                    }else{
                        this.provQuery();
                    }
                    this.isProvince = true;
                    this.isCity = true;
                    this.isSchool = true;
                    break;
                default:
                    this.isProvince = false;
                    this.isCity = false;
                    this.isSchool = false;
                    this.area.provname = '';
                    this.area.cityname = '';
                    this.area.schoolname = '';
                    break;
            }
        },
        handleProvinceChange(val){
            this.area.provname = val;
            this.area.cityname = '';
            this.area.schoolname = '';
            if(this.isCity){
                this.cityQuery();
            }
        },
        handleCityChange(val){
            this.area.cityname = val;
            this.area.schoolname = '';
            if(this.isSchool){
                this.schoolQuery();
            }
        },
        handleSchoolChange(val){
            this.area.schoolname = val;
        },
        recoverAllRoleChange(){
            this.dialogVisible = false;
            this.isProvince = false;
            this.isCity = false;
            this.isSchool = false;
            this.area.provname = '';
            this.area.cityname = '';
            this.area.schoolname = '';
            this.$emit("handleCloseDialog");
        },
    }
});

export default vm;
</script>

<style scoped>
.innerwidth{
    width:80%;    
}
.areainnerwidth{
    width:39.6%;    
}
</style>