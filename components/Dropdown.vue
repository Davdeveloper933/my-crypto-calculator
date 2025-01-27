<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex w-full text-white items-center text-lg gap-x-1.5 rounded-md bg-transparent px-3 py-2 font-semibold shadow-sm ">
        <img :src="`${selectedOptionSrc}`" class="w-8" alt=""> {{ selectedOption?.label || options[0].label }}
        <ChevronDownIcon class="-mr-1 size-5 text-gray-400" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="absolute w-56 left-0 z-10 mt-2 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black/5 focus:outline-none">

        <div class="py-1">
          <MenuItem v-for="option in options" :key="option" v-slot="{ active }">
            <button
              type="button"
              @click="selectOption(option)"
              class="flex items-center text-sm font-semibold text-white"
              :class="[active ? 'bg-gray-800 outline-none' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
            >
              <img class="w-8 mr-2" :src="`${optionSrc(option)}`" alt=""> {{ option.label }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'


// Определяем пропс для входных данных
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: {}, // Значение по умолчанию
  },
})
const emit = defineEmits(['update:modelValue']);
const selectedOption = ref(null)
// Локальное состояние (например, внутренний процесс, который изменяет значение)
const internalState = ref(
  typeof props.modelValue === 'object' ? props.modelValue : {}
);


function selectOption(option) {
  selectedOption.value = option
  internalState.value = option
}

// Слежение за состоянием и обновление модели
watch(internalState, (newValue) => {
  emit('update:modelValue', newValue); // Обновляем родительское значение через v-model
});

function getImagePath(iconName) {
  const glob = import.meta.glob('@/assets/images/*', { eager: true });
  return glob[`/assets/images/${iconName}`]?.default || '';
}

const selectedOptionSrc = computed(() => {
  const iconName = selectedOption.value?.icon || props.options[0]?.icon
  return iconName ? getImagePath(iconName) : '';
});

const optionSrc = (option) => {
  const iconName = option.icon;
  return iconName ? getImagePath(iconName) : '';
};

// Пример автоматического изменения состояния
onMounted(()=>{
  console.log(internalState)
  internalState.value = props.options[0]
})
</script>
