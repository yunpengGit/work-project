<template>
    <div>
        <div style=" position:absolute; top:30%; width:100%; text-align:center">

            <img

                src="../../assets/unAuth.png"
            >
        </div>

        <div style=" position:absolute; top:70%; width:100%; text-align:center; color:red; font-size:20px">
            {{ getConferenceTemplate(1) }}已下线，请联系{{ getConferenceTemplate(1) }}创建人或
            <router-link type="primary" to="/index">前往工作台</router-link>
            <!-- <el-link type="primary" @click="qianwanggongzuotai">前往工作台</el-link> -->
        </div>

    </div>
</template>
<script>
</script>
