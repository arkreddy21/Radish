import React, {useState, createContext, useContext, useEffect} from "react";

const AppContext = createContext<any>({});

const AppProvider: React.FC<{children: JSX.Element}> = ({children}) => {
  const initialTokens = {
    access: `${localStorage.getItem('access_token') || ''}`,
    refresh: `${localStorage.getItem('refresh_token') || ''}`
  }
  const [tokens, setTokens] = useState(initialTokens)
  const [user, setUser] = useState('')
  const state_str = Math.random().toString(36).substring(2);

  useEffect(()=>{
    console.log(tokens);
    localStorage.setItem('access_token',tokens.access)
    localStorage.setItem('refresh_token',tokens.refresh)
  },[tokens])

  return <AppContext.Provider value={{tokens,setTokens, state_str, user, setUser}}>
    {children}
  </AppContext.Provider>
}

const useGlobalContext=() => {
  return useContext(AppContext)
}


export {AppContext, AppProvider, useGlobalContext}