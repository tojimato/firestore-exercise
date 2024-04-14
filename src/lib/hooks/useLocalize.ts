import { useQuery } from "@tanstack/react-query";
import { fetchLanguageData } from "../utils/localization/fetchLanguageData";
import { seedLocalizationData } from "../utils/localization/seedLocalizationData";
import { LocalizedStrings } from "../utils/localization/types/LocalizedStrings";
import { useEffect } from "react";

const CACHE_TIME = 5 * 60 * 60 * 1000; // 5 saat

export function useLocalize(language: string) {

  useEffect(() => {
    const initializeData = async () => {
      if (process.env.NODE_ENV === "development") {
        await seedLocalizationData();
      }
    };

    initializeData();
  }, []);

  const { data, error, isFetching } = useQuery({
    queryKey: ["localizedTexts", language],
    queryFn: () => fetchLanguageData(language),
    staleTime: CACHE_TIME,
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
