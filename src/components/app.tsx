import {createHashHistory} from 'history';
import {FunctionalComponent, h} from 'preact';
import {Route, Router} from 'preact-router';
import {useMemo, useState} from 'preact/hooks';
import baseroute from '../baseroute';
import Changelog from '../routes/changelog';
import Home from '../routes/home';
import NotFoundPage from '../routes/notfound';
import Header from './header';
import {Theme, ThemeType} from './Theme';

const App: FunctionalComponent = () => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [theme, setTheme] = useState<ThemeType>(localStorage.theme ?? 'dark');

  // ran on init
  useMemo(() => {
    if (!localStorage.theme || localStorage.theme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = (): void => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    setTheme(newTheme);
    localStorage.theme = newTheme;
  };

  return (
    <div id="preact_root">
      <Theme.Provider value={theme}>
        <Header currentRoute={currentRoute} />
        <Router
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          history={createHashHistory()}
          onChange={({url}): void =>
            setCurrentRoute(url.substr(baseroute.length))
          }
        >
          <Route path={`${baseroute}/`} component={Home} />
          <Route path={`${baseroute}/changelog`} component={Changelog} />
          <NotFoundPage default />
        </Router>
      </Theme.Provider>
      <div style={{float: 'right', paddingRight: 10, paddingBottom: 10}}>
        <button class="btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌚' : '☀️'}
        </button>
      </div>
    </div>
  );
};

export default App;
