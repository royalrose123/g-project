import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'
// import { BigNumber } from 'bignumber.js'
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
  // const [detectionList, setDetectionList] = useState([])
  // polling
  const detectionList = [
    {
      background:
        'http://10.1.1.19:10090/photos/eyJidWNrZXRfbmFtZSI6InNlY3VyaXR5LXJlY28iLCJvYmplY3RfbmFtZSI6IjIwMTktOC0xNi8xNTY1OTM2MTc5LTE3ODkwLWltYWdlIn0=',
      dateTime: '2019-08-16T14:16:20+08:00',
      probableList: [
        {
          id: '',
          image:
            'http://10.1.1.19:10090/photos/eyJidWNrZXRfbmFtZSI6InNlY3VyaXR5LXJlY28iLCJvYmplY3RfbmFtZSI6IjIwMTktOC0xNi8xNTY1OTM2MTc5LTE3ODkwLWZhY2UifQ==',
          name: '20190815-Table-0812-33',
          similarity: 100,
          tempId: '20190815-Table-0812-33',
        },
      ],
      rect: [880, 496, 288, 288],
      snapshot:
        'http://10.1.1.19:10090/photos/eyJidWNrZXRfbmFtZSI6InNlY3VyaXR5LXJlY28iLCJvYmplY3RfbmFtZSI6IjIwMTktOC0xNi8xNTY1OTM2MTY0LTE3ODgxLWZhY2UifQ==',
      type: 'anonymous',
    },
    {
      background:
        'http://10.1.1.19:10090/photos/eyJidWNrZXRfbmFtZSI6InNlY3VyaXR5LXJlY28iLCJvYmplY3RfbmFtZSI6IjIwMTktOC0xNi8xNTY1OTM2MTc5LTE3ODkwLWltYWdlIn0=',
      dateTime: '2019-08-16T14:16:20+08:00',
      probableList: [
        {
          id: '8000853',
          image:
            'http://10.1.1.19:10090/photos/eyJidWNrZXRfbmFtZSI6InNlY3VyaXR5LXJlY28iLCJvYmplY3RfbmFtZSI6IjIwMTktOC0xNi8xNTY1OTM2MTc5LTE3ODkwLWZhY2UifQ==',
          level: 'green',
          name: '84',
          similarity: 100,
          tempId: '84',
        },
      ],
      rect: [870, 496, 288, 288],
      snapshot:
        'http://10.1.1.19:10090/photos/eyJidWNrZXRfbmFtZSI6InNlY3VyaXR5LXJlY28iLCJvYmplY3RfbmFtZSI6IjIwMTktOC0xNi8xNTY1OTM2MTY0LTE3ODgxLWZhY2UifQ==',
      type: 'member',
    },
  ]

  useEffect(() => {
    const timerSecond = 2
    const fetchDataObservable = timer(0, 1000 * timerSecond).pipe(flatMap(index => from(DeviceApi.fetchDetectionList({ tableNumber }))))
    const fetchDataSubscription = fetchDataObservable.subscribe(response => {
      // setDetectionList(response.sort((a, b) => new BigNumber(a.rect[0]).comparedTo(b.rect[0])))
    })
    return () => {
      fetchDataSubscription.unsubscribe()
    }
  }, [tableNumber])

  const itemWidth = Number(document.documentElement.style.getPropertyValue('--person-width').replace(/\D/gi, ''))
  const itemSpacing = 20
  const itemBorder = 30
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
