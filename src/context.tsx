import React, {useState, createContext, useContext, useEffect} from "react";
import { useLocalStorage } from "@mantine/hooks";
import { getUser, refreshToken } from "./utils/RedditAPI";

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

  useEffect(()=>{console.log(tokens)},[tokens])

  //TODO: both cases running in ternanry operator. token empty initially even when stored locally
  useEffect(() => {
    tokens.access ?
      getUser(tokens.access).then((res) => {
        console.log(res)
        if (res.status===401) {
          refreshToken(tokens.refresh).then((data:any)=>{
            console.log("auto refreshing token")
            console.log(data)
            setTokens({...tokens,access: data.access_token})
          })
        } else {
          console.log(res.status);
          setUserdata(res.data)
          setUser(res.data.name);
          //TODO: setEnabled going true even when commented
          console.log("inside case 1")
          setEnabled(true)
        }
      }) : (console.log("inside case 2"),setEnabled(true))
  }, [tokens]);

  return <AppContext.Provider value={{tokens,setTokens, state_str, user, userdata, setUserdata, isEnabled}}>
    {children}
  </AppContext.Provider>
}

const useGlobalContext=() => {
  return useContext(AppContext)
}


export {AppContext, AppProvider, useGlobalContext}