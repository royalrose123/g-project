import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Date from '../../components/Date'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  // prop: PropTypes.any,
}

export const defaultProps = {
  prop: 'prop',
}

function Cpu (props) {
  // const { prop } = props
  // const [state] = useState('state')

  // useEffect(() => {})

  return (
    <div className={cx('chart-cpu')}>
      CPU
      <Date defaultDate='2019/08/01' />
    </div>
  )
}

Cpu.propTypes = propTypes
Cpu.defaultProps = defaultProps

export default Cpu
