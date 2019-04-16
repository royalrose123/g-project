import React from 'react'
import PropTypes from 'prop-types'

function DefaultLoadingComponent () {
  return <div>Loading</div>
}

function withLoading (Component) {
  const wihLoadingComponent = ({ isFetching, isLoaded, LoadingComponent, ...props }) => {
    if (isFetching || !isLoaded) {
      return typeof LoadingComponent === 'undefined' ? <DefaultLoadingComponent /> : <LoadingComponent />
    } else {
      return <Component {...props} />
    }
  }

  wihLoadingComponent.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    LoadingComponent: PropTypes.node,
  }

  return wihLoadingComponent
}

export default withLoading
