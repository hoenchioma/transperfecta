import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Dictionary from './pages/Dictionary';
import Home from './pages/Home';

const App: React.FC = (): JSX.Element => {
  return (
    <div
      className="App"
      style={{
        backgroundColor: '#282c34',
        color: 'white',
      }}>
      <BrowserRouter>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/dict" component={Dictionary} />
          <Redirect from="/" to="/home" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
