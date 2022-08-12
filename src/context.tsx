import React, {useState, createContext, useContext, useEffect} from "react";
import { useLocalStorage } from "@mantine/hooks";
import { getUser } from "./utils/RedditAPI";

const AppContext = createContext<any>({});

const AppProvider: React.FC<{children: JSX.Element}> = ({children}) => {
  
  const [tokens,setTokens] = useLocalStorage({key:'tokens', defaultValue:{access:'',refresh:''}})
  const [user, setUser] = useState('')
  const [isEnabled, setEnabled] = useState(false)
  const [userdata, setUserdata] = useState()

  const state_str = Math.random().toString(36).substring(2);
  useEffect(()=>{
  localStorage.getItem('state_str') || localStorage.setItem('state_str',state_str)
  },[])

  useEffect(() => {
    tokens.access ?
      getUser(tokens.access).then((data: any) => {
        console.log(data);
        setUserdata(data)
        setUser(data.name);
        setEnabled(true)
      }) : setEnabled(true)
  }, [tokens]);

  return <AppContext.Provider value={{tokens,setTokens, state_str, user, userdata, setUserdata, isEnabled}}>
    {children}
  </AppContext.Provider>
}

const useGlobalContext=() => {
  return useContext(AppContext)
}


export {AppContext, AppProvider, useGlobalContext}