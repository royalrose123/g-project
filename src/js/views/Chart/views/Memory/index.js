import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { keys, remove } from 'lodash'

// Components
import Form from '../../components/Form'
import Modal from '../../../../components/Modal'
import ChartResult from '../../components/ChartResult'
import Button from '../../../../components/Button'

// Lib MISC
import ChartApi from '../../../../lib/api/Chart'
import { DatePicker } from 'antd'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  match: PropTypes.object,
}

function Memory (props) {
  const { match } = props
  const [chartDate, setChartDate] = useState('')
  const [chartData, setChartData] = useState([{}])
  const [modalErrorMessage, setModalErrorMessage] = useState('')
  const [isErrorModalOpend, setIsErrorModalOpend] = useState(false)
  const openErrorModal = () => setIsErrorModalOpend(true)
  const closeErrorModal = () => setIsErrorModalOpend(false)

  const { path } = match
  const chartType = path.split('/')[2]

  const dateFormat = 'YYYY/MM/DD'

  const onDateChange = (event, date, dateString) => {
    setChartDate(date.replace(/\//g, '')) // 將日期去掉斜線
  }

  const getChartData = async () => {
    if (!chartDate) {
      openErrorModal()
      setModalErrorMessage('Please select the date')
      return
    }

    await ChartApi.getChartDataByType({ chartDate, chartType })
      .then(result => {
        setChartData(result.payload)
      })
      .catch(error => {
        const isNoData = error.response.data.data === 'file not found'

        if (isNoData) {
          openErrorModal()
          setModalErrorMessage('There is no data for this date')
        }
      })
  }

  return (
    <div className={cx('chart-memory')}>
      <Modal className={cx('chart-error-modal')} isClosable={false} shouldCloseOnOverlayClick={false} isOpened={isErrorModalOpend}>
        <Modal.Header>
          <div className={cx('chart-error-modal__header')}>{'Search Chart Error'}</div>
        </Modal.Header>
        <Modal.Body>
          <div className={cx('chart-error-modal__body')}>{modalErrorMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' className={cx('chart-error-modal__action')} size={'md'} onClick={closeErrorModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Form.Group width={300}>
        <Form.Row>
          <Form.Column size='md'>
            <Form.Label>Please select date</Form.Label>
          </Form.Column>
          <Form.Column size='lg'>
            <DatePicker className={cx('chart-content-datepicker')} format={dateFormat} onChange={onDateChange} />
          </Form.Column>
          <Form.Column size='md'>
            <Button type='button' className={cx('chart-content__action')} size={'md'} onClick={getChartData}>
              {`${chartType} CHART`}
            </Button>
          </Form.Column>
        </Form.Row>
        <Form.Row />
      </Form.Group>
      {chartData.map((data, index) => (
        <ChartResult
          key={index}
          category={remove(keys(data), item => item !== 'time')}
          chartType={chartType}
          chartNumber={index}
          data={{
            xdata: data.time,
            ydata: {
              ...data,
            },
          }}
        />
      ))}
    </div>
  )
}

Memory.propTypes = propTypes

export default Memory
