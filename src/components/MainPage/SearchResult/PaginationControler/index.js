import React from 'react'
import parseLinkHeader from 'parse-link-header'
import './style.css'


const PaginationControler = ({linkHeader, changeResultPage}) => {

    let parsedLinks = parseLinkHeader(linkHeader)
    
    const PagesBetween = () => {
        
        let firstPage = 1
        let currentPage = null
        let lastPage = null
        let pagesSequence = []
        let firstPageUrlPattern = null
        let lastPageUrlPattern = null
        
        //find currentPage
        if(parsedLinks.next) currentPage = parseInt(parsedLinks.next.page) - 1
        else if(parsedLinks.prev) currentPage = parseInt(parsedLinks.prev.page) + 1

        //find lastPage
        if(parsedLinks.last) lastPage = parseInt(parsedLinks.last.page)
        else lastPage = parseInt(parsedLinks.prev.page)+1

        //find link pattern
        if(parsedLinks.last) lastPageUrlPattern = parsedLinks.last.url
        else firstPageUrlPattern = parsedLinks.first.url
        
        //determine pages sequence 
        //for each sequence first and last pages must be excluded - first and last pages are hardcoded!
        if(lastPage <= 11){
            // (1) 2 3 4 5 ...  9 10 (11) - all pages
            for(let i=2; i<lastPage; i++){
                pagesSequence.push(i)
            }
        }
        else if(currentPage >= 1 && currentPage <= 1 + 7){
            //(1) 2 3 4 5 6 7 8  ... 199 (200)
            pagesSequence = [2, 3, 4 ,5, 6, 7, 8, '...', lastPage-1]
        }
        else if(currentPage >= 9 && currentPage <= lastPage - 7){
            //(1) 2 ... 7 8 9 10 11 ... 199 (200)
            pagesSequence = [firstPage+1, '...', currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2, '...', lastPage-1]
        }
        else if(currentPage >= lastPage - 7 && currentPage <= lastPage){
            //(1) 2 ... 193 194 195 196 197 198 199 (200)
            pagesSequence = [2, '...']
            for(let i=7; i>0; i--){
                pagesSequence.push(lastPage-i)
            }

        }

        const createUrl = (page) => {

            if(lastPageUrlPattern){
                let url = lastPageUrlPattern
                let searchValue = '&page='+lastPage
                let newValue = '&page='+page
                return url.replace(searchValue, newValue)
                
            }

            if(firstPageUrlPattern){
                let url = lastPageUrlPattern
                let searchValue = '&page='+firstPage
                let newValue = '&page='+page
                return url.replace(searchValue, newValue)
            }
        }

        return(
            pagesSequence.map( (page, id) => 

                page === currentPage ?
                    // currentPage
                    <div className='pagination_controler__page_button--active' key={id}>
                        {page}
                    </div>
                :
                page === '...' ?
                    // more pages (...)
                    <div className='pagination_controler__more_pages' key={id}>                                    
                        {page}
                    </div>
                :
                // nearest pages
                <div 
                    className='pagination_controler__page_button'
                    key={id}
                    onClick={() => changeResultPage(createUrl(page))}
                >
                    {page}
                </div>
                
            )
        )

    }

   
    return(
        <div className='pagination_controler'>
   
            {/* Previous page button */}
            {parsedLinks.prev ? 
                <div className='pagination_controler__nav_button' onClick={() => {changeResultPage(parsedLinks.prev.url);  }}>
                    {'< Previous'}
                </div>
            :
                <div className='pagination_controler__nav_button--disabled'>
                    {'< Previous'}
                </div>
            }


            {/* First page button e.g: 1 */}
            {parsedLinks.first ?
                    
                <div className='pagination_controler__page_button' onClick={() => {changeResultPage(parsedLinks.first.url)}}>
                    {parsedLinks.first.page}
                </div>
            :
                <div className='pagination_controler__page_button--active'>
                    {parseInt(parsedLinks.next.page)-1}
                </div>
            }

    
            {parsedLinks && <PagesBetween></PagesBetween>}
                
                               
            {/* Last page button e.g: 200 */}
            { parsedLinks.last ?

                <div className='pagination_controler__page_button' onClick={() => {changeResultPage(parsedLinks.last.url)}}>
                    {parsedLinks.last.page}
                </div>
            :
                <div className={'pagination_controler__page_button--active'}>
                    {parseInt(parsedLinks.prev.page)+1}
                </div>
            }

            {/* Next page button */}
            {parsedLinks.next ?
                <div className='pagination_controler__nav_button' onClick={() => {changeResultPage(parsedLinks.next.url)}}>
                    {'Next >'}
                </div>
            :
                <div className='pagination_controler__nav_button--disabled'>
                    {'Next >'}
                </div>
            }

        </div>
    )
}


export default PaginationControler
