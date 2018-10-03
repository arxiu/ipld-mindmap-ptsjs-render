import React from 'react';

// For ES5 builds, import from 'pts/dist/es5'. For ES6 or custom builds, import from 'pts'.
import { CanvasSpace } from 'pts';
//var Hammer = require('react-hammerjs');
import TapAndPinchable from 'react-tappable/lib/TapAndPinchable';

export default class PtsCanvas extends React.Component {

  constructor(props) {
    super(props);
    this.canvRef = React.createRef();
    this.space = null;
    this.form = null;
  }

  componentDidMount() {
    this._create();
    this._loop();
  }

  componentDidUpdate() {
    this._loop();
  }

  _loop() {
    if (this.props.loop) {
      this.space.play();
    } else {
      this.space.playOnce(0);
    }
  }

  // Required: Override this to use Pts' player `animate` callback
  // See guide: https://ptsjs.org/guide/space-0500
  animate(time, ftime) { }

  // Optional: Override this to use Pts' player `start` callback
  start(space, bound) { }


  // Optional: Override this to use Pts' player `resize` callback
  resize(size, evt) { }


  // Optional: Override this to use Pts' player `action` callback
  action(type, px, py, evt) { }


  _create() {
    this.space = new CanvasSpace(this.canvRef, this.onCanvasReady).setup({
      bgcolor: this.props.background,
      resize: true,
      retina: true
    });

    this.form = this.space.getForm();
    this.space.add(this);
    this.space.bindMouse().bindTouch();
  }

  onCanvasReady(){
    //overwritten by sub class
  }

  onPinchStart(e) {
    if (this.props.onPinchStart)
      this.props.onPinchStart(e)
  }

  onPinchMove(e) {
    if (this.props.onPinchMove)
      this.props.onPinchMove(e)
  }

  onPinchEnd(e) {
    if (this.props.onPinchEnd)
      this.props.onPinchEnd(e)
  }

  onPress(e){
    if(this.props.onPress)
      this.props.onPress(e)
  }

  render() {
    return (

      <TapAndPinchable
        style={{ touchAction: 'none' }}
        stopPropagation={false}
        preventDefault = {false}
        onPinchMove={this.onPinchMove.bind(this)}
        onPinchStart={this.onPinchStart.bind(this)}
        onPinchEnd={this.onPinchEnd.bind(this)}
        onPress={this.onPress.bind(this).bind('contextmenu', function(e) {return false})}
        pressDelay={400}>
        <div className={this.props.name || ""}>
          <canvas
            height={800}
            onContextMenu = { (e)=>{e.preventDefault()}}
            ref={c => (this.canvRef = c)}></canvas>
        </div>
      </TapAndPinchable>

    );
  }
}


PtsCanvas.defaultProps = {
  name: "pt", // maps to className of the container div
  background: "#ff0",
  resize: true,
  retina: true,
  loop: true
}