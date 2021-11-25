import React from 'react'
import './style.css'

const Follower = ({imgUrl, login}) => {

    return(
        <div className='follower'>

            <div className='follower__img'>
                <img src={imgUrl} alt=''></img>
            </div>

            <div className='follower__login'>
                <a href={`/user-details/${login}`}>
                    {login}
                </a>
            </div>
        </div>
    )
}

export default Follower