import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Seated from './components/Seated'
import Standing from './components/Standing'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Table (props) {
  return (
    <div className={cx('home-table')}>
      <div className={cx('home-table__row')}>
        <div className={cx('home-table__column')}>
          <Seated />
          <h2 className={cx('home-table__title')}>Seated</h2>
        </div>
        <div className={cx('home-table__column')}>
          <Standing />
          <h2 className={cx('home-table__title')}>Standing</h2>
        </div>
      </div>
      <div className={cx('home-table__row')}>slick</div>
    </div>
  )
}

Table.propTypes = propTypes

export default Table
