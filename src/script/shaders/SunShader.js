import sunVertex from '../../assets/shaders/sunVertex.glsl?raw';
import sunFragment from '../../assets/shaders/sunFragment.glsl?raw';

const SunShader = {
  vertexShader: sunVertex,
  fragmentShader: sunFragment,
  uniforms: {
    time: { value: 0.0 }
  }
};

export default SunShader;
