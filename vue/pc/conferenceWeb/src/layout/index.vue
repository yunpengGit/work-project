<template>
    <div :class="!sideBar ? 'hideSidebar' : ''" class="app-wrapper">
        <!-- <div>-->
        <Header />
        <SideBar class="sideBar-container" />
        <!-- <SideBar /> -->
        <div class="main-container">
            <TagsBar />
            <AppMain />
        </div>
    </div>
</template>

<script>
import Header from './components/Header'
import SideBar from './components/SideBar/index'
import TagsBar from './components/TagsBar/index'
import AppMain from './components/AppMain'
export default {
    name: 'Layout',
    components: {
        Header,
        SideBar,
        TagsBar,
        AppMain
    },
    computed: {
        sideBar() {
            return this.$store.state.sideBar.sideBarOpened
        },
        alarmTable() {
            return this.$store.state.sideBar.alarmTableOpened
        }
    }

}
</script>

<style lang="scss" type="text/scss" scoped>
    @import "~@/styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>
