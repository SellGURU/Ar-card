import { createContext, useState } from "react";

export const AppContext = createContext({
    userAccount:{
        type:'Free',
        register_date:'',
        end_of_date:''
    },
    setUserAccount:() => {}
})

const AppContextProvider = ({children} ) => {
    const [userAccount,setUserAccount] = useState({
        type:'Free',
        register_date:'',
        end_of_date:''
    })
    const contextValue = {
        userAccount,
        setUserAccount
    };
    return(
        <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
    );
}

export default AppContextProvider