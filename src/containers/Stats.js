import React, { PropTypes } from 'react'
import { routeActions } from 'react-router-redux'
import { connect } from 'react-redux'
import isBlank from 'is-blank'

import _ from 'lodash'
import { Flex, Box } from 'reflexbox'
import { Stat } from 'rebass'
import { VictoryBar, VictoryStack, VictoryPie } from 'victory'

import FontFamilyBlock from '../components/FontFamilyBlock'
import FontColorBlock from '../components/FontColorBlock'
import FontSizeBlock from '../components/FontSizeBlock'
import BgColorBlock from '../components/BgColorBlock'

import { fetchUrlIfNeeded } from '../store/reducers/urls'

const Stats = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
    fetchUrlIfNeeded: PropTypes.func.isRequired,
    url: PropTypes.object
  },

  contextTypes: {
    router: PropTypes.object
  },

  componentDidMount () {
    const { location: { query: { url } } } = this.props
    this.props.fetchUrlIfNeeded(url)
  },

  render () {
    const { location: { query: { url } } } = this.props
    const { url: { stats } } = this.props

    if (isBlank(stats)) { return <h1>Loading</h1> }

    const { url: { stats: { rules } } } = this.props
    const { url: { stats: { selectors } } } = this.props
    const { url: { stats: { declarations } } } = this.props
    const { url: { stats: { declarations: { properties } } } } = this.props
    const { url: { stats: { declarations: { properties: { color: colors } } } } } = this.props
    const { url: { stats: { declarations: { properties: { 'background-color': bgColors } } } } } = this.props
    const { url: { stats: { declarations: { properties: { 'font-size': fontSizes } } } } } = this.props
    const { url: { stats: { declarations: { properties: { 'font-family': fontFamilies } } } } } = this.props

    return (
      <div>
        <div className='cf w-100 bb bt b--light-gray pv3 ph2 ph4-ns'>
          <div className='fl w-60'>
            <h1 className='f2 mv0 truncate'>{url}</h1>
          </div>
          <div className='fl w-40 tr ttu tracked'>
            <h4 className='f3 mt2 mb0'>{stats.humanizedGzipSize}</h4>
          </div>
        </div>
        <div className='ph2 ph4-ns'>
          <div className='cf pv3 mt3'>
            <div className='fl w-50 w-25-ns'>
              <Stat label='Rules' value={rules.total} />
            </div>
            <div className='fl w-50 w-25-ns'>
              <Stat label='Selectors' value={selectors.total} />
            </div>
            <div className='fl w-50 w-25-ns'>
              <Stat label='Declarations' value={declarations.total} />
            </div>
            <div className='fl w-50 w-25-ns'>
              <Stat label='Properties' value={Object.keys(properties).length} />
            </div>
          </div>
          <div className='cf pv3'>
            <h3>Total Declarations</h3>
            <div className='fl w-33'>
              <Stat label='Font Size' value={(properties['font-size'] || []).length} topLabel />
            </div>
            <div className='fl w-33'>
              <Stat label='Float' value={(properties.float || []).length} topLabel />
            </div>
            <div className='fl w-33'>
              <Stat label='Width' value={(properties.width || []).length} topLabel />
            </div>
          </div>
          <div className='cf pt2'>
            <div className='fl w-33'>
              <Stat label='Height' value={(properties.height || []).length} topLabel />
            </div>
            <div className='fl w-33'>
              <Stat label='Color' value={(properties.color || []).length} topLabel />
            </div>
            <div className='fl w-33'>
              <Stat label='Background Color' value={(properties['background-color'] || []).length} topLabel />
            </div>
          </div>
          <div className='pv3'>
            <h3>Colors</h3>
            <Flex wrap>
              {colors.map((color, i) => (
                <Box col={2} p={2}>
                  <FontColorBlock color={color} key={i} />
                </Box>
              ))}
            </Flex>
          </div>
          <div className='pv3'>
            <h3>Background Colors</h3>
            <Flex wrap>
              {bgColors.map((color, i) => (
                <Box col={2} p={2} key={i}>
                  <BgColorBlock backgroundColor={color} />
                </Box>
              ))}
            </Flex>
          </div>
          <div className='pv3'>
            <h3>Font Sizes</h3>
            {fontSizes.map((size, i) => <FontSizeBlock fontSize={size} key={i} />)}
          </div>
          <div className='pv3'>
            <h3>Font Families</h3>
            {fontFamilies.map((family, i) => <FontFamilyBlock fontFamily={family} key={i} />)}
          </div>
          <h3>Total vs. Unique Declarations</h3>
          <div className='w-80 center ph3'>
            <VictoryStack horizontal height={150} offset={20} colorScale={'qualitative'} style={{ labels: { fontSize: 5 } }}>
              <VictoryBar data={[{ x: 1, y: properties.width.length }, { x: 2, y: _.uniq(properties.width).length }]} />
              <VictoryBar data={[{ x: 1, y: properties.height.length }, { x: 2, y: _.uniq(properties.height).length }]} />
              <VictoryBar data={[{ x: 1, y: properties.margin.length }, { x: 2, y: _.uniq(properties.margin).length }]} />
              <VictoryBar data={[{ x: 1, y: properties.padding.length }, { x: 2, y: _.uniq(properties.padding).length }]} />
              <VictoryBar data={[{ x: 1, y: properties.color.length }, { x: 2, y: _.uniq(properties.color).length }]} />
              <VictoryBar data={[{ x: 1, y: properties['background-color'].length, label: 'total' }, { x: 2, y: _.uniq(properties['background-color']).length, label: 'unique' }]} />
            </VictoryStack>
          </div>
          <h3>Specificity</h3>
          <VictoryBar width={1000} data={selectors.specificity.graph.map((y, i) => ({ x: i + 1, y }))} />
          <p className='gray f6 tc mv0'>
            Base 10 specificity score for each selector by source order.
            Generally, lower scores and flatter curves are better for maintainability.
            <a href='http://csswizardry.com/2014/10/the-specificity-graph/'>Learn More</a>
          </p>
          <h3>Ruleset Sizes</h3>
          <VictoryBar width={1000} data={rules.size.graph.map((y, i) => ({ x: i + 1, y }))} />
          <h3>Declarations</h3>
          <div className='w-60 center'>
            <VictoryPie
              innerRadius={100}
              style={{ labels: { fontSize: 5 } }}
              data={Object.keys(properties).map(prop => ({ x: prop, y: properties[prop].length }))} />
          </div>
        </div>
      </div>
    )
  }
})

const mapStateToProps = (state) => ({
  url: state.urls.get('url').toJS(),
  isFetching: state.urls.get('isFetching')
})

const mapDispatchToProps = (dispatch) => ({
  navigate: (route) => dispatch(routeActions.push(route)),
  fetchUrlIfNeeded: (urlId) => dispatch(fetchUrlIfNeeded(urlId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats)
