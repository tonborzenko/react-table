import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Stats from 'pages/stats'
import Explore from 'pages/explore'

export default () => {
    return (
        <Switch>
            <Redirect exact from="/" to="/stats" />
            <Route path='/stats' component={Stats} />
            <Route path='/explore/:keyword' component={Explore} />
        </Switch>
    )
}