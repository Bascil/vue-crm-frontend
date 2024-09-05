<template>
  <div class="tags-input">
        <!-- Select All Button -->
    <!-- <button @click="selectAll" class="select-all-button">
      Select All
    </button> -->
    <!-- Available Tags Checkbox List -->
    <div class="checkbox-list">
      <label v-for="tag in availableTags" :key="tag" class="checkbox-item">
        <input
          type="checkbox"
          :value="tag"
          v-model="selectedTags"
          class="checkbox-input"
        />
        <span class="checkbox-text">{{ tag }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [], // Ensure modelValue defaults to an empty array
  },
  tags: {
    type: Array,
    default: () => [], // Ensure tags defaults to an empty array
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedTags = ref([]);

// Ensure `selectedTags` is updated to select all available tags by default
onMounted(() => {
  selectedTags.value = [...props.tags]; // Set all tags as selected by default
  emit('update:modelValue', selectedTags.value); // Update modelValue to reflect selected tags
});

// Watch `modelValue` to reactively update `selectedTags` if `modelValue` changes
watch(() => props.modelValue, (newModelValue) => {
  selectedTags.value = [...newModelValue];
});

const availableTags = computed(() => props.tags);

// Watch `selectedTags` and emit changes to the parent component
watch(selectedTags, (newTags) => {
  emit('update:modelValue', newTags);
});
</script>

<style scoped>
.tags-input {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 400px;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.checkbox-input {
  margin-right: 10px;
  accent-color: #007bff;
}

.checkbox-text {
  font-size: 14px;
}
</style>
