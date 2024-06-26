// hooks/useFetchUserData.ts
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../providers/AppProvider";
import { useEffect } from "react";
import { User } from "../models/User";

interface FetchUserDataResponse extends User {}

function useFetchUserData() {
  const { currentUser, setCurrentUser } = useAppContext();

  const { data, error, isFetching } = useQuery<FetchUserDataResponse, Error>({
    queryKey: ["user", currentUser?.id],
    queryFn: () => fetchUserData("test"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (data) {
      setCurrentUser(data);
    }
  }, [data]); // bağımlılık listesine sadece data ekliyoruz

  return { data, error, isFetching };
}

async function fetchUserData(userId: string): Promise<FetchUserDataResponse> {
  try {
    //DUMMY REQUEST
    const response = {
      ok: true,
      json: async (): Promise<FetchUserDataResponse> => {
        return {
          first: "tojimato",
        } as FetchUserDataResponse;
      },
    };

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    console.log(response.json());

    return response.json() as Promise<FetchUserDataResponse>;
  } catch (error) {
    console.error("Fetching user data failed:", error);
    throw error;
  }
}

export default useFetchUserData;
