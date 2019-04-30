import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class PriceStrategy extends Component {
  static propTypes = {
  }

  render() {
    console.log('routes: ', this.props.route)
    return (
      <div>
        Price Strategy
      </div>
    )
  }
}
