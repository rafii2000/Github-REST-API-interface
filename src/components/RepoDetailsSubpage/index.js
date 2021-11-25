import React from 'react'
import { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, useLocation, useHistory, Link } from 'react-router-dom'
import axios from 'axios'

//react-icons
import {BsBuilding} from 'react-icons/bs'
import {IoLocationOutline} from 'react-icons/io5'
import {AiOutlineMail, AiOutlineHome} from 'react-icons/ai'
import {FaGithub} from 'react-icons/fa'
import {RiScales3Line} from 'react-icons/ri'
import {BiGitRepoForked} from 'react-icons/bi'
import {GoRepo} from 'react-icons/go'

//my components
import AppContext from '../../context/AppContext'
import Commit from '../Layout/Commit'
import Contributor from '../Layout/Contributor'
import ProgressBar from '../Layout/ProgressBar'
import './style.css'
import './subpage_template.css'

export default function RepoDetails() {
    
    const [repoData, setRepoData] = useState(null)
    const [languages, setLanguages] = useState(null)
    const [activeTab, setActiveTab] = useState(null)

    const history = useHistory()
    const location = useLocation()
    const {owner, repo, tab} = useParams()
    const {startStopProgressBar, getCachedData, addCachedData} = useContext(AppContext)

    const url = `https:/api.github.com/repos/${owner}/${repo}`
    const languagesUrl = `https:/api.github.com/repos/${owner}/${repo}/languages`
    const contributorsUrl = `https:/api.github.com/repos/${owner}/${repo}/contributors`
    const commitsUrl = `https:/api.github.com/repos/${owner}/${repo}/commits`
    // const codeUrl = `https:/api.github.com/repos/${owner}/${repo}/contents`
    // https://api.github.com/repos/rafii2000/PathFinding/branches


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
            setRepoData(cachedData.data.repoData)
            setLanguages(cachedData.data.langsData)
            return
        }

        startStopProgressBar('start')

        axios.all([
            axios.get(url),
            axios.get(languagesUrl), 
        ])
        .then(axios.spread((res1, res2) => {
            // Both requests are now complete
            addCachedData(noTabURL, {repoData: res1.data, langsData: res2.data})
            setRepoData(res1.data)
            setLanguages(res2.data)
            startStopProgressBar('stop')
        }))
        .catch(((err) => {
            startStopProgressBar('stop')
        }))

    }, [owner, repo, tab, url, languagesUrl, location, getCachedData, addCachedData, startStopProgressBar])



    const updateRoute = useCallback(
        (tab) => {
            setActiveTab(tab)  //previous state is remembered
            history.push(`/repo-details/${owner}/${repo}/${tab}`)
        },
        [owner, repo, history],
    )
      
    return(

        <>
        <ProgressBar></ProgressBar>

        {(repoData) &&
        
        <div className='repo_subpage'>

            <div className='subpage__brief_column'>

                <div className='brief_column__brief_section'>
                    <div className='brief_section__repo_name__repo_owner'>
                        <div className='repo_name'> <GoRepo/>{repoData.name}</div>
                        <div className='repo_owner'>
                            <div className='repo_owner__img'>
                                <img src={repoData.owner.avatar_url} alt=''></img>
                            </div>
                                <div className='repo_owner__login'>
                                    <Link to={`/user-details/${repoData.owner.login}`}>
                                        {repoData.owner.login}
                                    </Link>
                                </div>
                        </div>
                    </div>
                </div>
                
                <div className='brief_column__brief_section'>
                    <div className='brief_section__name'>About</div>
                    <div className='brief_section__about_repo'>
                        
                        <div className='about_repo__description'>
                            {repoData.description}
                        </div>

                        <div className='brief_section__details'>

                            <div className='brief_section__detail'> {repoData.location && <> <IoLocationOutline/> {repoData.location} </>}</div>
                            <div className='brief_section__detail'> {repoData.company && <> <BsBuilding/> {repoData.company} </>}</div>
                            <div className='brief_section__detail'> {repoData.email && <> <AiOutlineMail/> {repoData.email} </>}</div>


                            <div className='brief_section__detail'>
                                {(repoData.fork) ?
                                    <> <BiGitRepoForked/> {`Forked from: ${repoData.parent.full_name}`} </>
                                :
                                    <> <BiGitRepoForked/> {'No forked - owner'} </>
                                }
                            </div>

                            <div className='brief_section__detail'>
                                {(repoData.parent && repoData.parent.license) ?
                                    <> <RiScales3Line/> {repoData.parent.license.spdx_id + ' Licence'} </>
                                :
                                repoData.license ?
                                    <> <RiScales3Line/> {repoData.license.spdx_id + ' Licence'} </>
                                :
                                    <></>
                                }
                            </div>
                            
                            {/* links */}
                            <div className='brief_section__detail'>
                                {repoData.homepage && 
                                <a href={repoData.homepage} target='_blank' rel='noreferrer'>
                                    <AiOutlineHome/>
                                    <span>{repoData.homepage}</span>
                                </a> }
                            </div>

                            <div className='brief_section__detail'>
                                {repoData.html_url && 
                                <a href={`${repoData.html_url}`} target='_blank' rel='noreferrer'>
                                    <FaGithub/> See on GitHub
                                </a> }
                            </div>

                        </div>
                        
                    </div>

                </div>
                            
                <div className='brief_column__brief_section'>
                    <div className='brief_section__name'>Languages</div>
                    <div className='brief_section__programing_languages'>
                        {languages && 
                            <Languages langObj={languages}></Languages>
                        }
                    </div>
                </div>

                <div className='brief_column__brief_section'>
                    <div className='brief_section__name'>Sponsors</div>
                    <div className='brief_section__achievements'></div>
                </div>

                <div className='brief_column__brief_section'>
                    <div className='brief_section__name'>Used by</div>
                    <div className='brief_section__achievements'></div>
                </div>

            </div>


            <div className='subpage__content_column'>
            
                <div className='content_column__nav_bar'>
                    <div className='nav_bar__label--disabled'>Code</div>
                    <div className={activeTab === 'contributors' ? 'nav_bar__label--active' : 'nav_bar__label'} onClick={() => updateRoute('contributors')}>Contributors</div>
                    <div className={activeTab === 'commits' ? 'nav_bar__label--active' : 'nav_bar__label'} onClick={() => updateRoute('commits')}>Commits</div>
                </div>

                <div className='content_column__content'>
                    {activeTab === 'contributors' ? <Contributors url={contributorsUrl}></Contributors> : ''}
                    {activeTab === 'commits' ? <Commits url={commitsUrl}></Commits> : ''}
                </div>
            </div>
            
        </div>
        }
        </>
    )
}


