import React, { Component } from 'react'
import { Switch, Router } from 'react-router-dom'
import { routes, RouteWithSubRoutes } from './infrastructure/router'
import { history } from './infrastructure/navigation'

export default class App extends Component<{}, {}> {
    render() {
        return (
            <div id="app">
                <div id="page">
                    <Router history={history}>
                        <Switch>{routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}</Switch>
                    </Router>
                </div>
            </div>
        )
    }
}