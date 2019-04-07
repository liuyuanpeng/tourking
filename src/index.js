import React from 'react'
import 'global/util/react-patch'
import { render, Router } from '@gem-mine/durex'
import { importAll } from 'global/util/sys'
import 'global/durex'
import 'global/request'
import 'global/routes'
import App from './App'

importAll(require.context('./global/model', true, /.+\.js$/))
importAll(require.context('./components', true, /model\.js$/))

render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)
