import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
    key: "PersistedQueryStorage",
    throttleTime:300
  });
  // const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })
  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;