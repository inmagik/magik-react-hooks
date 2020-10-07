import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import TestComponent from './TestComponent'
import SingleTestComponent from './SingleTestComponent';
import TestDebounceComponent from './TestDebounceComponent'

const App = () => {

  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <>
            <TestComponent />
            <SingleTestComponent />
          </>
        </Route>
        <Route path='/debounce'>
          <TestDebounceComponent />
        </Route>
      </Switch>
    </Router>
  )
}

export default App