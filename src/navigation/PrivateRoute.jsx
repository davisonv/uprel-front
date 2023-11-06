import React from 'react'

import { Navigate } from 'react-router-dom'


function PrivateRoute({ children }) {
    
    const authenticated = JSON.parse(window.localStorage.getItem('authenticated'))

    if (!authenticated) {
        return (
            <>
                <Navigate to="/login" />
            </>
        )
    }

    return children
}

export {PrivateRoute}
export default PrivateRoute