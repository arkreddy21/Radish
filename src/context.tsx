import React, {useState, createContext, useContext, useEffect} from "react";

const AppContext = createContext<any>({});

const AppProvider: React.FC<{children: JSX.Element}> = ({children}) => {
  const [tokens, setTokens] = useState({access:'',refresh:''})
  const [user, setUser] = useState('')
  const state_str = Math.random().toString(36).substring(2);

  useEffect(()=>{console.log(tokens);
  },[tokens])

  return <AppContext.Provider value={{tokens,setTokens, state_str, user, setUser}}>
    {children}
  </AppContext.Provider>
}

const useGlobalContext=() => {
  return useContext(AppContext)
}


export {AppContext, AppProvider, useGlobalContext}