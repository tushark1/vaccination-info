<template>
  <div class="flex flex-col space-y-2 rounded-xl border border-gray-400 p-4">
    <div class="flex flex-col max-w-md w-full">
      <p class="text-lg font-bold font-mono">{{ center.name }}</p>
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
    <div>
      <div
        v-if="totalVaccines <= 0"
        class="flex items-center text-lg font-semibold font-mono text-red-400"
      >
        Center fully booked for vaccination
      </div>
      <div
        v-if="totalVaccines > 0"
        class="flex items-center text-lg font-semibold font-mono text-green-400"
      >
        Available vaccines {{ totalVaccines }}
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
    totalVaccines() {
      let availability = this.center.sessions.map(
        (session) => session.available_capacity
      );
      return availability.reduce((a, b) => a + b, 0);
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
