<template>
  <div class="px-6 py-5 ">
    <div class="container mx-auto">
      <div class="flex flex-col w-full">
      <div class="grid mx-auto grid-cols-1 w-full sm:grid-cols-2 gap-2 lg:max-w-4xl">
        <div class="flex mb-5 items-center rounded-xl border-2 border-gray-600 w-full pl-3 placeholder-gray-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600  disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none sm:text-sm dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20">
          <input type="text" class="flex-1 text-white max-w-full w-full bg-transparent font-semibold text-lg h-full outline-none focus:outline-hidden" maxlength="100" @input="changeInputValue" v-model="inputValue" placeholder="0">
          <Dropdown v-model.number="cryptoCurrencyValue" :options="cryptoCurr" />
        </div>
        <div class="flex mb-5 items-center rounded-xl border-2 border-gray-600 w-full pl-3 placeholder-gray-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600  disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none sm:text-sm dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20">
          <input type="text" class="flex-1 text-white w-full max-w-full bg-transparent font-semibold text-lg h-full outline-none focus:outline-hidden" maxlength="100" @input="changeResultValue" v-model="result" placeholder="0">
          <Dropdown :options="fiatCurr" v-model.number="fiatCurrency" />
        </div>
      </div>
    </div>
      <div class="grid grid-col-1 justify-center">
        <ConversionHistory class="mt-5" :conversionHistory="conversionHistory" />
      </div>
  </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted,watch } from "vue";
type ApiResponse = {
  [crypto: string]: {
    [fiat: string]: number;
  };
};

interface Data {
  sum:number,fiat:string,cryptoCurrency:string,result:number
}

interface CryptoData {
  label: string, name: string, icon: string
}

// Устанавливаем значение по умолчанию
const conversionHistory = ref<Data[]>([]);
let inputValue = ref(1);
const conversionData = ref({
  sum:1,fiat:"",cryptoCurrency:"",result:1
})

const cryptoCurrencyPrice = ref(1);
const result = ref(1);
const cryptoCurrencyValue = ref<CryptoData>({label: "", name: "", icon: ""});
const fiatCurrency = ref<CryptoData>({label: "", name: "", icon: ""});

// Создаём реактивную переменную для хранения цен
const prices:any = ref({});

// Функция для получения данных с API
const fetchPrices = async () => {
  if (!cryptoCurrencyValue.value?.name || !fiatCurrency.value?.name) {
    console.error('cryptoCurrencyValue or fiatCurrency is not set correctly.');
    return;
  }

  const crypto = cryptoCurrencyValue.value.name;
  const fiat = fiatCurrency.value.name;

  try {
    // Выполняем запрос
    const data = await $fetch<ApiResponse>(`/api/prices`, {
      params: { crypto, fiat },
    });

    console.log('Response data:', data);

    // Проверяем наличие данных
    if (data?.[crypto]?.[fiat] === undefined) {
      console.error('Price not found in API response:', data);
      return;
    }

    prices.value = data;

    const price = data[crypto][fiat];
    console.log('Extracted price:', price);

    if (price) {
      cryptoCurrencyPrice.value = price;
      result.value = cryptoCurrencyPrice.value; // Обновляем цену
    }
  } catch (err) {
    console.error('Failed to fetch prices:', err);
  }
};


// 1-ый инпут умножается на cryptoCurrencyPrice при наблюдении за первым инпутом
// 1-ый инпут делится на 2-ой инпут при наблюдении за вторым инпутом

// Функция для изменения inputValue
const changeResultValue = () => {
  const cryptoPrice = cryptoCurrencyPrice.value;
  const resultVal = result.value;

  if (!isNaN(cryptoPrice) && !isNaN(resultVal) && resultVal !== 0) {
    // Делим inputValue на resultVal и обновляем inputValue
    inputValue.value = Number(parseFloat((resultVal / cryptoPrice).toString()).toFixed(8));
    conversionData.value.sum = Number(inputValue.value);
    conversionData.value.result = Number(result.value);
    saveToLocalStorage()
  } else {
    console.warn("Некорректное значение для вычислений");
  }
};



// Функция для изменения result
const changeInputValue = () => {
  const inputVal = inputValue.value;
  const cryptoPrice = cryptoCurrencyPrice.value;

  if (!isNaN(inputVal) && !isNaN(cryptoPrice) && cryptoPrice !== 0) {
    result.value = Number(parseFloat((inputVal * cryptoPrice).toString()).toFixed(8));
    conversionData.value.result = Number(result.value);
    conversionData.value.sum = Number(inputValue.value);
    saveToLocalStorage()
  } else {
    console.warn("Некорректное значение для вычислений");
  }
};

const saveToLocalStorage = () => {
  addConversionHistory()
  localStorage.setItem("conversionHistory", JSON.stringify(conversionHistory.value));
}

const addConversionHistory = () => {
  if (conversionHistory.value.length >= 5) {
    conversionHistory.value.shift(); // Удаляет первый элемент
  }
  conversionHistory.value.push({
    sum:conversionData.value.sum,
    fiat:conversionData.value.fiat,
    cryptoCurrency:conversionData.value.cryptoCurrency,
    result:conversionData.value.result
  })
}

const loadConversionHistory = ()=>{
  const storedHistory = localStorage.getItem("conversionHistory");
  if (storedHistory) {
    conversionHistory.value = JSON.parse(storedHistory) as Data[];
  }
}

// Наблюдаем за изменением валют
watch(
  [cryptoCurrencyValue, fiatCurrency],
  ([crypto, fiat]) => {
    if (crypto?.name && fiat?.name) {
      fetchPrices();
    }
  },
  { immediate: true }
);
// Автоматическое выполнение при изменении resultVal
watch([result,inputValue,cryptoCurrencyValue,fiatCurrency], () => {
  conversionData.value.fiat = fiatCurrency.value.label;
  conversionData.value.cryptoCurrency = cryptoCurrencyValue.value.label;
});


onMounted(()=>{
  loadConversionHistory()
  fetchPrices()
})

// Данные для валют
const fiatCurr = [{label:'USD',name:"usd",icon:"usd.png"},{label:'EUR',name:"eur",icon:"eur.png"}];
const cryptoCurr = [{ label: 'BTC', name: 'bitcoin',icon:"btc.png" },{label:'ETH',name:"ethereum",icon:"eth.png"}];
</script>


