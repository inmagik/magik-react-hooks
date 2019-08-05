import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import TestComponent from './TestComponent'
import SingleTestComponent from './SingleTestComponent';

const App = () => {

  return (
    <Router>
      <Route component={TestComponent} />
      <Route component={SingleTestComponent} />
    </Router>
  )
}

export default App