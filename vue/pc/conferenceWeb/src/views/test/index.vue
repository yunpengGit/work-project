<template>
    <div>
        <el-row>
            <el-col :span="8">
                <div style="height:600px;" class="step">
                    <el-button class="stepBtn" icon="el-icon-picture-outline-round" circle="" @click="jump('photo')" /> -个人头像 <br>
                    <el-button class="stepBtn" icon="el-icon-coordinate" circle="" @click="jump('user-info')" /> -个人信息 <br>
                    <el-button class="stepBtn" icon="el-icon-edit-outline" circle="" @click="jump('introduction')" /> -个人介绍 <br>
                    <el-button class="stepBtn" icon="el-icon-suitcase" circle="" @click="jump('job-intention')" /> -求职意向 <br>
                    <el-button class="stepBtn" icon="el-icon-office-building" circle="" @click="jump('educational-background')" /> -教育经历 <br>
                </div>
            </el-col>
            <el-col :span="16">
                <div style="height:600px;" class="step">
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{ '列表内容 ' + o }}
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Test',
    methods: {
        jump(domId) {
            // 当前窗口正中心位置到指定dom位置的距离

            // 页面滚动了的距离
            const height = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

            // 指定dom到页面顶端的距离
            const dom = document.getElementById(domId)
            const domHeight = dom.offsetTop + 60

            // 滚动距离计算
            var S = Number(height) - Number(domHeight)

            // 判断上滚还是下滚
            if (S < 0) {
                // 下滚
                S = Math.abs(S)
                window.scrollBy({ top: S, behavior: 'smooth' })
            } else if (S === 0) {
                // 不滚
                window.scrollBy({ top: 0, behavior: 'smooth' })
            } else {
                // 上滚
                S = -S
                window.scrollBy({ top: S, behavior: 'smooth' })
            }
        }
    }
}
</script>

<style>

</style>
