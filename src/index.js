import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import { initializeStore } from './js/lib/redux/store'
import { register } from './serviceWorker'
import App from './App'

import './styles/main.scss'

const store = initializeStore()
const render = () =>
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <AppContainer>
          <App />
        </AppContainer>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
register()
render()

if (module.hot) {
  module.hot.accept('./App', render)
}
