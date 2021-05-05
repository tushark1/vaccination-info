<template>
  <div class="flex flex-col space-y-2 border border-gray-600 rounded-xl p-4">
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
        class="text-sm font-bold font-mono"
        :class="
          session.available_capacity > 0 ? 'text-green-500' : 'text-red-400'
        "
      >
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
          class="border border-gray-400 px-2 py-1 rounded-lg mr-2"
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
