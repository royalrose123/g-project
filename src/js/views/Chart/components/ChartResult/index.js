import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { keys, remove } from 'lodash'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'

// Components

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  // prop: PropTypes.any,
  data: PropTypes.object,
  chartType: PropTypes.string,
  chartNumber: PropTypes.number,
}

function ChartResult (props) {
  const { data, chartType, chartNumber } = props
  const isFirstRender = useRef(true)

  const hasData = typeof data.xdata !== 'undefined'

  useEffect(() => {
    if (!isFirstRender.current && data) {
      // let chartName = `${chartType}Chart`
      let chartName = echarts.init(document.getElementById(`chart-view-${chartType}${chartNumber}`))

      // 初始化
      window.onresize = chartName.resize

      const yDataKeys = keys(data.ydata)
      remove(yDataKeys, key => {
        return key === 'time'
      })

      if (data.xdata) {
        // 绘制图表
        chartName.setOption({
          title: { text: 'Line Chart' }, // 設定名稱
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: keys(data.ydata), // 後端回傳的 key
          },
          grid: {
            top: '10%',
            right: '16%',
            bottom: '10%',
            left: '10%',
            containLabel: true,
          },
          toolbox: {
            show: true,
            feature: {
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: {
                show: true,
                type: 'jpg',
              },
            },
          },
          xAxis: [
            {
              type: 'category',
              data: data.xdata,
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: yDataKeys.map(item => {
            const seriesData = {
              name: item,
              type: 'line',
              data: data.ydata[item],
            }
            return seriesData
          }),
        })
      }
    } else {
      isFirstRender.current = false
    }
    return () => {}
  }, [data, chartType, chartNumber])

  return (
    <div className={cx('chart-view')}>
      <div id={`chart-view-${chartType}${chartNumber}`} style={{ width: '100%', height: 500, backgroundColor: '#fff', margin: '16px 0' }} />
      <p className={cx('chart-view__title')} data-is-invisible={hasData}>
        Select date to generate chart
      </p>
    </div>
  )
}

ChartResult.propTypes = propTypes

export default ChartResult
