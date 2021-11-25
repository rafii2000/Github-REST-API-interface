import React from 'react'
import { useContext } from 'react'

import AppContext from '../../../context/AppContext'
import './style.css'



export default function ProgressBar(props) {
    
    const {progressBarState} = useContext(AppContext)
        
    const setStyles = () => {
        if(progressBarState === 'start')
            return {width: '100%', transition: 'width 5s'}

        if(progressBarState === 'stop')
            return {width: '0%', transition: 'width 0s'}
    }

    
    return (
        <div className='progress_bar_wrapper' style = {props ? {width: props.width || '100%', margin: props.margin || '0px'} : {width: '100%', margin: '0px'}}>
            <div className='progress_bar' style={setStyles()}></div>
        </div>
    )
}





