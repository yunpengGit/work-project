<template>
    <div>

        <!-- <span v-show="sideBar">非现场执法平台</span> -->
        <!-- <div class="sideBar-title">
            <span v-show="sideBar">非现场执法平台</span>
            <span v-show="sideBar" style="margin-left: 65px; font-size: 18px;" class="el-icon-s-fold" @click="toggleSideBar" />
            <span v-show="!sideBar" style="margin-left: 15px; font-size: 18px;" class="el-icon-s-unfold" @click="toggleSideBar" />
        </div> -->
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group> -->
            <el-menu
                :collapse="!isCollapse"
                :unique-opened="true"
                :default-active="activeMenu"
            >
                <SideBarItem
                    v-for="route in routes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import SideBarItem from './SideBarItem'
import { constantRoutes } from '@/router'
export default {
    name: 'SideBar',
    components: { SideBarItem },
    data() {
        return {
            isCollapse: true,
            routers: constantRoutes
        }
    },
    computed: {
        activeMenu() {
            const route = this.$route
            const { path } = route
            // if set path, the sidebar will highlight the path you set
            // if (meta.activeMenu) {
            //     return meta.activeMenu
            // }
            return path
        },
        sideBar() {
            return this.$store.state.sideBar.sideBarOpened
        },
        routes() {
            return this.$store.state.menu.addRoutes
        }

    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('sideBar/toggleSideBar')
            this.isCollapse = !this.isCollapse
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.sideBar-title{
    background-color: $green;
}
.scrollbar-wrapper{
    background-color:$green;
}
.el-scrollbar{
background-color:$green;
}
.el-menu {
    background-color: $green;
}
</style>
