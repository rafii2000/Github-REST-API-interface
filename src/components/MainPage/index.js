import { useState } from 'react'
import React from 'react'

import SearchForm from './SearchForm'
import SearchResult from './SearchResult'
import './style.css'


export default function MainPage() {
    
    const [searchResultDTO, setSearchResultDTO] = useState('')
    
    return (
        <div className='main_page'>

            <SearchForm setSearchResultDTO={setSearchResultDTO} ></SearchForm>
            <SearchResult searchResultDTO={searchResultDTO}></SearchResult>

        </div>
    )
}
