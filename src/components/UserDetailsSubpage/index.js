import React from 'react'
import { useState, useEffect, useContext, useCallback } from 'react'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import axios from 'axios'

import {BsBuilding} from 'react-icons/bs'
import {IoLocationOutline} from 'react-icons/io5'
import {AiOutlineMail} from 'react-icons/ai'
import {FaTwitter} from 'react-icons/fa'
import {TiAttachment} from 'react-icons/ti'

import AppContext from '../../context/AppContext'
import Follower from '../Layout/Follower'
import ProgressBar from '../Layout/ProgressBar'
import RepoResultCard from '../MainPage/SearchResult/RepoResultCard'
import './style.css'
import './subpage_template.css'

export default function UserDetails() {
    
    const [userData, setUserData] = useState(null)
    const [activeTab, setActiveTab] = useState(null)
    
    const history = useHistory()
    const {username, tab} = useParams()
    const {startStopProgressBar, getCachedData, addCachedData} = useContext(AppContext)

    const userUrl = `https:/api.github.com/users/${username}`
    const repoUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`
    const followersUrl = `https://api.github.com/users/${username}/followers`
    const followingUrl = `https://api.github.com/users/${username}/following`

    useEffect(() => {

            let noTabURL

            if(tab){
                setActiveTab(tab)
                noTabURL = history.location.pathname.substr(0, history.location.pathname.lastIndexOf('/'))
            }
            else{
                noTabURL = history.location.pathname
            }

       
        let cachedData = getCachedData(noTabURL)
        if(cachedData){
            setUserData(cachedData.data)
            return
        }

        startStopProgressBar('start')

        axios.all([
            axios.get(userUrl), 
        ])
        .then(axios.spread((res1) => {
            // Both requests are now complete
            setUserData(res1.data)
            addCachedData(noTabURL, res1.data)
            startStopProgressBar('stop')
        }))
        .catch(((err) => {
            startStopProgressBar('stop')
        }))

    }, [userUrl, repoUrl, username, tab, history, getCachedData, addCachedData, startStopProgressBar])

    const updateRoute = useCallback(
        (tab) => {
            setActiveTab(tab)  //previous state is remembered
            history.push(`/user-details/${username}/${tab}`)
        },
        [username, history],
    )

   
    return(

        <>
        <ProgressBar></ProgressBar>

        {(userData) &&
        
        <div className='user_subpage'>

            <div className='subpage__brief_column'>
               
                <div className='brief_column__brief_section'>

                    <div className='brief_section__about_user'>
                        <div className='about_user__avatar'>
                            <img src={userData.avatar_url} alt=''></img>
                        </div>
                        
                        <div className='about_user__name'>{userData.name}</div>
                        <div className='about_user__login'> {userData.login}</div>

                        <div className='about_user__follows'>
                                <div className='about_user__detail'> followers: {userData.followers}</div>
                                <div className='about_user__detail'> following: {userData.following}</div>
                            </div>

                        <div className='brief_section__details'>

                            <div className='brief_section__detail'> {userData.location && <> <IoLocationOutline/> {userData.location} </>}</div>
                            <div className='brief_section__detail'> {userData.company && <> <BsBuilding/> {userData.company} </>}</div>
                            <div className='brief_section__detail'> {userData.email && <> <AiOutlineMail/> {userData.email} </>}</div>
                            
                            <div className='brief_section__detail'>
                                {userData.twitter_username &&  
                                <a href={`https://twitter.com/${userData.twitter_username}`} target='_blank' rel='noreferrer'>
                                   <FaTwitter/> @{userData.twitter_username}
                                </a> }
                            </div>

                            <div className='brief_section__detail'>
                                {userData.blog &&
                                <a href={userData.blog.includes('http') ? userData.blog : `http://${userData.blog}`} target='_blank' rel='noreferrer'>
                                    <TiAttachment/> {userData.blog}
                                </a>}
                            </div>

                        </div>
                        
                    </div>

                </div>
                
                {userData.bio &&
                    <div className='brief_column__brief_section'>
                        <div className='brief_section__name'>Bio</div>
                        <div className='brief_section__bio'>
                            {userData.bio}
                        </div>
                    </div>
                }

                <div className='brief_column__brief_section'>
                    <div className='brief_section__name'>Sponsors</div>
                    <div className='brief_section__sponsors'></div>
                </div>

                <div className='brief_column__brief_section'>
                    <div className='brief_section__name'>Achievements</div>
                    <div className='brief_section__achievements'></div>
                </div>

                <div className='brief_column__brief_section'>
                    <div className='brief_section__name'>Highlights</div>
                    <div className='brief_section__highlights'></div>
                </div>
            </div>

            <div className='subpage__content_column'>
                
                <div className='content_column__nav_bar'>
                    <div className={activeTab === 'repositories' ? 'nav_bar__label--active' : 'nav_bar__label'} onClick={() => updateRoute('repositories')}>Repositories</div>
                    <div className={activeTab === 'followers' ? 'nav_bar__label--active' : 'nav_bar__label'} onClick={() => updateRoute('followers')}>Followers</div>
                    <div className={activeTab === 'following' ? 'nav_bar__label--active' : 'nav_bar__label'} onClick={() => updateRoute('following')}>Following</div>
                </div>

                <div className='content_column__content'>
                    {repoUrl && activeTab === 'repositories' ? <Repositories url={repoUrl}/> : ''}
                    {followersUrl && activeTab === 'followers' ? <Followers url={followersUrl}/> : ''}
                    {followingUrl && activeTab === 'following' ? <Following url={followingUrl}/> : ''}
                </div>
            </div>
            
        </div>
        }
        </>
    )
}



