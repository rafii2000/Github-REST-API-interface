import React, { useState, useCallback, useMemo } from 'react'


const AppContext = React.createContext(true)

export default AppContext

export function AppContextProvider({children}) {
    
    const [progressBarState, setProgressBarState] = useState()    
    let cashedData = useMemo( () => {return {}}, [])    // url:{ data: {}, lastUpdate: new Date() }
    

    const startStopProgressBar = useCallback(
        (state) => {
            setProgressBarState(state)
        },
        []
    )

    const getCachedData = useCallback(
        (url) => {
            
            if(cashedData[url]){

                if(isCacheOutOfDate(cashedData[url].lastUpdate))
                    return null //means: data is cached but out of date, data will be fetched again
                else
                    return cashedData[url]  //means: data is cached and up to date
            }
            
            return null //means: data is not cached, data will be fetched
        },
        [cashedData]
    )
    
    
    const addCachedData = useCallback(
        (url, dataObject) => {

            let newData = {
                data: dataObject,
                lastUpdate: new Date()
            }

            cashedData[url] = newData //add data if not exist or update data if exist

        },
        [cashedData]
    )

    const isCacheOutOfDate = (date) => {

        const expiryTime = 10*60 //time in seconds
        
        if(Math.round((new Date() - date) / 1000) > expiryTime){
            return true
        }
       
        return false

    }

       
       

    return(

        <AppContext.Provider value={{
                progressBarState,
                startStopProgressBar,

                getCachedData,
                addCachedData,
            }
        }>
            {children}
        </AppContext.Provider>
   )
}


export function AppContextConsumer({children}){

    return(
        <AppContext.Consumer value={''}>
            {children}
        </AppContext.Consumer>
    )
}



