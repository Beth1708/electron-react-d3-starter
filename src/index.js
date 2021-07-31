import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SecondWindow from './pages/SecondWindow';
import {BrowserRouter, HashRouter, Route, Switch} from "react-router-dom";

const devRouter = (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route exact path = "/Second" component = {SecondWindow} />
        </Switch>
    </BrowserRouter>
);

const prodRouter = (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route exact path = "/Second" component = {SecondWindow} />
        </Switch>
    </HashRouter>
);

const rootNode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
    devRouter : prodRouter;

ReactDOM.render(
  <React.StrictMode>
      {rootNode}
  </React.StrictMode>,
  document.getElementById('root')
);

