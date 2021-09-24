import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from './default'

Vue.use(VueStorage, config.storageOptions)
