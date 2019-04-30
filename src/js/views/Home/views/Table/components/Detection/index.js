import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'

// Lib MISC
import useFetcher from '../../../../../../lib/effects/useFetcher'
import DetectionApi from '../../../../../../lib/api/Detection'
import getPersonByType from '../../../../../../lib/helpers/get-person-by-type'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isPlaceSelected: PropTypes.bool,
  onItemActionClick: PropTypes.func,
}

function Detection (props) {
  const { isPlaceSelected, onItemActionClick } = props

  const { isLoaded, response: detectionList } = useFetcher(null, DetectionApi.fetchDetectionList)

  console.log('isLoaded :', isLoaded)
  console.log('detectionList :', detectionList)

  const itemWidth = Number(document.documentElement.style.getPropertyValue('--person-width').replace(/\D/gi, ''))
  const itemSpacing = 40
  const itemBorder = 6

  const slideWidth = `${itemWidth + itemSpacing * 2}px`
  const slideSpacing = -itemSpacing

  return (
    <div className={cx('home-table-detection')}>
      {isLoaded ? (
        <Carousel
          autoGenerateStyleTag={false}
          withoutControls
          heightMode='current'
          edgeEasing='easeBackOut'
          slidesToScroll='auto'
          slideWidth={slideWidth}
          cellSpacing={slideSpacing}
          speed={800}
        >
          {detectionList.map((detectionItem, index) => (
            <div key={index} style={{ padding: `${itemBorder}px ${itemSpacing}px` }}>
              <Person
                title='level'
                type={detectionItem.type}
                person={getPersonByType(detectionItem.type, detectionItem)}
                renderFooter={() => (
                  <Button isBlock disabled={!isPlaceSelected} onClick={event => onItemActionClick(event, detectionItem)}>
                    Clock-In
                  </Button>
                )}
              />
            </div>
          ))}
        </Carousel>
      ) : null}
    </div>
  )
}

Detection.propTypes = propTypes

export default Detection
