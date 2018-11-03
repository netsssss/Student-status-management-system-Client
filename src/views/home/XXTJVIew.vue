<template>
    <el-row>
        <el-row class="textcenter rowbtop">
            <el-col span="4">
                <el-progress type="circle" :percentage="7" color="#F56C6C"></el-progress>
                <div class="protitle">待处理异常数据</div>
            </el-col>
            <el-col span="4">
                <el-progress type="circle" :percentage="25"></el-progress>
                <div class="protitle">省教育局审核</div>
            </el-col>
            <el-col span="4">
                <el-progress type="circle" :percentage="80" color="#8e71c7"></el-progress>
                <div class="protitle">市教育局审核</div>
            </el-col>
            <el-col span="4">
                <el-progress type="circle" :percentage="100" status="success"></el-progress>
                <div class="protitle">学校录入</div>
            </el-col>
        </el-row>
        
        <el-row class="rowttop">
            <el-row class="rowwidth protitle">
                <el-col span="3">
                    <span>省教育局提交:</span>
                </el-col>
                <el-col span="12">
                    <el-progress :stroke-width="18" :percentage="2"></el-progress>
                </el-col>  
            </el-row>
            <el-row class="rowwidth protitle">
                <el-col span="3">
                    <span>市教育局提交:</span>
                </el-col>
                <el-col span="12">
                    <el-progress :stroke-width="18" :percentage="2" color="#8e71c7"></el-progress>
                </el-col>  
            </el-row>
            <el-row class="rowwidth protitle">
                <el-col span="3">
                    <span>学校提交:</span>
                </el-col>
                <el-col span="12">
                    <el-progress :stroke-width="18" :percentage="3" color="#67C23A"></el-progress>
                </el-col>  
            </el-row>
        </el-row>
    </el-row>
</template>

<script>
export default {
    
}
</script>

<style>
.textcenter{
    text-align: center;
}
.rowbtop{
    margin-top: 20px;
}
.rowttop{
    margin-top: 80px;
}
.protitle{
    margin-top: 10px;
}
</style>
