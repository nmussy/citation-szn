import { FunctionalComponent, h } from "preact";
import baseroute from "../../baseroute";

const Header: FunctionalComponent = () => {
  return (
    <header>
      <nav class="navbar">
        <a href="#" class="navbar-brand">
          <img src={`${baseroute}/assets/curvyeCop.png`} alt="curvyeCop" />
          Citation szn
        </a>

        <span class="navbar-text text-monospace">v0.2.0</span>

        <ul class="navbar-nav d-none d-md-flex">
          <li class="nav-item active">
            <a href="#" class="nav-link">
              Generator
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              Changelog
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              Credits
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
