import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'
import classnames from 'classnames/bind'
import { findIndex, isEmpty } from 'lodash'

// Components
import Svg from '../../components/Svg'
import Clock from './components/Clock'
import Layout from './components/Layout'
import Menu from './components/Menu'

// Modules
import { operations as tableOperations, selectors as tableSelectors } from '../../lib/redux/modules/table'
import { operations as seatedOperations, selectors as seatedSelectors } from '../../lib/redux/modules/seated'
import { operations as standingOperations, selectors as standingSelectors } from '..//../lib/redux/modules/standing'
import { operations as settingOperations, selectors as settingSelectors } from '..//../lib/redux/modules/setting'

// Lib MISC
import SettingsApi from '../../lib/api/Setting'
import findStaticPath from '../../lib/utils/find-static-path'
import { getSessionStorageItem } from '../../lib/helpers/sessionStorage'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const loading = () => null
const Camera = Loadable({ loader: () => import('./views/Camera'), loading })
const Settings = Loadable({ loader: () => import('./views/Settings'), loading })
const Table = Loadable({ loader: () => import('./views/Table'), loading })

const navigations = [
  {
    path: ['table', 'table/:type/:memberId'],
    name: 'Table',
    icon: {
      data:
        'M49.6 0c9.762 0 17.704 8.075 17.704 18S59.362 36 49.6 36H17.705C7.942 36 0 27.925 0 18S7.942 0 17.705 0h5.498c2.355 0 4.594.657 6.476 1.9a7.19 7.19 0 0 0 3.973 1.193A7.19 7.19 0 0 0 37.625 1.9C39.507.657 41.746 0 44.101 0h5.498zm0 33.995c8.675 0 15.733-7.175 15.733-15.995S58.275 2.005 49.599 2.005h-5.498c-1.972 0-3.84.545-5.401 1.576a9.133 9.133 0 0 1-5.048 1.517c-1.799 0-3.544-.525-5.047-1.517-1.562-1.031-3.43-1.576-5.401-1.576h-5.499C9.03 2.005 1.972 9.18 1.972 18S9.03 33.995 17.705 33.995h31.894zM48.333 4c7.517 0 13.632 6.28 13.632 14S55.85 32 48.334 32H18.631C11.115 32 5 25.72 5 18S11.115 4 18.631 4h5.173c1.824 0 3.56 1.32 5.018 2.294.72.48 3.375.885 4.66.885 1.287 0 3.942-.405 4.661-.885C39.603 5.321 41.338 4 43.162 4h5.172zm-5.566 1.931l-.113.002 1.489 6.504 3.91.002c1.32 0 2.538.454 3.517 1.216l3.636-5.231a11.652 11.652 0 0 0-7.199-2.493h-5.24zM25.758 7l-1.853 7.538-5.35.003c-2.15 0-3.9 1.673-3.9 3.73 0 2.056 1.75 3.729 3.9 3.729H48.41c2.15 0 3.9-1.673 3.9-3.73 0-2.056-1.75-3.729-3.9-3.729l-5.35-.003L41.207 7a7.197 7.197 0 0 0-2.033.857c-1.279.794-4.545 1.115-5.691 1.115-1.147 0-4.413-.321-5.69-1.115A7.198 7.198 0 0 0 25.757 7zm-7.766-1.069c-2.703 0-5.198.93-7.199 2.493l3.636 5.231a5.704 5.704 0 0 1 3.518-1.216l3.909-.002 1.489-6.504-.113-.002h-5.24zM6.93 18.011c0 2.717.88 5.224 2.36 7.23l4.3-3.89a5.964 5.964 0 0 1-.855-3.088c0-1.202.352-2.32.954-3.25l-3.587-5.22A12.12 12.12 0 0 0 6.93 18.01zm13.517 11.934V23.75h-2.43a5.645 5.645 0 0 1-3.713-1.406l-4.477 4.121c2.147 2.155 5.047 3.479 8.234 3.479h2.386zm11.586.124v-5.793H22.38v5.793h9.655zm11.587 0v-5.793h-9.655v5.793h9.655zm4.317-.124c3.187 0 6.087-1.324 8.234-3.479l-4.477-4.121a5.645 5.645 0 0 1-3.712 1.406h-2.431v6.194h2.386zm9.736-4.704a12.153 12.153 0 0 0 2.36-7.23 12.12 12.12 0 0 0-3.171-8.218l-3.587 5.22c.602.93.953 2.048.953 3.25a5.963 5.963 0 0 1-.854 3.088l4.3 3.89z',
      width: 68,
      height: 36,
    },
    component: Table,
  },
  {
    path: 'camera',
    name: 'Camera',
    icon: {
      data:
        'M0 9.29C0 6.9 1.926 4.947 4.297 4.947H10.3l.143-.634C11.032 1.771 13.244 0 15.82 0h5.354c2.583 0 4.795 1.771 5.376 4.313l.144.634h6.01C35.074 4.947 37 6.893 37 9.29v16.504c0 2.52-2.024 4.565-4.516 4.565H4.516C2.024 30.359 0 28.313 0 25.794V9.29zm11.04-2.473H4.297c-1.352 0-2.447 1.107-2.447 2.473v16.504c0 1.489 1.193 2.695 2.666 2.695h27.96c1.473 0 2.666-1.206 2.666-2.695V9.29c0-1.366-1.094-2.473-2.446-2.473h-6.743a.93.93 0 0 1-.899-.725l-.31-1.36c-.392-1.686-1.857-2.862-3.57-2.862h-5.355c-1.714 0-3.179 1.176-3.571 2.863l-.31 1.359a.923.923 0 0 1-.898.725zM6.26 12.06c-.684 0-1.239-.56-1.239-1.252 0-.691.555-1.252 1.239-1.252s1.238.56 1.238 1.252-.554 1.252-1.238 1.252zM18.5 25.557c-4.281 0-7.77-3.519-7.77-7.855s3.489-7.855 7.77-7.855 7.77 3.527 7.77 7.855c0 4.329-3.489 7.855-7.77 7.855zm0-13.84c-3.262 0-5.92 2.688-5.92 5.985 0 3.298 2.658 5.985 5.92 5.985s5.92-2.687 5.92-5.985c0-3.297-2.658-5.984-5.92-5.984z',
      width: 37,
      height: 31,
    },
    component: Camera,
  },
  {
    path: 'settings',
    name: 'Settings',
    icon: {
      data:
        'M34.395 14.524c.915.136 1.605.94 1.605 1.867v3.218c0 .928-.69 1.73-1.605 1.867-.677.102-1.372.199-2.066.29a.205.205 0 0 0-.173.145 14.614 14.614 0 0 1-1.38 3.332c-.04.07-.033.159.018.226.427.555.85 1.115 1.257 1.666.55.744.47 1.799-.185 2.455l-2.276 2.276a1.898 1.898 0 0 1-2.455.185c-.55-.406-1.11-.83-1.666-1.257a.206.206 0 0 0-.226-.019 14.618 14.618 0 0 1-3.332 1.38.204.204 0 0 0-.146.174c-.09.694-.187 1.39-.289 2.066A1.898 1.898 0 0 1 19.61 36h-3.218c-.928 0-1.73-.69-1.867-1.605-.102-.676-.199-1.37-.29-2.065a.204.204 0 0 0-.145-.174 14.614 14.614 0 0 1-3.332-1.38.205.205 0 0 0-.226.019c-.556.427-1.116.85-1.666 1.257-.744.55-1.8.47-2.455-.186L4.134 29.59a1.898 1.898 0 0 1-.185-2.455c.407-.55.83-1.11 1.256-1.666a.205.205 0 0 0 .02-.226 14.613 14.613 0 0 1-1.381-3.332.204.204 0 0 0-.173-.145c-.694-.09-1.389-.188-2.066-.29A1.898 1.898 0 0 1 0 19.61v-3.218c0-.928.69-1.73 1.605-1.867.677-.102 1.372-.199 2.066-.29a.204.204 0 0 0 .173-.145c.32-1.161.785-2.282 1.38-3.332a.205.205 0 0 0-.018-.226c-.426-.554-.85-1.114-1.257-1.666-.55-.744-.47-1.799.185-2.455L6.41 4.134a1.898 1.898 0 0 1 2.455-.185c.55.406 1.11.829 1.666 1.256.067.052.156.06.226.02a14.616 14.616 0 0 1 3.332-1.381.204.204 0 0 0 .146-.173c.09-.695.188-1.39.289-2.066A1.897 1.897 0 0 1 16.39 0h3.218c.928 0 1.73.69 1.867 1.605.102.676.199 1.37.29 2.065a.204.204 0 0 0 .145.174c1.161.32 2.283.785 3.332 1.38.07.04.16.033.226-.019.556-.427 1.116-.85 1.666-1.256.744-.55 1.8-.47 2.455.185l2.276 2.276c.656.656.736 1.711.185 2.455-.407.55-.83 1.111-1.256 1.666a.205.205 0 0 0-.02.226c.596 1.05 1.06 2.17 1.381 3.332.021.078.09.135.173.145.694.09 1.39.188 2.066.29zm-.076 5.085v-3.218a.206.206 0 0 0-.172-.205c-.667-.1-1.352-.195-2.035-.284a1.882 1.882 0 0 1-1.576-1.366 12.933 12.933 0 0 0-1.222-2.948 1.883 1.883 0 0 1 .148-2.082c.42-.546.837-1.098 1.238-1.64a.206.206 0 0 0-.023-.267l-2.275-2.276a.206.206 0 0 0-.267-.023c-.541.4-1.093.817-1.64 1.238a1.883 1.883 0 0 1-2.082.149 12.937 12.937 0 0 0-2.949-1.222A1.882 1.882 0 0 1 20.1 3.888a109.39 109.39 0 0 0-.285-2.034.206.206 0 0 0-.205-.173h-3.218a.206.206 0 0 0-.205.173c-.1.665-.195 1.35-.284 2.034a1.882 1.882 0 0 1-1.366 1.577c-1.028.283-2.02.694-2.948 1.222a1.883 1.883 0 0 1-2.082-.149c-.548-.42-1.1-.837-1.64-1.238a.206.206 0 0 0-.267.023L5.323 7.599a.206.206 0 0 0-.023.267c.402.543.818 1.095 1.238 1.64.465.605.523 1.422.148 2.082-.527.929-.938 1.92-1.221 2.948a1.882 1.882 0 0 1-1.577 1.366c-.683.089-1.367.185-2.034.284a.206.206 0 0 0-.173.205v3.219c0 .102.074.19.173.204.667.1 1.351.196 2.034.285a1.882 1.882 0 0 1 1.577 1.365c.283 1.028.694 2.02 1.222 2.949.374.66.316 1.477-.15 2.082-.42.546-.836 1.098-1.237 1.64-.06.08-.05.195.023.267l2.276 2.276a.206.206 0 0 0 .266.022c.542-.4 1.093-.816 1.64-1.237a1.89 1.89 0 0 1 2.083-.15c.928.528 1.92.94 2.948 1.223.73.201 1.267.82 1.366 1.577.089.684.185 1.368.284 2.034a.206.206 0 0 0 .205.172h3.218c.102 0 .19-.074.205-.172.1-.667.195-1.35.284-2.035a1.882 1.882 0 0 1 1.366-1.576 12.936 12.936 0 0 0 2.948-1.222 1.882 1.882 0 0 1 2.082.148c.548.421 1.1.838 1.64 1.238.08.06.195.05.267-.022l2.276-2.276a.206.206 0 0 0 .023-.267c-.401-.542-.818-1.094-1.238-1.64a1.883 1.883 0 0 1-.148-2.082c.527-.929.938-1.921 1.221-2.949a1.882 1.882 0 0 1 1.577-1.365c.683-.09 1.368-.185 2.034-.285a.206.206 0 0 0 .173-.205zM18 10.186c4.309 0 7.814 3.505 7.814 7.814S22.31 25.814 18 25.814 10.186 22.31 10.186 18 13.69 10.186 18 10.186zm0 13.947A6.14 6.14 0 0 0 24.133 18 6.14 6.14 0 0 0 18 11.867 6.14 6.14 0 0 0 11.867 18 6.14 6.14 0 0 0 18 24.133z',
      size: 36,
    },
    component: Settings,
  },
]

