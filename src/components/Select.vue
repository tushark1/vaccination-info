<template>
  <div class="flex flex-col space-y-2 max-w-xs w-full">
    <label class="text-xl font-medium" :for="`${type}_selection`">
      {{ label }}
    </label>
    <select
      class="rounded-xl border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 text-gray-700"
      :name="type"
      :id="`${type}_selection`"
      v-model="form"
      @change="logChange"
    >
      <option disabled selected value="0">Select a {{ type }}</option>
      <option
        v-for="data in dataset"
        :key="`${data[`${type}_id`]}-state`"
        :value="`${data[`${type}_id`]}`"
      >
        {{ `${data[`${type}_name`]}` }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "SelectComponent",
  props: {
    value: {
      required: true,
      type: Number,
    },
    label: {
      required: true,
      type: String,
    },
    dataset: {
      required: true,
      type: Array,
    },
    type: {
      required: true,
      type: String,
    },
    emitsChanges: {
      required: true,
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    form: {
      get() {
        return this.value;
      },
      set(localValue) {
        this.$emit("input", localValue);
      },
    },
  },
  methods: {
    logChange() {
      if (this.emitsChanges) {
        this.$emit("valueChanged");
      }
    },
  },
};
</script>

<style></style>
