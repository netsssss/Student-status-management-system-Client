<template>
    <div style="width:100%; height:100%;">

        <el-transfer
            class="transfer"
            v-model="selected_major"
            :props="{
                key:'majorid',
                label:'majorid',
            }"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['专业库', '已选专业']"
            :button-texts="['弃选', '选择']"
            :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
            }"
            @change="handleMajorChange"
            :data="show_data">
            <span slot-scope="{ option }">{{ option.majorid }} - {{ option.majorname }}</span>
            <el-button type="primary" class="transfer-footer" slot="left-footer" size="small" @click="Refresh">刷新</el-button>
            <el-button type="primary" class="transfer-footer" slot="right-footer" size="small" @click="submitZYGL">确定</el-button>
        </el-transfer>

    </div> 
</template>

<script>
import rest from '../../service/rest'
let Base64 = require('js-base64').Base64;

let vm = new Object({
    data() {
      return {
        username: JSON.parse(Base64.decode((JSON.parse(localStorage.getItem('user')).token).split('.')[1])).username,
        selected_major: [],
        exist_major: [],
        show_data:[{"majorid":"01","majorname":"哲学","disabled":false}],
        data:[],
      }
    },
    created(){
        this.Refresh();
    },
    methods: {
        zykQuery(majorid, majorname){
            rest.service.zykQuery(majorid, majorname).then(res => {
                this.data = res.msg;
                this.zyglQuery(this.username);
                this.exist_major = this.selected_major;
            },error =>{
                console.log('ZYGLerror:',error);
                if(localStorage.getItem('user') == null){
                    this.$router.push('/login');
                }else{
                    this.$notify.error(`查询失败`);
                }
            });
        },
        zyglQuery(username){
            rest.service.zyglQuery(username).then(res => {
                for(let i = 0; i<res.msg.length; i++){
                    let temp = res.msg[i];
                    for(let j = 0; j<this.data.length; j++){
                        //找出专业库中与专业管理id相同的专业，设置为不可编辑状态。必须先设置为不可编辑状态再添加专业管理，不然会出现丢包弃选bug。
                        if(temp.majorid == this.data[j].majorid)
                            this.data[j].disabled = true;
                    }
                    this.selected_major.push(res.msg[i].majorid)
                }
                this.show_data = this.data;
                
            },error =>{
                console.log('ZYGLerror:',error);
                if(localStorage.getItem('user') == null){
                    this.$router.push('/login');
                }else{
                    this.$notify.error(`查询失败`);
                }
            });
        },
        submitZYGL(){
            this.$confirm('专业选择后将不可以取消, 是否继续?', '选择专业', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                let temp_major = [].concat(this.selected_major);

                // for(var i = 0;i < this.exist_major.length; i++) {
                //     let temp = this.exist_major[i];
                //     if(temp_major.indexOf(temp) > -1){
                //         temp_major.splice(temp_major.indexOf(temp),1); 
                //     }
                // }

                temp_major.splice(0,this.exist_major.length);  
        
                rest.service.zyglInsert(temp_major,this.username).then(res => {
                    this.$notify.success(`添加成功`);
                    this.Refresh();
                },error =>{
                    console.log('ZYGLerror:',error);
                    if(localStorage.getItem('user') == null){
                        this.$router.push('/login');
                    }else{
                        this.$notify.error(`添加失败`);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
            
        },
        Refresh(){
            this.zykQuery('','');
        },
        handleMajorChange(value, direction, movedKeys) {
            // console.log(value, direction, movedKeys,this.selected_major);        
        }
    }
});

export default vm;
</script>

<style scoped>
.transfer {
    text-align: left; 
    display: inline-block;
    width: 100%;
    height: 100%;
}
.transfer-footer {
    margin-left: 5px;
    padding: 10px 20px;
}
</style>

<style>
.el-transfer-panel{
    width:400px;
    height:400px;
}
.el-transfer-panel__list {
    height:100% !important;
}
</style>
