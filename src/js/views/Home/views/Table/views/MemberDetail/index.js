import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Button from '../../../../../../components/Button'
import Layout from '../../../../components/Layout'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  member: PropTypes.object,
}

function MemberDetail (props) {
  const { member } = props

  console.log('MemberDetail member :', member)

  return (
    <Layout className={cx('home-table-member-detail')}>
      <Layout.Header>
        <div>Clock-out / Details</div>
        <Button type='button'>Clock-Out</Button>
      </Layout.Header>
      <Layout.Content>123</Layout.Content>
    </Layout>
  )
}

MemberDetail.propTypes = propTypes

export default MemberDetail
