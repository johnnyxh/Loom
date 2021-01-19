import { createStore, compose } from 'redux';

import reducers from '../reducers';

export default createStore(reducers, 
  compose(
    window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
  )
);