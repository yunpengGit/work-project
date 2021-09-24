<template>
    <div>
        <div>
            <el-row>
                <el-col :span="5">
                    <!-- <img src="@/assets/sunny.svg" alt="" style="height:44px"> -->
                    <img src="@/assets/sunny.svg" alt="" class="tianqiicon">
                </el-col>
                <el-col :span="15" style="padding-top:16px">
                    <span class="weathertext">晴天</span>
                    <span class="divide">&nbsp;</span>
                    <span class="weathertext">15℃</span>
                </el-col>
                <el-col :span="4" style="text-align: right;">
                    <span class="zuozaiqu">
                        密云区
                    </span>
                </el-col>
            </el-row>
        </div>
        <div style="padding-top: 1px">
            <el-col :span="8">
                <span class="xianxitianqi">5℃-25℃</span>
            </el-col>
            <el-col :span="8" style="text-align: center;">
                <span class="xianxitianqi">多云转晴</span>
            </el-col>
            <el-col :span="8" style="text-align: right;">
                <span class="xianxitianqi">西北风3-4级</span>
            </el-col>
        </div>
    </div>
</template>

<style scoped>
    .divide {
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #191f24;
        /* font-size: 18px; */
        font-size: 1.5em;
        /* line-height: 18px; */
    }
    .weathertext {
        /* font-size: 18px; */
        font-size: 1.5em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        line-height: 26px;
        padding-right: 5px;
        padding-left: 5px;
    }
    .zuozaiqu {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        /* line-height: 16px; */
    }
    .xianxitianqi {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        /* line-height: 16px; */
    }
    .tianqiicon {
        /* width: 68%; */
        height: 44px;
    }
</style>