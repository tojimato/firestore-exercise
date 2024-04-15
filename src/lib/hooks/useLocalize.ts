import { useQuery } from "@tanstack/react-query";
import { fetchLanguageData } from "../utils/localization/fetchLanguageData";

const CACHE_TIME = 5 * 60 * 60 * 1000; // 5 saat
/**
 * 
 * @param language tr,en vb. language code degeri alir.
 * @remarks
 * Eger bu hook webte kullanilacaksa aşağıdaki şekilde ayar yapılmalı.
 * `@tanstack/react-query-persist-client` paketi kurularak ilgili ayarlar queryclient icin gerceklestirilmeli.
 * Genel ayarlar `lib -> provider -> ReactQueryProvider.tsx altında yapılmıştır. (web için) 
 * Eğer react native için kullanılacaksa
 * @example 
 *  import { QueryClient } from '@tanstack/react-query';
    import { createAsyncStoragePersister } from '@tanstack/react-query-persist-client';
    import AsyncStorage from '@react-native-async-storage/async-storage';

    // AsyncStorage için bir persister oluştur
    const asyncStoragePersister = createAsyncStoragePersister({
      storage: AsyncStorage,
      key: 'reactQueryCache',  // Bu anahtarla veriler kaydedilir
    });

    // QueryClient nesnesi oluştur
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: 5 * 60 * 60 * 1000, // 5 saat
          staleTime: 5 * 60 * 60 * 1000, // 5 saat
          refetchOnWindowFocus: false, // Pencere odağına geri dönüldüğünde yeniden sorgulama kapalı
        },
      },
      persister: asyncStoragePersister,  // Persister'i QueryClient ile kullan
    });
 * @returns 
 */
export function useLocalize(language: string) {
  const { data, error, isFetching } = useQuery({
    queryKey: ["localizedTexts", language],
    queryFn: () => fetchLanguageData(language),
    staleTime: CACHE_TIME,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const localizedTexts = new Proxy(data || {}, {
    get: function (target, property, receiver) {
      if (property in target) {
        return Reflect.get(target, property, receiver);
      }
      return property;
    },
  });

  return {
    resources: localizedTexts,
    error,
    isFetching,
  };
}
