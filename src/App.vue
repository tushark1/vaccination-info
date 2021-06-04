<template>
  <div class="relative flex flex-col space-y-4 h-screen">
    <nav-component></nav-component>
    <div
      class="flex flex-grow flex-col space-y-10 container mx-auto px-4 w-full"
    >
      <div
        class="flex items-center space-x-4 border border-gray-500 rounded-xl p-4 w-full"
      >
        <p class="text-lg text-gray-400">Search by:</p>
        <label
          for="search_term_pin_code"
          class="inline-flex items-center space-x-2"
          ><input
            type="radio"
            value="pin_code"
            name="search_term"
            id="search_term_pin_code"
            class="border-indigo-500 focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 text-indigo-400"
            v-model="search_term"
          />
          <span class="text-xl text-gray-400">Pincode</span>
        </label>
        <label
          for="search_term_district"
          class="inline-flex items-center space-x-2"
          ><input
            type="radio"
            value="district"
            name="search_term"
            id="search_term_district"
            class="border-indigo-500 focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 text-indigo-400"
            v-model="search_term"
          />
          <span class="text-xl text-gray-400">District</span>
        </label>
      </div>
      <div
        class="flex flex-col space-y-4 lg:space-y-0 lg:flex-row items-center lg:space-x-4 border border-gray-500 rounded-xl p-4"
      >
        <template v-if="search_term !== 'pin_code'">
          <select-component
            label="Select state"
            :dataset="states"
            v-model.number="state"
            type="state"
            :emitsChanges="true"
            @valueChanged="loadDistricts()"
          ></select-component>
        </template>
        <template v-if="search_term !== 'pin_code'">
          <select-component
            v-if="state > 0"
            label="Select district"
            :dataset="districts"
            v-model.number="district"
            type="district"
            :emitsChanges="false"
          ></select-component>
        </template>
        <div
          v-if="search_term === 'pin_code'"
          class="flex flex-col space-y-2 max-w-xs w-full"
        >
          <label class="text-xl font-medium" for="pin_code"
            >Enter Pincode</label
          >
          <input
            type="number"
            id="pin_code"
            v-model.number="pin_code"
            class="w-full max-w-xs rounded-xl border-gray-300 focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 text-gray-700"
          />
        </div>
        <div
          v-if="(state > 0 && district > 0) || pin_code"
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
        <div v-if="valid" class="flex flex-col space-y-2 max-w-xs w-full">
          <button
            class="focus:outline-none bg-gray-900 border border-gray-500 px-4 py-2 focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 rounded-xl lg:mt-[35px] focus:bg-gray-800"
            @click="loadCenters()"
          >
            Load data
          </button>
        </div>
      </div>
      <div class="flex items-center justify-center" v-if="loading">
        <p class="text-4xl text-gray-400 animate-bounce">Loading....</p>
      </div>
      <div
        v-else-if="centers.length > 0"
        class="w-full border border-gray-500 rounded-xl p-4 flex flex-col space-y-4"
      >
        <div class="flex flex-col space-y-4">
          <div>
            <p class="text-xl font-bold">
              Vaccination centers (total:
              {{ filteredCenters(filter_by_fees).length }})
            </p>
          </div>
          <div class="w-full md:max-w-xl">
            <table class="w-full table-fixed">
              <tbody>
                <tr class="border-b border-gray-600">
                  <td
                    class="bg-gray-800 w-3/4 px-6 py-3 font-sans font-bold text-gray-300 rounded-tl-xl border-r border-gray-600"
                  >
                    Total vaccines
                  </td>
                  <td
                    class="bg-gray-800 w-auto px-6 py-3 font-sans font-bold text-green-300 rounded-tr-xl text-right"
                  >
                    {{ total.total }}
                  </td>
                </tr>
                <tr class="border-b border-gray-600">
                  <td
                    class="bg-gray-800 w-3/4 px-6 py-3 font-sans font-bold text-gray-300 border-r border-gray-600"
                  >
                    SENIORS(45+) DOSE1
                  </td>
                  <td
                    class="bg-gray-800 w-auto px-6 py-3 font-sans font-bold text-right"
                    :class="
                      total.total_seniors_dose1 > 0
                        ? 'text-green-400'
                        : 'text-gray-400'
                    "
                  >
                    {{ total.total_seniors_dose1 }}
                  </td>
                </tr>
                <tr class="border-b border-gray-600">
                  <td
                    class="bg-gray-800 w-3/4 px-6 py-3 font-sans font-bold text-gray-300 border-r border-gray-600"
                  >
                    SENIORS(45+) DOSE2
                  </td>
                  <td
                    class="bg-gray-800 w-auto px-6 py-3 font-sans font-bold text-right"
                    :class="
                      total.total_seniors_dose2 > 0
                        ? 'text-green-400'
                        : 'text-gray-400'
                    "
                  >
                    {{ total.total_seniors_dose2 }}
                  </td>
                </tr>
                <tr class="border-b border-gray-600">
                  <td
                    class="bg-gray-800 w-3/4 px-6 py-3 font-sans font-bold text-gray-300 border-r border-gray-600"
                  >
                    ADULTS(18 &rarr; 44) DOSE1
                  </td>
                  <td
                    class="bg-gray-800 w-auto px-6 py-3 font-sans font-bold text-right"
                    :class="
                      total.total_adults_dose1 > 0
                        ? 'text-green-400'
                        : 'text-gray-400'
                    "
                  >
                    {{ total.total_adults_dose1 }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="bg-gray-800 w-3/4 px-6 py-3 font-sans font-bold text-gray-300 border-r border-gray-600 rounded-bl-xl"
                  >
                    ADULTS(18 &rarr; 44) DOSE2
                  </td>
                  <td
                    class="bg-gray-800 w-auto px-6 py-3 font-sans font-bold text-right rounded-br-xl"
                    :class="
                      total.total_adults_dose2 > 0
                        ? 'text-green-400'
                        : 'text-gray-400'
                    "
                  >
                    {{ total.total_adults_dose2 }}
                  </td>
                </tr>
              </tbody>
            </table>
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
      <div
        v-if="filteredCenters(filter_by_fees).length <= 0 && searchPerformed"
      >
        <p class="text-center text-lg text-gray-500">
          No centers found for the search performed
        </p>
      </div>
    </div>
    <footer
      class="flex items-center justify-between bg-gray-800 w-full px-2 sm:px-4 py-4"
    >
      <div>
        <p class="text-gray-400 font-sans text-sm">
          <a
            href="https://github.com/tushark1/vaccination-info.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            @Tushark1
          </a>
        </p>
      </div>
      <div>
        <p class="text-gray-400 font-sans text-sm">
          <a
            href="https://apisetu.gov.in/public/api/cowin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data gathered from Co-WIN Public API
          </a>
        </p>
      </div>
    </footer>
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
      pin_code: "",
      search_term: "pin_code",
    };
  },
  computed: {
    ...mapGetters({
      states: "getStates",
      districts: "getDistricts",
      centers: "getCenters",
      loading: "getLoadingStatus",
      searchPerformed: "searchPerformed",
    }),
    valid() {
      if (this.search_term === "pin_code") {
        return this.pin_code && this.date;
      }
      return this.state && this.district && this.date;
    },
    filteredCenters() {
      return (filter) => {
        if (filter) {
          return this.centers.filter((center) => center.fee_type === filter);
        }
        return this.centers;
      };
    },
    total() {
      let sessions = [
        ...this.centers.map((center) => [...center.sessions]).flat(2),
      ];
      let adults = sessions.filter((session) => session.min_age_limit < 44);
      let seniors = sessions.filter((session) => session.min_age_limit > 44);
      let total = sessions.reduce((a, b) => a + b.available_capacity, 0);

      let total_adults_dose1 = adults.reduce(
        (a, b) => a + b.available_capacity_dose1,
        0
      );
      let total_adults_dose2 = adults.reduce(
        (a, b) => a + b.available_capacity_dose2,
        0
      );
      let total_seniors_dose1 = seniors.reduce(
        (a, b) => a + b.available_capacity_dose1,
        0
      );
      let total_seniors_dose2 = seniors.reduce(
        (a, b) => a + b.available_capacity_dose2,
        0
      );
      return {
        total,
        total_adults_dose1,
        total_adults_dose2,
        total_seniors_dose1,
        total_seniors_dose2,
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
      this.filter_by_fees = "";
      if (this.search_term === "pin_code") {
        this.$store.dispatch("loadCentersByPinCode", {
          pin_code: this.pin_code,
          date: format(new Date(`${this.date}`), "dd-MM-yyyy"),
        });
      } else {
        this.$store.dispatch("loadCenters", {
          district_id: this.district,
          date: format(new Date(`${this.date}`), "dd-MM-yyyy"),
        });
      }
    },
  },
  watch: {
    search_term: {
      immediate: true,
      handler() {
        this.state = 0;
        this.district = 0;
        this.date = "";
        this.filter_by_fees = "";
        this.pin_code = "";
        if (this.searchPerformed) {
          this.$store.commit("clearSearch");
        }
      },
    },
  },
};
</script>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
