import React, {Component} from 'react';
import ParticlesPointerTracker from './particles-pointer-tracker';

export class ParticlesComponent extends Component {
  componentDidMount() {
    const particlesTracker = new ParticlesPointerTracker(this.props.id);
    particlesTracker.init();
  }

  render(props) {
    return (
      <div className="particles-component">
        <canvas id={this.props.id}></canvas>
      </div>
    );
  }
}

export default ParticlesComponent;