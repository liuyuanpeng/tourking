import React from 'react'
import { smart, withRouter, Routes } from '@gem-mine/durex'
import 'styles/app'
import { Preload } from 'global/util/async-load'

const App = props => {
  return (
    <div className="main">
      <Routes />
      <Preload />
    </div>
  )
}

export default withRouter(
  smart(state => {
    return {}
  })(App)
)
