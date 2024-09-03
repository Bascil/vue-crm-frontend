<template>
    <div class="tags-input">
      <!-- Select All Button -->
      <button @click="selectAll" class="select-all-button">
        Select All
      </button>
  
      <!-- Available Tags Checkbox List -->
      <div class="checkbox-list">
        <label
          v-for="tag in availableTags"
          :key="tag.id"
          class="checkbox-item"
        >
          <input
            type="checkbox"
            :value="tag.id"
            v-model="selectedTagIds"
            class="checkbox-input"
          />
          <span class="checkbox-text">{{ tag.name }}</span>
        </label>
      </div>
  
      <!-- Input for Adding New Tags -->
      <!-- <input
        v-model="newTagName"
        @keyup.enter="addNewTag"
        placeholder="Add new permission"
        class="input-tag"
      /> -->
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  const props = defineProps({
    modelValue: Array,
    tags: Array
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const selectedTagIds = ref(props.modelValue.map(tag => tag.id));
  const newTagName = ref('');
  
  const availableTags = computed(() => props.tags);
  
  const addNewTag = () => {
    if (newTagName.value.trim()) {
      const newTag = { id: Date.now().toString(), name: newTagName.value.trim() };
      if (!availableTags.value.find(tag => tag.name === newTag.name)) {
        availableTags.value.push(newTag);
        emit('update:modelValue', [...props.modelValue, newTag]);
      }
      newTagName.value = '';
    }
  };
  
  watch(selectedTagIds, (newIds) => {
    const selectedTags = availableTags.value.filter(tag => newIds.includes(tag.id));
    emit('update:modelValue', selectedTags);
  });
  
  const selectAll = () => {
    const allTagIds = availableTags.value.map(tag => tag.id);
    selectedTagIds.value = allTagIds;
  };
  </script>
  
  <style scoped>
  .tags-input {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
    max-width: 400px;
  }
  
  .select-all-button {
    margin-bottom: 10px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
  }
  
  .select-all-button:hover {
    background-color: #0056b3;
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
  
  .input-tag {
    margin-top: 15px;
    border: 1px solid #ddd;
    padding: 8px;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
  }
  </style>
  