const Repositories = ({url}) =>{

    const [repositories, setRepositories] = useState()

    const location = useLocation()
    const {getCachedData, addCachedData} = useContext(AppContext)

    useEffect(() => {

        let cachedData = getCachedData(location.pathname)
        if(cachedData){
            setRepositories(cachedData.data)
            return
        }
        
        axios.get(url)
        .then((res) => {
            setRepositories(res.data)
            addCachedData(location.pathname, res.data)
        })
        .catch()

    }, [url, location, getCachedData, addCachedData])


    return(

        <div className='repositories_tab'>
            {repositories && repositories.map((repo, id) =>
                <RepoResultCard key={id} item={repo} id={id+1}></RepoResultCard>
            )}
        </div>
    )
}


const Followers = ({url}) =>{

    const [followers, setFollowers] = useState()

    const location = useLocation()
    const {getCachedData, addCachedData} = useContext(AppContext)

    useEffect(() => {

        let cachedData = getCachedData(location.pathname)
        if(cachedData){
            setFollowers(cachedData.data)
            return
        }
        
        axios.get(url)
        .then((res) => {
            setFollowers(res.data)
            addCachedData(location.pathname, res.data)
        })
        .catch()

    }, [url, location, getCachedData, addCachedData])

    
    return(

        <div className='followers_tab'>
            {followers && followers.map((follower, id) =>
                <Follower
                    key={id}
                    imgUrl={follower.avatar_url}
                    login={follower.login}
                ></Follower>
            )}

            {followers && followers.length === 0 ?
                <div>This user doesn't have any followers.</div> : ''
            }

        </div>
    )

}

const Following = ({url}) =>{

    const [following, setFollowing] = useState()
    const location = useLocation()
    const {getCachedData, addCachedData} = useContext(AppContext)

    useEffect(() => {

        let cachedData = getCachedData(location.pathname)
        if(cachedData){
            setFollowing(cachedData.data)
            return
        }

        axios.get(url)
        .then((res) => {
            setFollowing(res.data)
            addCachedData(location.pathname, res.data)
        })
        .catch((err) => {})

    }, [url, location, getCachedData, addCachedData])


    return(

        <div className='following_tab'>
            {following && following.map((follower, id) =>
                <Follower
                    key={id}
                    imgUrl={follower.avatar_url}
                    login={follower.login}
                ></Follower>
            )}

            {following && following.length === 0 ?
                <div>This user isn’t following anybody.</div> : ''
            }

        </div>
    )

}



