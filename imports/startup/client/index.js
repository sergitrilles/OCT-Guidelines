import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/css/bootstrap.min.css';
import './routes.js';

import tether from 'tether'
global.Tether = tether

Bert.defaults.style = 'growl-top-right';
