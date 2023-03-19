import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import './index.css'
import App from './App'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
)
