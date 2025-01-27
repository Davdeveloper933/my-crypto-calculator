import { defineEventHandler, getQuery } from 'h3';
import { $fetch } from 'ofetch';

interface ApiResponse {
  [key: string]: {
    [key: string]: number;
  };
}

const cache = new Map<string, { data: ApiResponse; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // Кэшировать данные на 1 минуту

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const crypto = query.crypto as string;
  const fiat = query.fiat as string;

  if (!crypto || !fiat) {
    return { error: 'Both crypto and fiat parameters are required.' };
  }

  const cacheKey = `${crypto}-${fiat}`;
  const now = Date.now();

  // Проверяем кэш
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  // Если в кэше данных нет, выполняем запрос к API
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`;
    const data = await $fetch<ApiResponse>(url);
    console.log(data)

    // Сохраняем данные в кэш
    cache.set(cacheKey, { data, timestamp: now });

    return data;
  } catch (error) {
    console.error('Error fetching cryptocurrency prices:', error);
    return { error: 'Failed to fetch data from API.' };
  }
});
