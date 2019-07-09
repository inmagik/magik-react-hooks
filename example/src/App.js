import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import TestComponent from './TestComponent'

const App = () => {

  return (
    <Router>
      <Route component={TestComponent} />
    </Router>
  )
}

export default App