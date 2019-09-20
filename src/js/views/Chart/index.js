import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'
import classnames from 'classnames/bind'

// Components
// import Svg from '../../components/Svg'
import Clock from '../../components/Clock'
import Layout from '../../components/Layout'
import Menu from '../../components/Menu'

// Modules

// Lib MISC
import findStaticPath from '../../lib/utils/find-static-path'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const loading = () => null
const Cpu = Loadable({ loader: () => import('./views/Cpu'), loading })
const Gpu = Loadable({ loader: () => import('./views/Gpu'), loading })
const Memory = Loadable({ loader: () => import('./views/Memory'), loading })

const navigations = [
  {
    path: 'cpu',
    name: 'Cpu',
    component: Cpu,
  },
  {
    path: 'gpu',
    name: 'Gpu',
    component: Gpu,
  },
  {
    path: 'memory',
    name: 'Memory',
    component: Memory,
  },
]

const defaultNavigation = navigations[0]

export const propTypes = {
  match: PropTypes.object,
}

function Chart (props) {
  const { match } = props

  return (
    <Layout className={cx('chart')}>
      <Layout.Header>
        <Clock />
        <Menu>
          {navigations.map(({ path, name, icon, component }, index) => (
            // TODO: 暫時做成按下 Menu Icon 之後會 full screen，再按一次取消 full screen
            <Menu.Item key={index}>
              <Menu.Link to={`${match.url}/${findStaticPath(path)}`} disabled={component === null}>
                {/* <Svg className={cx('chart-link-icon')} {...icon} /> */}
                <span className={cx('chart-link-text')}>{name}</span>
              </Menu.Link>
            </Menu.Item>
          ))}
        </Menu>
      </Layout.Header>
      <Layout.Content>
        <Switch>
          {navigations.map(({ path, name, component }, index) => (
            <Route
              key={index}
              strict
              exact
              sensitive
              path={Array.isArray(path) ? path.map(p => `${match.url}/${p}`) : `${match.url}/${path}`}
              component={component}
            />
          ))}
          <Redirect push from={match.url} to={`${match.url}/${findStaticPath(defaultNavigation.path)}`} />
        </Switch>
      </Layout.Content>
    </Layout>
  )
}

Chart.propTypes = propTypes

export default Chart
