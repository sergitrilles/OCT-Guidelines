/**
 * Created by estri on 19/02/2018.
 */

import React, { Component } from 'react';
import { func, string } from 'prop-types';

import Mappa from 'mappa-mundi';

import p5 from 'p5';
// import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom';
import './p5.geolocation';

class P5Component extends Component {
  static propTypes = {
    id: string,
    sketch: func
  }

  static defaultProps = {
    id: 'emptyP5Element'
  }

  componentDidMount() {
    console.log(this.p5Container);
    this.canvas = new p5(this.props.sketch, this.p5Container);
  }

  render() {
    const { id } = this.props;

    return (
      <div
        id={id}
        ref={input => {
          this.p5Container = input
        }}
        className="p5Container"
      />
    )
  }
}

export default P5Component
