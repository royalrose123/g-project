import React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import Loadable from 'react-loadable'

const loading = () => null
const Home = Loadable({ loader: () => import('./js/views/Home'), loading })
const Chart = Loadable({ loader: () => import('./js/views/Chart'), loading })

function App (props) {
  return (
    <Switch>
      <Route strict sensitive path='/home' component={Home} />
      <Route strict sensitive path='/chart' component={Chart} />
      <Redirect push from='/' to='/home' />
    </Switch>
  )
}

export default hot(module)(withRouter(App))
