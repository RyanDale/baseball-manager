import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import {createBrowserHistory} from 'history'
import mixpanel from 'mixpanel-browser';

import './App.css';

import NavBar from './components/NavBar';

class App extends Component {
  componentWillMount() {
    const history = createBrowserHistory();
    const trackPageView = location => {
      const uri = `${location.pathname}${location.search}${location.hash}`;
      const pageName = location.hash.split('/')[1] || 'home';
      mixpanel.track('Page View', {
        uri,
        'Page Name': pageName
      });
    };

    // TODO: Pull this token from an env variable
    mixpanel.init('1');

    history.listen(trackPageView);

    trackPageView(history.location);
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" 
            rel="stylesheet"></link>
          <header className="App-header">
            <NavBar></NavBar>
          </header>
        </div>
      </Provider>
    );
  }
}

export default App;
