<template>
    <el-container>
        <el-header height="50px">
            <Header />
        </el-header>
        <el-main style="padding:0px">
            <router-view />
        </el-main>
    </el-container>
</template>

<script>
import Header from '@/layout/components/Header'
export default {
    name: 'PlatformLayout',
    components: {
        Header
    }
}
</script>

<style scoped>
    body {
        height: 100%
    }
    .el-container.is-vertical {
        height: 100%
    }
    .el-header {
        padding: 0px;
    }
</style>
