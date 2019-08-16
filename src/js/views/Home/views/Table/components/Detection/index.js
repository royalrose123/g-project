import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'
import { BigNumber } from 'bignumber.js'
import { from, timer } from 'rxjs'
import { flatMap } from 'rxjs/operators'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'

// Modules
import { selectors as tableSelectors } from '../../../../../../lib/redux/modules/table'

// Lib MISC
import DeviceApi from '../../../../../../lib/api/Device'
import { selectors as seatedSelectors } from '../../../../../../lib/redux/modules/seated'
import { selectors as standingSelectors } from '../../../../../../lib/redux/modules/standing'
import getPersonByType from '../../../../../../lib/helpers/get-person-by-type'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  tableNumber: PropTypes.string,
  isPlaceSelected: PropTypes.bool,
  onItemActionClick: PropTypes.func,
}

function Detection (props) {
  const { seatedList, standingList, tableNumber, isPlaceSelected, onItemActionClick } = props
  const [detectionList, setDetectionList] = useState([])
  // polling

  useEffect(() => {
    const timerSecond = 2
    const fetchDataObservable = timer(0, 1000 * timerSecond).pipe(flatMap(index => from(DeviceApi.fetchDetectionList({ tableNumber }))))
    const fetchDataSubscription = fetchDataObservable.subscribe(response => {
      setDetectionList(response.sort((a, b) => new BigNumber(a.rect[0]).comparedTo(b.rect[0])))
    })
    return () => {
      fetchDataSubscription.unsubscribe()
    }
  }, [tableNumber])

  const itemWidth = Number(document.documentElement.style.getPropertyValue('--person-width').replace(/\D/gi, ''))
  const itemSpacing = 40
  const itemBorder = 6
  const slideWidth = `${itemWidth + itemSpacing * 2}px`
  const slideSpacing = -itemSpacing
  return (
    <div className={cx('home-table-detection')}>
      {detectionList.length > 0 && (
        <Carousel
          autoGenerateStyleTag={false}
          withoutControls
          initialSlideHeight={530}
          edgeEasing='easeBackOut'
          slidesToScroll='auto'
          slideWidth={slideWidth}
          cellSpacing={slideSpacing}
          speed={800}
        >
          {detectionList.map((detectionItem, index) => {
            const person = getPersonByType(detectionItem.type, detectionItem)
            if (seatedList.find(seatedItem => seatedItem && seatedItem.id === person.id)) return null
            if (standingList.find(seatedItem => seatedItem && seatedItem.id === person.id)) return null
            return (
              <div
                key={index}
                style={{ padding: `${itemBorder}px ${itemSpacing}px`, outline: 0 }}
                onClick={isPlaceSelected ? event => onItemActionClick(event, detectionItem) : null}
              >
                <Person
                  title='level'
                  type={detectionItem.type}
                  person={person}
                  renderFooter={() => (
                    <Button isBlock disabled={!isPlaceSelected} onClick={event => onItemActionClick(event, detectionItem)}>
                      Clock-In
                    </Button>
                  )}
                />
              </div>
            )
          })}
        </Carousel>
      )}
    </div>
  )
}

Detection.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
    tableNumber: tableSelectors.getTableNumber(state, props),
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detection)
