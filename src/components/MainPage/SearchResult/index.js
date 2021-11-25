import React from 'react'
import { useState, useEffect} from 'react'
import { useParams, useHistory, useLocation} from 'react-router-dom'

import ProgressBar from '../../Layout/ProgressBar'
import RepoResultCard from './RepoResultCard'
import UserResultCard from './UserResultCard'
import PaginationControler from './PaginationControler'
import './style.css'



export default function SearchResult({searchResultDTO}) {
    
    const [linkHeader, setLinkHeader] = useState()
    const [searchData, setSearchData] = useState()
    const [searchScope, setSearchScope] = useState()
    const [resultError, setResultError] = useState()
    const [prevProps, setPrevProps ] = useState({})
   
    const urlParams = useParams()
    const location = useLocation()
    const history = useHistory()
    const urlParamsEmpty = Object.keys(urlParams).length === 0 ? true : false

    useEffect(() => {
        //update states only when props are changed
        if(searchResultDTO.linkHeader !== prevProps.linkHeader || searchResultDTO.searchScope !== prevProps.searchScope){
            setLinkHeader(searchResultDTO.linkHeader)
            setSearchData(searchResultDTO.searchData)
            setSearchScope(searchResultDTO.searchScope)
            setResultError(searchResultDTO.error)
            setPrevProps(searchResultDTO)
        }
        
    }, [searchResultDTO, prevProps])


    const SearchResultsList = () => {

        switch (searchScope) {
            case 'repositories':
                return searchData && searchData.items.map((item, id) => <RepoResultCard key={id} item={item} id={id+1}></RepoResultCard>)
            
            case 'users':
                return searchData && searchData.items.map((item, id) => <UserResultCard key={id} item={item} id={id+1}></UserResultCard>)

            default:
                break;
        }

    }

    const updateRoute = (url) => {
        //split params from query URL
        const urlSearchParams = new URLSearchParams(url);
        const params = Object.fromEntries(urlSearchParams.entries());

        let newUrl = location.pathname //get current pathname
        let index = newUrl.lastIndexOf('/', newUrl.lastIndexOf('/')-1)    //find second index to end of('/')
        newUrl = newUrl.slice(0, index) //remove old 'page/perpage' params
        newUrl = newUrl + '/' + params.page + '/' + params.per_page //add new page and per_page params 
        history.push(newUrl) //render MainPage with new params
    }

    const changeResultPage = (url) => {

        if(url) updateRoute(url)
    }

    
    return (    
        <div className='search_result_container'>

            <ProgressBar width={'var(--search_result--width)'} margin={'0 0 0 var(--search_result--margin_left) '} ></ProgressBar>
            
            {searchData && 
                <div className='search_result__statistics'>
                    <p>Found <b>{searchData.total_count}</b> results for {searchScope}:</p>
                    <a href='https://api.github.com/rate_limit' target='_blank' rel='noreferrer'> Check your API rate limit</a>
                </div>

                
            }
            
            {searchData &&
                <div className='search_result__list'>
                    <SearchResultsList></SearchResultsList>
                </div>
            }

            {!searchData && !resultError && urlParamsEmpty &&
                <div className='search_result__no_criteria_prompt'>
                    <div className='no_criteria_prompt__main_message'>
                        <b>Enter your criteria!</b>
                    </div>
                    <p>Your criteria from the Search Panel will be displayed here</p>
                </div>
            }

            {resultError && 
                <div className='search_result__error'>
                    <div className='error__code'>{resultError.code}</div>
                    <div className='error__message'>{resultError.message}</div>
                </div>
            }
            
            {linkHeader && <PaginationControler linkHeader={linkHeader} changeResultPage={changeResultPage}/>}

        </div>
    )

}


