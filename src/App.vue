<template>
  <div class="flex flex-col space-y-4">
    <nav-component></nav-component>
    <div class="flex flex-col space-y-10 container mx-auto px-4 w-full">
      <div
        class="flex flex-col space-y-4 lg:space-y-0 lg:flex-row items-center lg:space-x-4 border border-gray-500 rounded-xl p-4"
      >
        <select-component
          label="Select state"
          :dataset="states"
          v-model.number="state"
          type="state"
          :emitsChanges="true"
          @valueChanged="loadDistricts()"
        ></select-component>
        <select-component
          v-if="state > 0"
          label="Select district"
          :dataset="districts"
          v-model.number="district"
          type="district"
          :emitsChanges="false"
        ></select-component>
        <div
          v-if="state > 0 && district > 0"
          class="flex flex-col space-y-2 max-w-xs w-full"
        >
          <label class="text-xl font-medium" for="date_selector">
            Select date
          </label>
          <input
            class="rounded-xl border-gray-300 focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 text-gray-700"
            type="date"
            id="date_selector"
            v-model="date"
          />
        </div>
        <div
          v-if="state > 0 && district > 0 && date"
          class="flex flex-col space-y-2 max-w-xs w-full"
        >
          <button
            class="focus:outline-none bg-gray-900 border border-gray-500 px-4 py-2 focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 rounded-xl lg:mt-[35px] focus:bg-gray-800"
            @click="loadCenters()"
          >
            Load data
          </button>
        </div>
      </div>
      <div
        v-if="centers.length > 0"
        class="w-full border border-gray-500 rounded-xl p-4 flex flex-col space-y-4"
      >
        <div class="flex flex-col space-y-4">
          <div>
            <p class="text-xl font-bold">
              Vaccination centers (total: {{ centers.length }})
            </p>
          </div>
          <div>
            <p class="text-lg font-bold text-gray-300 mb-2">Filter by type</p>
            <div class="flex items-center space-x-4">
              <button
                class="px-4 py-px  border focus:outline-none rounded-lg border-green-400 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                :class="
                  filter_by_fees === 'Free'
                    ? 'text-white bg-green-400'
                    : 'text-green-400'
                "
                @click="filterByFees('Free')"
              >
                Free
              </button>
              <button
                class="px-4 py-px border focus:outline-none rounded-lg border-red-400 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                @click="filterByFees('Paid')"
                :class="
                  filter_by_fees === 'Paid'
                    ? 'text-white bg-red-400'
                    : 'text-red-400'
                "
              >
                Paid
              </button>
            </div>
          </div>
        </div>
        <div v-for="center in filteredCenters(filter_by_fees)" :key="center.id">
          <center-component :center="center"></center-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavComponent from "./components/Nav.vue";
import SelectComponent from "./components/Select.vue";
import { mapGetters } from "vuex";
import { format } from "date-fns";
import CenterComponent from "./components/Center.vue";
export default {
  name: "App",
  components: { NavComponent, SelectComponent, CenterComponent },
  data() {
    return {
      state: 0,
      district: 0,
      date: "",
      filter_by_fees: "",
    };
  },
  computed: {
    ...mapGetters({
      states: "getStates",
      districts: "getDistricts",
      centers: "getCenters",
    }),
    filteredCenters() {
      return (filter) => {
        if (filter) {
          return this.centers.filter((center) => center.fee_type === filter);
        }
        return this.centers;
      };
    },
  },
  mounted() {
    if (this.states.length === 0) {
      this.loadStates();
    }
  },
  methods: {
    filterByFees(fees) {
      if (this.filter_by_fees === fees) {
        this.filter_by_fees = "";
      } else {
        this.filter_by_fees = fees;
      }
    },
    loadStates() {
      this.$store.dispatch("loadStates");
    },
    loadDistricts() {
      if (this.state > 0) {
        this.district = 0;
        this.$store.dispatch("loadDistricts", { id: this.state });
      }
    },
    loadCenters() {
      this.$store.dispatch("loadCenters", {
        district_id: this.district,
        date: format(new Date(`${this.date}`), "dd-MM-yyyy"),
      });
    },
  },
};
</script>

<style></style>