const Languages = ({langObj}) => {
    
    let langs = []
    let total = 0

    for(const [name, chars] of Object.entries(langObj)){
        langs.push([name, chars])
        total += chars

        if(langs.length === 10) break
    }

    return(
        langs.map((lang, id) => 
            <Language key={id} color={'#39AF46'} name={lang[0]} percentage={((lang[1]/total) * 100).toFixed(2)} ></Language>
        )
    )
}

const Language = ({name, color, percentage}) => {

    return(

        <div className='programing_language'>
            <div className='programing_language__color_label' style={{backgroundColor: color}}></div>
            <div className='programing_language__name'>{name}</div>
            <div className='programing_language__percentage'>{percentage+'%'}</div>
        </div>
    )

}



const Contributors = ({url}) => {

    const [contributors, setContributors] = useState()

    const location = useLocation()
    const {getCachedData, addCachedData} = useContext(AppContext)

    useEffect(() => {

        let cachedData = getCachedData(location.pathname)
        if(cachedData){
            setContributors(cachedData.data)
            return
        }

        axios.get(url)
        .then((res) => {
            setContributors(res.data)
            addCachedData(location.pathname, res.data)
        })
        .catch((err) => {

        })

    }, [url, getCachedData, addCachedData, location])

    return(
        
        <div className='contributors_tab'>
       
        {contributors && contributors.map((item, id) => 
            <Contributor
                key={id}
                imgUrl={item.avatar_url }
                login={item.login}
                contributions={item.contributions}
            ></Contributor>
            )
        }
        </div>
    )
}


const Commits = ({url}) => {
    
    const [commits, setCommits] = useState()    

    const location = useLocation()
    const {getCachedData, addCachedData} = useContext(AppContext)


    useEffect(() => {

        let cachedData = getCachedData(location.pathname)
        if(cachedData){
            setCommits(cachedData.data)
            return
        }

        axios.get(url)
        .then((res) => {
            setCommits(res.data)
            addCachedData(location.pathname, res.data)
        })
        .catch((err) => {

        })

    }, [url, getCachedData, addCachedData, location])

    
    return(
        <div className='commits_tab'>
        
            {commits && commits.map((commit, id) => 
                <Commit
                    key={id}
                    commitJSON={commit}
                ></Commit>
            )}

        </div>
    )
}

