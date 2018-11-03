import Vue from 'vue'
import Vuex from 'vuex'
import { STARTLOADING, CLOSELOADING } from './mutation_types'

Vue.use(Vuex); //注册Vuex

const state = {
  isloading: false,
}

const getters = {

}

const mutations = {
  [STARTLOADING](state){
    state.isloading = true;
  },
  [CLOSELOADING](state){
    state.isloading = false;
  }
}

const actions = {

}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
  })