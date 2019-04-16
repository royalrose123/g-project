import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'
import classnames from 'classnames/bind'

// Components
import Clock from './components/Clock'
import Layout from './components/Layout'
import Menu from './components/Menu'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const loading = () => null
const Camera = Loadable({ loader: () => import('./views/Camera'), loading })
const Settings = Loadable({ loader: () => import('./views/Settings'), loading })
const Table = Loadable({ loader: () => import('./views/Table'), loading })

const navigations = [
  { path: 'table', name: 'Table', component: Table },
  { path: 'camera', name: 'Camera', component: Camera },
  { path: 'settings', name: 'Settings', component: Settings },
]

const defaultNavigation = navigations[0]

export const propTypes = {
  match: PropTypes.object,
}

function Home (props) {
  const { match } = props

  return (
    <Layout className={cx('home')}>
      <Layout.Header>
        <Clock />
        <Menu>
          {navigations.map(({ path, name }, index) => (
            <Menu.Item key={index}>
              <Menu.Link to={`${match.url}/${path}`}>{name}</Menu.Link>
            </Menu.Item>
          ))}
        </Menu>
      </Layout.Header>
      <Layout.Content>
        <Switch>
          {navigations.map(({ path, name, component }, index) => (
            <Route key={index} strict sensitive path={`${match.url}/${path}`} component={component} />
          ))}
          <Redirect push from={match.url} to={`${match.url}/${defaultNavigation.path}`} />
        </Switch>
      </Layout.Content>
    </Layout>
  )
}

Home.propTypes = propTypes

export default Home
