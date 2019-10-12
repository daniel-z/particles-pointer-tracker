import React from 'react';
import './App.css';
import ParticlesPointerTracker from './particlesComponentDemo';

const App = () => (
  <div className="App">
    <span className="legend">Move Your Mouse Around</span>
    <ParticlesPointerTracker id={"particles-demo"}/>
    <div className="content">
      <h1>PARTICLES TRACKER</h1>
      <p> This is a javascript library to generate a group of particles to track and follow the mouse pointer.</p>
      <p> You can configure it by using the controls in the top right.</p>
      <a href="https://github.com/daniel-z/particles-pointer-tracker/blob/master/src/particles-pointer-tracker.js">See Code</a>
    </div>
  </div>
);

export default App;