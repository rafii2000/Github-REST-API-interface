import React from 'react'
import './style.css'

const Contributor = ({imgUrl, login, contributions}) => {

    return(
        <div className='contributor'>

            <div className='contributor__img'>
                <img src={imgUrl} alt=''></img>
            </div>

            <div className='contributor__login'>
                <a href={`/user-details/${login}`}>
                    {login}
                </a>
            </div>

            <div className='contributor__contributions'>Total: {contributions}</div>
        </div>
    )
}

export default Contributor