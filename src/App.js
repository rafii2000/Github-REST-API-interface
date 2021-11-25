import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext'

import MainPage from './components/MainPage';
import RepoDetails from './components/RepoDetailsSubpage';
import UserDetails from './components/UserDetailsSubpage';

import './App.css';

function App() {
  return (
      <AppContextProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={MainPage}></Route>
            <Route exact path='/:scope/:phrase/:order/:sort/:page/:perpage' component={MainPage}></Route>
            <Route path='/user-details/:username/:tab?' component={UserDetails}></Route>
            <Route path='/repo-details/:owner/:repo/:tab?' component={RepoDetails}></Route>
          </Switch>
        </BrowserRouter>
      </AppContextProvider>

  );
}

export default App;
