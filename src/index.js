// React
import React from 'react'
import ReactDOM from 'react-dom'
// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
// App Component
import App from './components/App.jsx'
// import UrlParamTest from './components/UrlParamTest.jsx'

ReactDOM.render(
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
)