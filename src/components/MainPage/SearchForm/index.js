import { useState, useEffect, useContext} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import React from 'react'
import axios from 'axios'

import AppContext from '../../../context/AppContext'
import './style.css'

export default function SearchForm({setSearchResultDTO}) {

    const [searchScope, setSearchScope] = useState('repositories')
    const [searchPhrase, setSearchPhrase] = useState('github')
    const [activeScopeBtn, setActiveScopeBtn] = useState(2)
    const [activeSortByBtn, setActiveSortByBtn] = useState(null)

    const [sort, setSort] = useState('null')
    const [order, setOrder] = useState('desc')
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(30)

    const urlParams = useParams()
    const history = useHistory()
    const {startStopProgressBar, getCachedData, addCachedData} = useContext(AppContext)

  
    useEffect(() => {
        
        const fetchData = (urlParams) => {

            let apiURL = `https://api.github.com/search/${urlParams.scope}?q=${urlParams.phrase}&order=${urlParams.order}&sort=${urlParams.sort}&page=${urlParams.page}&per_page=${urlParams.perpage}`
            let pathURL = `/${urlParams.scope}/${urlParams.phrase}/${urlParams.order}/${urlParams.sort}/${urlParams.page}/${urlParams.perpage}`

            startStopProgressBar('start')
    
            axios.get(apiURL)
            .then(async (res) => {
                startStopProgressBar('stop')
                addCachedData(pathURL, {linkHeader: res.headers.link, data: res.data, searchScope: urlParams.scope })
                await setSearchResultDTO({linkHeader: res.headers.link, searchData: res.data, searchScope: urlParams.scope })
               
            })
            .catch(async (err) => {
                await setSearchResultDTO({error: {code: err.request.status + " " + err.request.statusText, message: err.response.data.message}});
                startStopProgressBar('stop')
            })
    
        }

        //TODO: add params validation

        //set states from URL
        if(urlParams.scope) setSearchScope(urlParams.scope)
        if(urlParams.phrase) setSearchPhrase(urlParams.phrase)
        if(urlParams.order) setOrder(urlParams.order)
        if(urlParams.sort) setSort(urlParams.sort)
        if(urlParams.page) setPage(parseInt(urlParams.page))
        if(urlParams.perpage) setPerPage(parseInt(urlParams.perpage))

        //TODO: set input's values and active buttons

                
        //if data in cache don't fetch data
        let cachedData = getCachedData(history.location.pathname)
        if(cachedData){
            console.log('Data is retrieving from cache: ', history.location.pathname)
            setSearchResultDTO({    
                linkHeader: cachedData.data.linkHeader,
                searchData: cachedData.data.data,
                searchScope: cachedData.data.searchScope
            })
        }
        //if urlParams not empty -> fetchData() and re-render
        //no data in cache or out of date, data will be fetch
        else if(Object.keys(urlParams).length === 6){
            console.log('No data in cache or out of date, data is fetching ...', history.location.pathname)
            fetchData(urlParams)
        }
       
    }, [urlParams, setSearchResultDTO, startStopProgressBar, addCachedData ,getCachedData, history])


    const updateRoute = (newUrlParams) => {
        
        if(newUrlParams){
            //triggered by search_in or sort_by sections
            let newURL = `/${newUrlParams.searchScope || searchScope}/${newUrlParams.searchPhrase || searchPhrase}/${newUrlParams.order || order}/${newUrlParams.sort || sort}/${1}/${30}`
            if(newURL !== history.location.pathname)
                history.push(newURL)
        }
        else{
            //triggered by submit_button or onEnterClick
            let newURL = `/${searchScope}/${searchPhrase}/${order}/${sort}/${1}/${30}`
            if(newURL !== history.location.pathname)
                history.push(newURL)
        }
    }
   

    const setScopeOnClick = (scope, btnID) => {
        
        //change search scope
        setSearchScope(scope)
        setActiveScopeBtn(btnID)
        
        //when search scope is changed, SortBy section must be reset
        setActiveSortByBtn(null)
        setOrder('desc')
        setSort('null')

        //apply changes by update url
        updateRoute({searchScope: scope, order:'desc', sort:'null'})
    }

    const setUrlParams = (order, sort, sortBtnID) => {
        
        if(activeSortByBtn === sortBtnID){
            // Sort: Best Match
            setActiveSortByBtn(null)
            setOrder('desc')
            setSort('null')
            updateRoute({order: 'desc', sort: 'null'})
        }
        else{
            setActiveSortByBtn(sortBtnID)
            setOrder(order)
            setSort(sort)
            updateRoute({order: order, sort: sort})
        }

    }

    
    const SortBySection = () => {
        
        const apiSortOptions = {
            repositories:[
                ['desc', 'stars', 'Most stars'],
                ['asc', 'stars', 'Fewest stars'],
                ['desc', 'forks', 'Most forks'],
                ['asc', 'forks', 'Fewest forks'],
                ['desc', 'updated', 'Recently updated'],
                ['asc', 'updated', 'Least recently updated']
            ],
            users:[
                ['desc', 'followers', 'Most followers'],
                ['asc', 'followers', 'Fewest followers'],
                ['desc', 'repositories', 'Most repositories'],
                ['asc', 'repositories', 'Fewest repositories'],
                ['desc', 'joined', 'Most recently joined'],
                ['asc', 'joined', 'Last recently joined']
            ]
        }

        if(!searchScope) return <></>

        return apiSortOptions[searchScope].map( (item, id) => 
            <div className={activeSortByBtn === id ? 'sort_by__button--active' : 'sort_by__button'} key={id}onClick={() => {setUrlParams(item[0], item[1], id)}}>
                {item[2]}
            </div>
        )
    }

    const submitOnEnter = (e) => {
        if(e.key === 'Enter') updateRoute()
    }

    return (

        <div className='search_container hide_scrollbars'>

            <div className='search_container__section'>
                <div className='section__name'>Search in:</div>
                <div className='section__search_in'>
                    <div className={activeScopeBtn === 1 ? 'search_in__scope_button--active' : 'search_in__scope_button' } onClick={() => setScopeOnClick('users', 1)}>Users</div>
                    <div className={activeScopeBtn === 2 ? 'search_in__scope_button--active' : 'search_in__scope_button' } onClick={() => setScopeOnClick('repositories', 2)}>Repositories</div>
                    <div className={'search_in__scope_button--disabled'}>Code</div>         {/* code */}
                    <div className={'search_in__scope_button--disabled'}>Commits</div>      {/* commits */}
                    <div className={'search_in__scope_button--disabled'}>Issues</div>       {/* issues */}
                    <div className={'search_in__scope_button--disabled'}>Packages</div>     {/* packages */}
                    <div className={'search_in__scope_button--disabled'}>Marketplace</div>  {/* marketplace */}
                    <div className={'search_in__scope_button--disabled'}>Topics</div>       {/* topics */}
                </div>
            </div>

            <div className='search_container__section'>
                <div className='section__name'>Searching phrase:</div>
                <div className='section__searching_phrase'>
                    <input placeholder='For example: Python, react-native, blockchain ...'
                        onChange={(e) => setSearchPhrase(e.target.value || 'github')}
                        onKeyDown={submitOnEnter}>
                    </input>
                </div>
            </div>

            <div className='search_container__section'>
                <div className='section__name'>Sort by:</div>
                <div className='section__sort_by'>
                    <div className='sort_by'>
                        <SortBySection></SortBySection>
                    </div>
                </div>   

                <div className='section__sort_by_page'>
                    <label>Results per page:</label>
                    <label>Result page:</label>
                    <input type='number' min='1' max='100' placeholder='30'
                        onChange={(e) => setPerPage(e.target.value || 30)}
                        onKeyDown={submitOnEnter}>
                    </input>
                    <input type='number' min='1' placeholder='1'
                        onChange={(e) => setPage(e.target.value || 1)}
                        onKeyDown={submitOnEnter}>
                    </input>
                </div>
            </div>

            <div className='search_container__section'>
                <div className='section__name'>URL preview:</div>
                <div className='section__url_preview'>         
                    {`https://api.github.com/search/${searchScope}?q=${searchPhrase}&order=${order}&sort=${sort}&page=${page}&per_page=${perPage}`}
                </div>
            </div>


            <div className='search_container__section'>
                <button className='search_container__submit_button' onClick={() => updateRoute()}>
                    Show result
                </button>
            </div>
           
        </div>
    )

}
