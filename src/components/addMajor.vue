<template>
    <el-dialog :title="form.title" :visible.sync="dialogVisible" @close="recoverAllChange">
        <el-form :model="form">
            <el-form-item label="专业编号" :label-width="formLabelWidth">
                <el-input v-model="form.majorid" autocomplete="off" class="innerwidth">
                    <el-select v-model="form.majorid_title" slot="prepend" placeholder="请选择" style="width:80px;" @change="handleMajoridTitleChange">
                        <el-option :label="i < 10 ? '0'+i : i" :value="i < 10 ? '0'+i : i" v-for="(i,key) in 11" :key="key"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>

            <el-form-item label="专业名" :label-width="formLabelWidth">
                <el-input v-model="form.majorname" autocomplete="off" class="innerwidth"></el-input>
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
 * showDialog          是否显示                        boolean      ——            ——          Y
 * 
 * 钩子                说明                            类型                                   必选
 * handleCloseDialog   关闭时                          function()                             Y
 * majorTitleChange    编号头选择改变时                 function(val)                          Y
 * VerifyOK            输入验证通过后点击确定按钮时,编辑：function(majorid_title + majorid),     N
 *                                                          majorname)
 */
let vm = new Object({
    props:{
        form: Array,
        showDialog: Boolean
    },
    data(){
        return{
            dialogVisible: false,
            formLabelWidth: '120px',
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
            this.$emit("VerifyOK",(this.form.majorid_title + this.form.majorid),this.form.majorname);
        },
        handleMajoridTitleChange(val){
            this.$emit("majorTitleChange",val);
        },
        recoverAllChange(){
            this.dialogVisible = false;
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
</style>