const defaultNavigation = navigations[0]

export const propTypes = {
  match: PropTypes.object,
  tableNumber: PropTypes.string,
  initTableNumber: PropTypes.func,
  clockState: PropTypes.string,
  initClockState: PropTypes.func,
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  initSeatedList: PropTypes.func,
  initStandingList: PropTypes.func,
  settingData: PropTypes.object,
  initSettingData: PropTypes.func,
}

function Home (props) {
  const {
    match,
    tableNumber,
    initTableNumber,
    clockState,
    initClockState,
    seatedList,
    initSeatedList,
    standingList,
    initStandingList,
    settingData,
    initSettingData,
  } = props

  // active current table when Home didmount
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!isFirstRender.current) {
      SettingsApi.activeTable({ tableNumber })
    } else {
      isFirstRender.current = false
    }
  }, [tableNumber])

  // deactiveTable current table when window unload
  useEffect(() => {
    function closeTable (event) {
      SettingsApi.deactiveTable({ tableNumber })
    }

    window.addEventListener('unload', closeTable)

    return () => {
      window.removeEventListener('unload', closeTable)
    }
  }, [tableNumber])

  // For Refresh - initial tableNumber
  const sessionStorageTableNumber = getSessionStorageItem('tableNumber')

  useEffect(() => {
    if (sessionStorageTableNumber && tableNumber === 'Please select table') initTableNumber(sessionStorageTableNumber)
  }, [initTableNumber, sessionStorageTableNumber, tableNumber])

  // For Refresh - initial clockState
  const sessionStorageClockState = getSessionStorageItem('clockState')

  useEffect(() => {
    if (sessionStorageClockState && clockState === 'manualClock') initClockState(sessionStorageClockState)
  }, [clockState, initClockState, sessionStorageClockState])

  // For Refresh - initial standingList
  const isStandingListEmpty = findIndex(standingList, item => item) === -1

  const sessionStorageStandingList = getSessionStorageItem('standingList')
  const isLocalStorageStandingListEmpty = findIndex(sessionStorageStandingList, item => item) === -1

  useEffect(() => {
    if (isStandingListEmpty && !isLocalStorageStandingListEmpty) initStandingList(sessionStorageStandingList)
  }, [initStandingList, isLocalStorageStandingListEmpty, isStandingListEmpty, sessionStorageStandingList])

  // For Refresh - initial seatedList
  const isSeatedListEmpty = findIndex(seatedList, item => item) === -1

  const sessionStorageSeatedList = getSessionStorageItem('seatedList')
  const isLocalStorageSeatedListEmpty = findIndex(sessionStorageSeatedList, item => item) === -1

  useEffect(() => {
    if (isSeatedListEmpty && !isLocalStorageSeatedListEmpty) initSeatedList(sessionStorageSeatedList)
  }, [initSeatedList, isLocalStorageSeatedListEmpty, isSeatedListEmpty, sessionStorageSeatedList])

  // // For Refresh - initial settingData
  const sessionStorageSettingData = getSessionStorageItem('settingData')

  // 判斷 settingData 裡每個 key 的 value 有沒有值
  const isSettingDataEmpty =
    Object.entries(settingData)
      .map(([key, value]) => isEmpty(value))
      .indexOf(false) === -1

  useEffect(() => {
    if (sessionStorageSettingData && isSettingDataEmpty) {
      initSettingData(sessionStorageSettingData.systemSettings, sessionStorageSettingData.autoSettings, sessionStorageSettingData.defaultRecord)
    }
  }, [initSettingData, isSettingDataEmpty, sessionStorageSettingData])

  return (
    <Layout className={cx('home')}>
      <Layout.Header>
        <Clock />
        <Menu>
          {navigations.map(({ path, name, icon, component }, index) => (
            // TODO: 暫時做成按下 Dealer name 之後會 full screen，再按一次取消 full screen
            <Menu.Item key={index}>
              <Menu.Link to={`${match.url}/${findStaticPath(path)}`} disabled={component === null}>
                <Svg className={cx('home__menu-link-icon')} {...icon} />
                <span className={cx('home__menu-link-text')}>{name}</span>
              </Menu.Link>
            </Menu.Item>
          ))}
          <Menu.Item>
            <Menu.Account />
          </Menu.Item>
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

Home.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    tableNumber: tableSelectors.getTableNumber(state, props),
    clockState: tableSelectors.getClockState(state, props),
    clockOutPlayer: tableSelectors.getClockOutPlayer(state, props),
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
    settingData: settingSelectors.getSettingData(state, props),
  }
}

const mapDispatchToProps = {
  initTableNumber: tableOperations.initTableNumber,
  initClockState: tableOperations.initClockState,
  initStandingList: standingOperations.initStandingList,
  initSeatedList: seatedOperations.initSeatedList,
  initSettingData: settingOperations.initSettingData,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
