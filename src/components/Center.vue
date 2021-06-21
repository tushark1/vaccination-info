<template>
  <div class="flex flex-col space-y-2 rounded-xl border border-gray-400 p-4">
    <div class="flex flex-col max-w-md w-full">
      <p class="text-lg font-bold font-sans">{{ center.name }}</p>
      <p class="text-sm font-semibold text-gray-300">
        {{ center.address }}, {{ center.pincode }}
      </p>
    </div>
    <div class="flex items-center space-x-2">
      <span
        class="w-auto px-4 py-px rounded border border-indigo-300 text-indigo-300"
      >
        {{ center.block_name }}
      </span>
      <span
        class="w-auto px-4 py-px rounded border"
        :class="
          center.fee_type === 'Paid'
            ? 'border border-red-300 text-red-300'
            : 'border border-green-300 text-green-300'
        "
      >
        {{ center.fee_type }}
      </span>
    </div>
    <div class="flex flex-col w-full">
      <div
        v-if="total.total <= 0"
        class="flex items-center text-lg font-semibold font-sans text-red-400"
      >
        Center fully booked for vaccination
      </div>
      <div v-if="total.total > 0" class="flex items-center flex-wrap">
        <div
          class="text-green-400 border border-green-400 px-2 py-px rounded-md mr-2 mb-2"
        >
          <div class="flex items-center divide-x divide-green-400">
            <span class="pr-1">Total</span>
            <span class="pl-1">{{ total.total }}</span>
          </div>
        </div>

        <div
          class="flex items-center"
          v-for="age in ageGroups"
          :key="`center-age-group-${age}`"
        >
          <div
            class="text-green-400 border border-green-400 px-2 py-px rounded-md mr-2 mb-2"
            v-if="totalByAgeGroup(age).dose1 > 0"
          >
            <div
              class="flex items-center justify-center text-center text-sm font-bold"
            >
              <span>{{ age }}+ DOSE1-{{ totalByAgeGroup(age).dose1 }}</span>
            </div>
          </div>
          <div
            class="text-green-400 border border-green-400 px-2 py-px rounded-md mr-2 mb-2"
            v-if="totalByAgeGroup(age).dose2 > 0"
          >
            <div
              class="flex items-center justify-center text-center text-sm font-bold"
            >
              <span>{{ age }}+ DOSE2-{{ totalByAgeGroup(age).dose2 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="center.fee_type === 'Paid' && vaccineFees.length > 0">
        <div
          class="flex md:items-center flex-col space-y-2 md:space-y-0 md:flex-row items-start flex-wrap md:space-x-2"
        >
          <span
            class="font-medium font-sans text-green-400 border border-green-400 px-2 py-px rounded-md"
            v-for="fee in vaccineFees"
            :key="`${fee.vaccine}-${fee.fee}`"
          >
            {{ fee.vaccine }} ₹{{ fee.fee }}
          </span>
        </div>
      </div>
      <div v-else>
        <div
          class="flex md:items-center flex-col space-y-2 md:space-y-0 md:flex-row items-start flex-wrap md:space-x-2"
        >
          <span
            class="font-medium font-sans text-green-400 border border-green-400 px-2 py-px rounded-md"
            v-for="vaccine in vaccines"
            :key="`${vaccine}-vaccine-${center.id}`"
          >
            {{ vaccine }}
          </span>
        </div>
      </div>
    </div>
    <div>
      <p class="text-gray-400">
        <span class="text-lg font-semibold">Timings: </span>
        <span class="text-base font-medium">
          {{ center.from | timeFilter }} to {{ center.to | timeFilter }}
        </span>
      </p>
    </div>
    <div>
      <button
        class="focus:outline-none bg-gray-900 border border-gray-500 px-4 py-2 focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 rounded-xl focus:bg-gray-800"
        @click="showDetail = !showDetail"
      >
        Show sessions/slots &darr;
      </button>
    </div>
    <div v-if="showDetail" class="flex flex-col space-y-2">
      <session
        v-for="session in center.sessions"
        :key="session.id"
        :session="session"
      >
      </session>
    </div>
  </div>
</template>

<script>
import Session from "./Session.vue";
export default {
  name: "CenterComponent",
  data() {
    return {
      showDetail: false,
    };
  },
  components: { Session },
  props: {
    center: {
      required: true,
      type: Object,
    },
  },
  computed: {
    vaccineFees() {
      return this.center.vaccine_fees ? this.center.vaccine_fees : [];
    },
    ageGroups() {
      let sessions = this.center.sessions;
      let ages = sessions.map((session) => session.min_age_limit);
      return [...new Set(ages)].sort();
    },
    totalByAgeGroup() {
      let sessions = this.center.sessions;
      return (age_group) => {
        let group = sessions.filter(
          (session) => session.min_age_limit === age_group
        );
        return {
          dose1: group.reduce((a, b) => a + b.available_capacity_dose1, 0),
          dose2: group.reduce((a, b) => a + b.available_capacity_dose2, 0),
        };
      };
    },
    total() {
      let sessions = this.center.sessions;
      let total = sessions.reduce((a, b) => a + b.available_capacity, 0);
      return {
        total,
      };
    },
    vaccines() {
      let vaccines = [
        ...new Set([...this.center.sessions.map((session) => session.vaccine)]),
      ];
      return vaccines;
    },
  },
  filters: {
    timeFilter(val) {
      return new Date("1970-01-01T" + val + "Z").toLocaleTimeString(
        {},
        { timeZone: "UTC", hour12: true, hour: "numeric", minute: "numeric" }
      );
    },
  },
};
</script>

<style></style>
