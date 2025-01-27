<template>
  <div class="min-h-screen overflow-x-auto">
    <div class=" bg-gray-800 shadow-lg w-max rounded-2xl">
      <h2 class="text-xl max-w-max w-max flex flex-1 font-bold text-white p-4 border-b border-gray-700">
        Last 5 Cryptocurrency Conversions
      </h2>
      <table class="min-w-full w-full border-collapse">
        <thead>
        <tr class="bg-gray-600 border-b border-gray-700">

          <th class="p-4 text-left text-sm font-semibold text-white">Cryptocurrency</th>
          <th class="p-4 text-left text-sm font-semibold text-white">Amount</th>
          <th class="p-4 text-left text-sm font-semibold text-white">Converted To</th>
          <th class="p-4 text-left text-sm font-semibold text-white">Result</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(conversion,index) in conversionHistory" :key="index" class="odd:bg-gray-500 even:bg-gray-400">

          <td class="p-4 text-sm text-white">{{ conversion.cryptoCurrency }}</td>
          <td class="p-4 text-sm text-white">{{ conversion.sum }}</td>
          <td class="p-4 text-sm text-white">{{ conversion.fiat }}</td>
          <td class="p-4 text-sm text-white">{{ conversion.result }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
// Static data for conversions
const props = defineProps({
  conversionHistory: {}
})

interface Data {
  sum:string,fiat:string,cryptoCurrency:string,result:string
}

// Устанавливаем значение по умолчанию
// const conversionHistory = ref<Data[]>([]);

// const loadConversionHistory = ()=>{
//   const storedHistory = localStorage.getItem("conversionHistory");
//   if (storedHistory) {
//     conversionHistory.value = JSON.parse(storedHistory) as Data[];
//   }
// }

// const saveToLocalStorage = () => {
//   const storedHistory = localStorage.getItem("conversionHistory");
//   if(!storedHistory) {
//     localStorage.setItem("conversionHistory", JSON.stringify(conversionHistory.value));
//   }
// }

onMounted(()=>{
  // saveToLocalStorage()
  // loadConversionHistory();
})
</script>