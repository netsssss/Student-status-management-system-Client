<template>
    <div class="error-container">
        <div class="error-panel server-error error-404">
            <img src="../assets/very_sorry.png">
            <div>
                <div class="left-panel">
                    <a class="rollback-btn" @click="UpOnePage">返回上一页</a>
                </div>
                <div class="right-panel">
                    <b>我喜欢在宁静的午后</b><br>
                    <b>一个人坐在江边</b><br>
                    <b>阳光洒在脸上</b><br>
                    <b>听着花儿的心跳</b><br>
                    <b>想着你</b><br>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
var vm = new Object();

vm.methods = {
    UpOnePage(){
        this.$router.go(-2);
    }
}

export default vm;
</script>

<style scoped>
.error-container {
    width: 980px;
    margin: 30px auto 30px;
    background: #fff;
    border-radius: 10px;
}
.error-panel {
    overflow: hidden;
}
.error-panel.server-error .left-panel {
    height: 150px;
    width: 404px;
    display: inline-block;
    position: absolute;
}
.error-panel.server-error .left-panel .rollback-btn {
    height: 40px;
    width: 140px;
    margin: 25px 40px 0 0;
}
.error-panel .rollback-btn {
    /* display: inline-block; */
    line-height: 40px;
    vertical-align: middle;
    text-align: center;
    background: #00a1d6;
    color: #fff;
    border-radius: 4px;
    float: right;
    font-size: 16px;
    transition: 0.2s;
    cursor: pointer;
}
.error-panel.server-error .right-panel {
    display: inline-block;
    width: 100%;
    margin-bottom: 50px;
    margin-left: 404px;
    padding-left: 26px;
    color: #99a2aa;
    border-left: 1px #ccd0d7 dashed;
}
strong, b {
    font-weight: bold;
}
</style>
