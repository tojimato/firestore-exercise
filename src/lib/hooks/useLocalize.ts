import { useQuery } from "@tanstack/react-query";
import { fetchLanguageData } from "../utils/localization/fetchLanguageData";
import { useEffect } from "react";
import { seedLocalizationData } from "../utils/localization/seedLocalizationData";

const CACHE_TIME = 5 * 60 * 60 * 1000; // 5 saat

export function useLocalize(language: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const checkAndSeedData = async () => {
        await seedLocalizationData();
      };

      checkAndSeedData();
    }
  }, []);

  return useQuery({
    queryKey: ["localizedTexts", language],
    queryFn: () => fetchLanguageData(language),
    staleTime: CACHE_TIME,
  });
}
