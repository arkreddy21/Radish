import React, {useState, createContext, useContext, useEffect} from "react";
import { useLocalStorage } from "@mantine/hooks";
import { ColorScheme } from "@mantine/core";

const AppContext = createContext<any>({});

const AppProvider: React.FC<{children: JSX.Element}> = ({children}) => {
  
  const [tokens,setTokens] = useLocalStorage({key:'tokens', defaultValue:{access:'',refresh:''}})
  const [user, setUser] = useState('')
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({key:"colorScheme", defaultValue:"light"});
  
  const state_str = Math.random().toString(36).substring(2);
  useEffect(()=>{
  localStorage.getItem('state_str') || localStorage.setItem('state_str',state_str)
  },[])

  return <AppContext.Provider value={{tokens,setTokens, state_str, user, setUser, colorScheme, setColorScheme}}>
    {children}
  </AppContext.Provider>
}

const useGlobalContext=() => {
  return useContext(AppContext)
}


export {AppContext, AppProvider, useGlobalContext}