import {FunctionalComponent, h} from 'preact';

const Changelog: FunctionalComponent = () => {
  return (
    <div class="content">
      <div class="container-fluid">
        <h2 class="content-title">Changelog</h2>
        <h3 class="content-title text-monospace">v0.5.0</h3>
        <ul>
          <li>Copy button</li>
          <li>Handle template errors</li>
          <li>Unsave configuration warning</li>
        </ul>
        <h3 class="content-title text-monospace">v0.4.0</h3>
        <ul>
          <li>MDW import</li>
          <li>Autoresize <code>textarea</code></li>
        </ul>
        <h3 class="content-title text-monospace">v0.3.0</h3>
        <ul>
          <li>Multiple charges</li>
          <li>Charges selector style fixes</li>
          <li>Light mode</li>
          <li>"New" version badge</li>
          <li>Changelog page</li>
        </ul>
        <h3 class="content-title text-monospace">v0.2.0</h3>
        <ul>
          <li>Officer customization</li>
          <li>Persistent configuration</li>
          <li>Charges selector style fixes</li>
        </ul>
        <h3 class="content-title text-monospace">v0.1.0</h3>
        <ul>
          <li>Initial release</li>
        </ul>
        <h2 class="content-title">Known issues</h2>
        <ul>
          <li>
            Duplicate charges in list if two are added, and the first is deleted
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Changelog;
