<template>
    <el-row>
        <el-table
        :data="tableData.data.slice((tableCurrentPage-1)*tablePageSize,tableCurrentPage*tablePageSize)"
        stripe
        @selection-change="selectionChange"
        style="width: 100%">

            <el-table-column
                type="selection">
            </el-table-column>

            <el-table-column
                type="index"
                :index="tableIndex"
                label="序号"
                width="100">
            </el-table-column>

            <el-table-column v-for="(col,index) in tableData.props"
                :key="index"
                :prop= tableData.props[index]
                :label= tableData.labels[index]>
            </el-table-column>

            <slot></slot>

        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableCurrentPage"
            :page-sizes="[7, 14, 21, 50]"
            :page-size="tablePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.data.length"
            style="margin-top:10px;">
        </el-pagination>
    </el-row>
</template>

<script>
/**
 * 组件说明：
 * 参数                说明                            类型        可选值        默认值        必选
 * tableData.data      显示的数据                      array        ——            ——          Y
 * tableData.labels    显示的标题                      array        ——            ——          Y
 * tableData.props     对应字段名                      array        ——            ——          Y
 * 
 * 钩子                说明                            类型                                   必选
 * selectionChange     多选框状态改变时返回所有选中项    function(val)                          N
 */
var vm = new Object({
    props:{
        tableData: Object
    },
    computed: {
        listenData() {
            return this.tableData.data;
        },
    },
    watch: {
        listenData(newdata,olddata){
            this.clearAll();
        }
    },
    data(){
        return{
            tableIndex: 1,
            tablePageSize: 7,
            tableCurrentPage: 1,
        }
    },
    created(){
        this.clearAll();
    },
    methods:{
        selectionChange(val){
            this.$emit("selectionChange",val);
        },
        clearAll(){
            this.tableIndex = 1;
            this.tableCurrentPage = 1;
            this.tablePageSize = 7;
            this.multipleSelection = '';
        },
        handleCurrentChange(curPage){
            if(this.tableCurrentPage - curPage > 0)
                this.tableIndex -= (this.tablePageSize * (this.tableCurrentPage - curPage));
            
            if(this.tableCurrentPage - curPage < 0)
                this.tableIndex += (this.tablePageSize * (curPage - this.tableCurrentPage));

            this.tableCurrentPage = curPage;
        },
        handleSizeChange(size){
            this.tablePageSize = size;
        }
    }
});

export default vm;
</script>

<style scoped>

</style>
