import React from 'react'
import PropTypes from 'prop-types'

function DefaultLoadingComponent () {
  return <div>Loading</div>
}

function withLoading (Component) {
  const withLoadingComponent = ({ isFetching, isLoaded, loadingComponent: LoadingComponent, ...props }) => {
    if (isFetching || !isLoaded) {
      return typeof LoadingComponent === 'undefined' ? <DefaultLoadingComponent /> : <LoadingComponent />
    } else {
      return <Component {...props} />
    }
  }

  withLoadingComponent.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    LoadingComponent: PropTypes.node,
  }

  return withLoadingComponent
}

export default withLoading
