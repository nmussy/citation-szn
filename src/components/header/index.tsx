import {FunctionalComponent, h} from 'preact';
import {Link} from 'preact-router';
import baseroute from '../../baseroute';

const routes = [
  {path: '/', label: 'Generator'},
  {path: '/changelog', label: 'Changelog'},
];

const currentVersion = 'v0.6.0';
const isNewVersion = localStorage.previousVersion !== currentVersion;
localStorage.previousVersion = currentVersion;

const Header: FunctionalComponent<{currentRoute?: string}> = ({
  currentRoute,
}) => {
  return (
    <header>
      <nav class="navbar">
        <a href="#" class="navbar-brand">
          <img src={`${baseroute}/assets/curvyeCop.png`} alt="curvyeCop" />
          Citation szn
        </a>

        <span class="navbar-text text-monospace">{currentVersion}</span>
        {isNewVersion ? (
          <span class="navbar-text badge badge-danger badge-pill">new</span>
        ) : null}

        <ul class="navbar-nav d-none d-md-flex">
          {routes.map(({path, label}, index) => (
            <li
              class={`nav-item ${path === currentRoute ? 'active' : ''}`}
              key={index}
            >
              <Link href={path} class="nav-link">
                {label}
              </Link>
            </li>
          ))}

          <li class="nav-item">
            <a
              href="https://github.com/nmussy/citation-szn"
              class="nav-link"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`${baseroute}/assets/GitHub-Mark-Light-64px.png`}
                alt="GitHub logo"
                style={{maxWidth: 15, marginRight: 5}}
              />
              GitHub
            </a>
          </li>
        </ul>

        <a href="#" class="navbar-brand" style="margin-left: auto;">
          <img src={`${baseroute}/assets/curvyeDonk.gif`} alt="curvyeDonk" />
        </a>
      </nav>
    </header>
  );
};

export default Header;
