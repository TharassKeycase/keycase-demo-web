import React, { useContext } from "react";
import { useCreateReducer } from "@/hooks/useCreateReducer";

interface HomeInitialState {
  loading: boolean;
}

interface HomeContextProps {
  state: HomeInitialState;
  dispatch: (action: any) => void;
}

interface HomeProviderProps {
  children: React.ReactNode;
}

const HomeContext: React.Context<HomeContextProps> =
  React.createContext<HomeContextProps>(undefined!);

export const HomeProvider = ({
  children,
}: HomeProviderProps): JSX.Element => {
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState: {      
      loading: false,
    },
  });

  return (
    <HomeContext.Provider value={contextValue}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = (): HomeContextProps => {
  return useContext(HomeContext);
};