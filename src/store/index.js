import Vue from "vue";
import Vuex from "vuex";
import { HttpClient } from "../utils/HttpClient";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    states: [],
    districts: [],
    centers: [],
    loading: false,
  },
  mutations: {
    setStates: (state, payload) => {
      state.states = JSON.parse(JSON.stringify(payload));
    },
    setDistricts: (state, payload) => {
      state.districts = JSON.parse(JSON.stringify(payload));
    },
    unloadStates: (state) => {
      state.districts = [];
    },
    setCenters: (state, payload) => {
      state.centers = JSON.parse(JSON.stringify(payload));
    },
  },
  getters: {
    getStates: (state) => state.states,
    getDistricts: (state) => state.districts,
    getCenters: (state) => state.centers,
  },
  actions: {
    async loadStates({ state, commit }) {
      state.loading = true;
      try {
        const res = await HttpClient.get("/admin/location/states");
        if (res.status === 200) {
          const { data: { states } = [] } = res;
          commit("setStates", states);
        }
      } catch (error) {
        console.log(error);
      } finally {
        state.loading = false;
      }
    },
    async loadDistricts({ state, commit }, { id }) {
      state.loading = true;
      try {
        const res = await HttpClient.get(`/admin/location/districts/${id}`);
        if (res.status === 200) {
          const { data: { districts } = [] } = res;
          commit("setDistricts", districts);
        }
      } catch (error) {
        console.log(error);
      } finally {
        state.loading = false;
      }
    },
    async loadCenters({ state, commit }, { district_id, date }) {
      state.loading = true;
      try {
        const res = await HttpClient.get(
          `/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${date}`
        );
        if (res.status === 200) {
          const { data: { centers } = [] } = res;
          commit("setCenters", centers);
        }
      } catch (error) {
        console.log(error);
      } finally {
        state.loading = false;
      }
    },
  },
  modules: {},
});
