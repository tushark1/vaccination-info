<template>
  <div
    class="flex flex-col space-y-2 bg-gray-800 border border-gray-500 rounded-xl p-4"
  >
    <div>
      <p class="text-sm text-gray-400 font-bold font-sans">
        Date: {{ session.date }}
      </p>
    </div>
    <div>
      <p class="text-sm text-gray-400 font-bold font-sans">
        Minimum age limit: {{ session.min_age_limit }}+
      </p>
    </div>
    <div>
      <p
        v-if="session.available_capacity <= 0"
        class="text-sm font-bold font-sans text-red-400"
      >
        Fully booked
      </p>
      <p v-else class="text-sm font-bold font-sans text-green-400">
        Available capacity: {{ session.available_capacity }}
      </p>
      <p
        v-if="session.available_capacity_dose1 > 0"
        class="text-sm font-bold font-sans text-green-400"
      >
        DOSE1 : {{ session.available_capacity_dose1 }}
      </p>
      <p
        v-if="session.available_capacity_dose2 > 0"
        class="text-sm font-bold font-sans text-green-400"
      >
        DOSE2 : {{ session.available_capacity_dose2 }}
      </p>
    </div>
    <div>
      <p class="text-sm text-green-500 font-bold font-sans">
        {{ session.vaccine }}
      </p>
    </div>
    <div>
      <p
        class="flex flex-wrap items-center text-gray-400 font-medium font-sans"
      >
        <span
          class="border border-gray-400 px-2 py-1 rounded-lg mr-2 mb-1"
          v-for="slot in session.slots"
          :key="`${slot}-${session.id}`"
        >
          {{ slot }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SessionComponent",
  data() {
    return {};
  },
  props: {
    session: {
      required: true,
      type: Object,
    },
  },
  computed: {},
};
</script>

<style></style>
