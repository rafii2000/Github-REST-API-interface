import React from 'react'
import './style.css'

const Commit = ({commitJSON}) => {

    return(
        
        <div className='commit'>  

            <div className='commit__layout'>
                <div className='commit_sha'>
                    <a href={commitJSON.html_url}>{commitJSON.sha.substr(0,7)}</a>
                </div>
    
                <div className='commit_message'>
                    {commitJSON.commit.message}
                </div>
    
                <div className='commit_who_when'>
                    <div>{commitJSON.commit.author.name}</div>
                    <div>{commitJSON.commit.author.date.substr(0,10)}</div>
                </div>
    
            </div>   

        </div>
    )

}

export default Commit
