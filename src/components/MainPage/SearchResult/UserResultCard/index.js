import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import {GoRepo} from 'react-icons/go'
import {BsBuilding} from 'react-icons/bs'
import {IoEarthOutline} from 'react-icons/io5'
import {BsFillPeopleFill} from 'react-icons/bs'
import {AiOutlineMail} from 'react-icons/ai'
import {FaGithub} from 'react-icons/fa'

import './style.css'
import '../ResultCard/style.css'

export default function UserResultCard({item, id}) {
    
    const [details, setDetails] = useState()

    //Error: requestes limit from API
    // useEffect(() => {
    //     // getUserDetails(item.url)
    // }, [])

    const getUserDetails = (url) => {
        
        if(details) return

        axios.get(url)
        .then((res) => {
            setDetails(res.data)
        })
        .catch((err) => {
        })
        
    }
    
    return (
        <div className='user_result_card'>

            <div className='result_card__result_number'>{id}</div>

            <div className='result_card__informations'> 
                <div className='result_card__primary_link'>
                    <a href={item.html_url} target='_blank' rel='noreferrer'> <FaGithub/>{item.login} </a> {/*Link to GitHub profile*/}
                    {details && details.name}
                </div>
                <div className='result_card__description'></div>
               
                {details &&
                    <div className='result_card__user_details'>
                        <div className='result_card__description'>{details.bio}</div>
                        <div className='result_card__sort_parameters'>
                            <div className='result_card__sort_parameter'> {details.location && <> <IoEarthOutline/> {details.location} </>}</div>
                            <div className='result_card__sort_parameter'> {details.company && <> <BsBuilding/> {details.company} </>}</div>
                            <div className='result_card__sort_parameter'> <BsFillPeopleFill/> {details.followers}</div>
                            <div className='result_card__sort_parameter'> {details.email && <> <AiOutlineMail/> {details.email} </>}</div>
                            <div className='result_card__sort_parameter'> {details.public_repos && <> <GoRepo/> {details.public_repos} </>}</div>
                        </div>
                    </div>
                }

            </div>

            <div className='result_card__menu'>
                <div className='result_card__menu__button' onClick={() => {getUserDetails(item.url)}}>Details</div>
                
                <Link to={`/user-details/${item.login}/repositories`}>
                    <div className="result_card__menu__button">Subpage</div>
                </Link>
            </div>
            
        </div>
    )
}
