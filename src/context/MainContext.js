import React, { createContext, useState, useEffect } from  'react'

import BaseAPI from '../api/BaseAPI'

const Context = createContext()

function MainProvider ({ children }) {
    const [authenticated, setAuthenticated] = useState(false)
    const [tokenStillValid, setTokenStillValid] = useState(false)
    const [loading, setLoading] = useState(true)
    const [accessToken, setAccessToken] = useState('')
    const [refreshToken, setRefreshToken] = useState('')


    async function verifyToken (token) {
        setLoading(true)
        await BaseAPI.post('usuarios/token/verify/', {
            "token": token
        })
        .then(() => {
            setTokenStillValid(true)
            setLoading(false)
        })
        .catch(() =>{ 
            setTokenStillValid(false)
            setLoading(false)
        })
    }

    async function resetToken (refreshToken) {
        setLoading(true)
        await BaseAPI.post('usuarios/token/refresh/', {
            "refresh": refreshToken
        })
        .then((response) => {
            const { data } = response
            setAccessToken(data.access)
            setTokenStillValid(true)
            setLoading(true)
            BaseAPI.defaults.Authorization = `Bearer ${accessToken}`
            setAuthenticated(true)
        })
        .catch(() => {
            setTokenStillValid(false)
            setLoading(true)
        })
    }

    // useEffect(() => {
    //     setAccessToken(JSON.parse(localStorage.getItem('access')))
    //     setRefreshToken(JSON.parse(localStorage.getItem('refresh')))

    //     if (accessToken) {
    //         verifyToken(accessToken)
    //         if (tokenStillValid) {
    //             BaseAPI.defaults.Authorization = `Bearer ${accessToken}`
    //             setAuthenticated(true)
    //         } else {
    //             resetToken(refreshToken)
    //         }
            
    //     } else {
    //         localStorage.setItem('authenticated', JSON.stringify(false))
    //     }



    //     setLoading(false)

    // }, [accessToken])


    return (
        <Context.Provider value={{ authenticated, loading, setAuthenticated }}>
            {children}
        </Context.Provider>
    )  
}

export {Context, MainProvider}