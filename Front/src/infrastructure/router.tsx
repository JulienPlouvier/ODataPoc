import React from 'react'
import { Route } from 'react-router-dom'
import Repertoire from '../app/repertoire'

/*At leat one Route with exact: true*/
export const routes = [
    {
        path: '/',
        component: Repertoire,
        exact: true,
    },
]

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
export const RouteWithSubRoutes = route => {
    return (
        <Route
            path={route.path}
            render={props => <route.component {...props} routes={route.routes} />}
        />
    )
}
