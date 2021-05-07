<template>
  <div
    class="flex flex-col space-y-2 bg-gray-800 border border-gray-500 rounded-xl p-4"
  >
    <div>
      <p class="text-sm text-gray-400 font-bold font-mono">
        Date: {{ session.date }}
      </p>
    </div>
    <div>
      <p class="text-sm text-gray-400 font-bold font-mono">
        Minimum age limit: {{ session.min_age_limit }} +
      </p>
    </div>
    <div>
      <p
        v-if="session.available_capacity <= 0"
        class="text-sm font-bold font-mono text-red-400"
      >
        Fully booked
      </p>
      <p v-else class="text-sm font-bold font-mono text-green-400">
        Available capacity: {{ session.available_capacity }}
      </p>
    </div>
    <div>
      <p class="text-sm text-green-500 font-bold font-mono">
        {{ session.vaccine }}
      </p>
    </div>
    <div>
      <p
        class="flex flex-wrap items-center text-gray-400 font-medium font-mono"
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
};
</script>

<style></style>
