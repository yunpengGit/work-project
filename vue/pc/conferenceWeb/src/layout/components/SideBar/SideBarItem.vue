<template>
    <div v-if="!item.hidden">
        <!-- !onlyOneChild.children ||  -->
        <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
            <router-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)">
                    <svg-icon v-if="item.meta.icon" style="margin-right:9px;line-height:14px;width:14px;margin-top:2px" :icon-class="item.meta.icon" /><span slot="title">{{ onlyOneChild.meta.title }}</span>
                </el-menu-item>
            </router-link>
        </template>
        <el-submenu v-else :index="resolvePath(item.path)">

            <template slot="title">
                <svg-icon v-if="item.meta.icon" style="margin-right:9px;line-height:14px;width:14px;margin-top:2px" :icon-class="item.meta.icon" /><span slot="title">{{ item.meta.title }}</span>
            </template>
            <SideBarItem
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-submenu>
    </div>
</template>

<script>
import path from 'path'

export default {
    name: 'SideBarItem',
    props: {
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            onlyOneChild: null
        }
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            const showingChilds = children.filter(item => {
                if (item.hidden) {
                    return false
                } else {
                    this.onlyOneChild = item
                    return true
                }
            })

            if (showingChilds.length === 1) {
                return true
            }

            if (showingChilds.length === 0) {
                this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
                return true
            }

            return false
        },
        resolvePath(routePath) {
            return path.resolve(this.basePath, routePath)
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .el-menu-item {
        background-color:#00274C;
        color: #a8aeb8;
        height: 44px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.64);
        line-height: 44px;
    }
    .el-menu-item:hover {
        color: #FFFFFF;
    }
    .el-menu-item.is-active {
        background-color: #1E89FF;
        height: 44px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 44px;
    }
    .el-menu-item {
        height: 44px;
        line-height: 44px;
    }
    .el-submenu {
        .el-menu-item {
            background-color: #001A33;
            color: #a8aeb8;
            height: 44px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.64);
            line-height: 44px;
        }
        .el-menu-item:hover {
            color: #FFFFFF;
            background-color: #001A33;
            height: 44px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.64);
            line-height: 44px;
        }
        .el-menu-item.is-active {
            background-color: #1E89FF;
            height: 44px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 44px;
        }
        .el-menu-item {
            height: 44px;
            line-height: 44px;
        }
    }
</style>
<style>
.el-submenu__title:hover {
    background: #00274C;
    height: 44px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.64);
    line-height: 44px;
}
.el-submenu__title {
    height: 44px;
    line-height: 44px;
    color: #abaeb8;
}
.is-opened .el-submenu__title {
   background:#00274C;
    height: 44px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FAFAFA;
    line-height: 44px;
}
.el-submenu__title i {
    color:rgba(255, 255, 255, 0.64);
}
.is-opened .el-submenu__title i {
    color: #fafafa;
}
</style>
