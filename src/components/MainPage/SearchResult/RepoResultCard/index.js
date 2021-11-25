import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import {BsStar} from 'react-icons/bs'
import {BiGitRepoForked} from 'react-icons/bi'
import {FaGithub} from 'react-icons/fa'

import Commit from '../../../Layout/Commit'
import Contributor from '../../../Layout/Contributor'
import '../ResultCard/style.css'
import './style.css'


export default function RepoResultCard({item, id}) {

    const [showContributors, setShowContributors] = useState(false)
    const [showCommits, setShowCommits] = useState(false)
    const [contributorsData, setContributorsData] = useState(null)
    const [commitsData, setCommitsData] = useState(null)

    return (
        
        <div className='repo_result_card'>

            <div className='repo_basic_info'>

                <div className='result_card__result_number'>{id}</div>

                <div className='result_card__informations'>
                    <div className='result_card__primary_link'>
                        <a href={item.html_url} target='_blank' rel='noreferrer'>
                            <FaGithub/> {item.full_name}
                        </a>
                    </div>
                    <div className='result_card__description'><em>{item.description}</em></div>
                    
                    <div className='result_card__sort_parameters'>
                        <div className='result_card__sort_parameter'><BsStar/> {item.stargazers_count}</div>
                        <div className='result_card__sort_parameter'><BiGitRepoForked/> {item.forks_count}</div>
                        <div className='result_card__sort_parameter'>Updated: {new Date(item.updated_at).toLocaleString()}</div>
                    </div>
                    
                </div>

                <div className='result_card__menu'>
                    <div className={showContributors ? "result_card__menu__button--active" : "result_card__menu__button"} onClick={() => setShowContributors(!showContributors)}>
                        Contributors
                    </div>

                    <div className={showCommits ? "result_card__menu__button--active" : "result_card__menu__button"} onClick={() => setShowCommits(!showCommits)}>
                        Commits
                    </div>

                    <Link to={`/repo-details/${item.full_name}/contributors`}>
                        <div className="result_card__menu__button">Subpage</div>
                    </Link>
                    
                </div>

            </div>


            <div className='repo_extra_info'>
                {showCommits &&
                    <Commits
                        url={item.commits_url}
                        data={commitsData}
                        setCommits={setCommitsData}
                    ></Commits>
                }

                {showCommits && <div className='repo_extra_info__button' onClick={() => setShowCommits(false)}>Hide commits</div>}
                
                {showCommits && showContributors &&  <div style={{borderTop: '1px solid #DDD', margin: '25px 0px'}}></div>}
                
                {showContributors &&
                    <Contributors
                        url={item.contributors_url}
                        data={contributorsData}
                        setContributors={setContributorsData}
                    ></Contributors>
                }
                
                {showContributors && <div className='repo_extra_info__button' onClick={() => setShowContributors(false)}>Hide contributors</div>}
            </div>
   
        </div>

        
    )
}



const Contributors = ({url, data, setContributors}) => {

    useEffect(() => {
        
        if(data) return

        axios.get(url)
        .then((res) => {
            setContributors(res.data) 
        })
        .catch((err) => {
        })

    }, [url, data, setContributors])
    
    return(
        
        <div className='repo_contributors'>
       
        {data && data.map((item, id) => 
            <Contributor
                key={id}
                imgUrl={item.avatar_url }
                login={item.login}
                contributions={item.contributions}>
            </Contributor>
            )
        }
        </div>
    )

}

const Commits = ({url, data, setCommits}) => {

    useEffect(() => {

        if(data) return

        axios.get(url.replace('{/sha}', ''))
        .then((res) => {
            setCommits(res.data)
        })
        .catch((err) => {
        })
    }, [url, data, setCommits])

    return(

        <div className='repo_commits'>
            {data && data.map((commit, id) =>
                <Commit
                    key={id}
                    commitJSON={commit}>
                </Commit>
            )}
        </div>

    )
}
