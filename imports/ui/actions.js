import {parse} from 'query-string';
import Immutable from 'immutable';
import L from 'leaflet';
import bbox from 'turf-bbox';


import reshaper from 'reshaper';
import Smolder from 'smolder';
import Jutsu from 'jutsu'; // Imports d3 and nv as globals

import {extractMarkdownFromHTML, extractMarkdownFromHTML_new, extractMarkdownFromDB} from './util';
import {gistUrl, gistApi} from './config';


import React from 'react';
import 'leaflet/dist/leaflet.css'

import {
  Map,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  Circle,
  Rectangle,
  FeatureGroup,
  Overlay,
  Polyline,
  GeoJSON,

} from 'react-leaflet';

/*
 * Action types
 */
export const LOAD_STATE = 'LOAD_STATE';
export const GET_STATE = 'GET_STATE';
export const LOAD_MARKDOWN = 'LOAD_MARKDOWN';
export const CODE_EXECUTED = 'CODE_EXECUTED';
export const CODE_ERROR = 'CODE_ERROR';
export const RECEIVED_DATA = 'RECEIVED_DATA';
export const TOGGLE_EDIT = 'TOGGLE_EDIT';
export const UPDATE_BLOCK = 'UPDATE_BLOCK';
export const EDIT_BLOCK = 'EDIT_BLOCK';
export const UPDATE_META = 'UPDATE_META';
export const TOGGLE_META = 'TOGGLE_META';
export const ADD_BLOCK = 'ADD_BLOCK';
export const DELETE_BLOCK = 'DELETE_BLOCK';
export const MOVE_BLOCK_DOWN = 'MOVE_BLOCK_DOWN';
export const MOVE_BLOCK_UP = 'MOVE_BLOCK_UP';
export const DELETE_DATASOURCE = 'DELETE_DATASOURCE';
export const UPDATE_DATASOURCE = 'UPDATE_DATASOURCE';
export const TOGGLE_SAVE = 'TOGGLE_SAVE';
export const GIST_CREATED = 'GIST_CREATED';
export const UNDO = 'UNDO';
export const CHANGE_CODE_BLOCK_OPTION = 'CHANGE_CODE_BLOCK_OPTION';
export const UPDATE_GRAPH_BLOCK_PROPERTY = 'UPDATE_GRAPH_BLOCK_PROPERTY';
export const UPDATE_GRAPH_BLOCK_HINT = 'UPDATE_GRAPH_BLOCK_HINT';
export const UPDATE_GRAPH_BLOCK_LABEL = 'UPDATE_GRAPH_BLOCK_LABEL';
export const CLEAR_GRAPH_BLOCK_DATA = 'CLEAR_GRAPH_BLOCK_DATA';

export const UPDATE_MAP_BLOCK_PROPERTY = 'UPDATE_MAP_BLOCK_PROPERTY';


export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const RESET_ALL = 'RESET_ALL';
export const SET_DATE = 'SET_DATE';

var map;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
}

export function loadMarkdown() {
  const queryParams = parse(location.search);
  if (queryParams.id) {
    const url = gistUrl + queryParams.id + '/raw';
    return (dispatch, getState) => {
      return fetch(url, {
        method: 'get'
      })
        .then(checkStatus)
        .then(response => response.text())
        .then(md => dispatch({
          type: LOAD_MARKDOWN,
          markdown: md
        }))
        .then(() => dispatch(fetchData()))
        .catch(() => {
          dispatch(loadMarkdownFromHTML());
          dispatch(fetchData());
        })
    };
  }
  return loadMarkdownFromHTML();
}

export function getStateGuideline(body) {
  return {
    type: GET_STATE,
    text: body
  };
}


export function loadMarkdownFromDB(text) {
  return {
    type: LOAD_STATE,
    state: text
  };
}

function loadMarkdownFromHTML() {
  return {
    type: LOAD_MARKDOWN,
    markdown: extractMarkdownFromHTML()
  };
}

export function executeCodeBlock(id) {
  return (dispatch, getState) => {

    L.Icon.Default.imagePath = '/';

    const code = getState().notebook.getIn(['blocks', id, 'content']);

    var sResul =""
    if (code) {
      var map_var = /map.map/;
      var graph = /graph/;
      var graphElement;

      var dataString = code.substring(code.lastIndexOf("(") + 1, code.lastIndexOf(")"));

      const executionState = getState().execution;
      const context = executionState.get('executionContext').toJS();
      const data = executionState.get('data').toJS();

      if (code.match(map_var) && dataString != "data") {

        return new Promise((resolve, reject) => {
          try {
            graphElement = document.getElementById("kajero-graph-" + id);

            var bounds;
            var bboxArray;

              bboxArray = bbox(eval(dataString));
              bounds = L.latLngBounds([[bboxArray[1], bboxArray[0]], [bboxArray[3], bboxArray[2]]]);

            var myStyle = {
              "color": "#ff0930",
              "weight": 5,
              "opacity": 0.65
            };

            if (graphElement) {
              alert("1");

              //var mapContainerParent = graphElement.parentNode;
              //mapContainerParent.removeChild(graphElement);
              //var newMapContainer = document.createElement('div');
              //newMapContainer.setAttribute("id", "kajero-graph-" + id);
              //newMapContainer.setAttribute("class", "graphBlock");
              //newMapContainer.setAttribute("value", "map");
              //mapContainerParent.appendChild(newMapContainer);
              //mapContainerParent.insertChildAtIndex(newMapContainer,2);

              //graphElement = document.getElementById("kajero-graph-" + id);
              //

              while(graphElement.firstChild)
                graphElement.parentNode.removeChild(graphElement);
              var t = document.createElement('div');
              t.setAttribute("id", "kajero-graph-" + id);
              t.setAttribute("class", "graphBlock");
              //t.innerHTML = response;
              graphElement.parentNode.insertBefore(t, graphElement.parentNode.childNodes[1]);
              //graphElement.parentNode.appendChild()

              /*
              graphElement.innerHTML = "";
              graphElement = document.createElement('div');
              graphElement.setAttribute("id", "kajero-graph-" + id);
              graphElement.setAttribute("class", "graphBlock");*/

              if (window['map' + id]) {
                window['map' + id].off();
                window['map' + id].remove();
                //window['map' + id].invalidateSize();
              }

              window['map' + id] = L.map(t, {
                center: [0, 0],
                minZoom: 0,
                maxZoom: 16,
                zoom: 8
              });

              L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 16
                }).addTo(window['map' + id]);


              var geojsonLayer = L.geoJson(eval(dataString), {style: myStyle}).addTo(window['map' + id]);

              window['map' + id].fitBounds(geojsonLayer.getBounds());

            }
            else {
              window['map' + id] = L.map(graphElement, {
                center: [0, 0],
                minZoom: 2,
                maxZoom: 16,
                zoom: 8,
                maxBounds: bounds
              });

              L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 16
                }).addTo(window['map' + id]);

              var geojsonLayer = L.geoJson(eval(dataString), {style: myStyle}).addTo(window['map' + id]);
              window['map' + id].fitBounds(geojsonLayer.getBounds());
            }

            setTimeout(function () {
              window['map' + id].invalidateSize();
            }, 10);

            var sResul ="Map block"
            resolve(sResul);
          } catch (err) {

            var mapContainerParent = graphElement.parentNode;
            mapContainerParent.removeChild(graphElement);
            var newMapContainer = document.createElement('div');
            newMapContainer.setAttribute("id", "kajero-graph-" + id);
            newMapContainer.setAttribute("className", "graphBlock");
            newMapContainer.setAttribute("value", "map");
            newMapContainer.innerHTML = "<i><small>Please, select a correct GeoJson as Datasource!</small></i>";
            mapContainerParent.appendChild(newMapContainer);
            //mapContainerParent.insertChildAtIndex(newMapContainer,2);

            reject(err);
          }
        })
          .then((result) => dispatch(
            codeExecuted(id, result, Immutable.fromJS(context))
          ))
          .catch((err) => dispatch(codeError(id, err)));
      }

      else {
        graphElement = document.getElementById("kajero-graph-" + id);
        const executionState = getState().execution;
        const context = executionState.get('executionContext').toJS();
        const data = executionState.get('data').toJS();
        const jutsu = Smolder(Jutsu(graphElement));

        return new Promise((resolve, reject) => {
          try {
            const result = new Function(
              ['d3', 'nv', 'graphs', 'data', 'reshaper', 'graphElement'], code
            ).call(
              context, d3, nv, jutsu, data, reshaper, graphElement
            );
            resolve(result);
          } catch (err) {
            reject(err);
          }
        })
          .then((result) => dispatch(
            codeExecuted(id, result, Immutable.fromJS(context))
          ))
          .catch((err) => dispatch(codeError(id, err)));
      }

    }
    ;

  }
}


  Element.prototype.insertChildAtIndex = function(child, index) {
    if (!index) index = 0
    if (index >= this.children.length) {
      this.appendChild(child)
    } else {
      this.insertBefore(child, this.children[index])
    }
  }

/*
 export function executeCodeBlock(id) {
 return (dispatch, getState) => {

 var map = /map/;
 var graph = /graph/;
 var graphElement;

 const code = getState().notebook.getIn(['blocks', id, 'content']);

 if (code.match(map))
 { graphElement = document.getElementById("kajero-map-" + id);}

 if (code.match(graph))
 { graphElement = document.getElementById("kajero-graph-" + id);}

 const executionState = getState().execution;
 const context = executionState.get('executionContext').toJS();
 const data = executionState.get('data').toJS();
 const jutsu = Smolder(Jutsu(graphElement));
 //alert(graphElement.toString());


 return new Promise((resolve, reject) => {
 try {

 if (true) {
 alert(code);
 const result = new Function(
 ['d3', 'nv', 'graphs', 'data', 'reshaper', 'graphElement'], code
 ).call(
 context, d3, nv, jutsu, data, reshaper, graphElement
 );
 }
 else {

 }
 resolve(result);

 } catch (err) {
 reject(err);
 }
 })
 .then((result) => dispatch(
 codeExecuted(id, result, Immutable.fromJS(context))
 ))
 .catch((err) => dispatch(codeError(id, err)));
 };
 }
 */

function changeResultMessage(id, result) {

  return {
    type: CODE_EXECUTED,
    id,
    data: result
  };
}


function codeExecuted(id, result, context) {

  return {
    type: CODE_EXECUTED,
    id,
    data: result,
    context
  };
}

function codeError(id, err) {
  return {
    type: CODE_ERROR,
    id,
    data: err
  };
}

export function executeAuto() {
  return (dispatch, getState) => {

    const notebook = getState().notebook;
    const blocks = notebook.get('blocks');
    const order = notebook.get('content');

    return order.reduce((p, id) => {
      return p.then(() => {
        const option = blocks.getIn([id, 'option']);
        if (option === 'auto' || option === 'hidden') {
          return dispatch(executeCodeBlock(id));
        }
        return Promise.resolve();
      });
    }, Promise.resolve());
  }
}

function receivedData(name, data) {
  return {
    type: RECEIVED_DATA,
    name,
    data
  };
}

export function fetchData() {
  return (dispatch, getState) => {
    let proms = [];
    const currentData = getState().execution.get('data');
    getState().notebook.getIn(['metadata', 'datasources']).forEach(
      (url, name) => {
        if (!currentData.has(name)) {
          proms.push(
            fetch(url, {
              method: 'get'
            })
              .then(response => response.json())
              .then(j => dispatch(receivedData(name, j)))
          );
        }
      }
    );
    return Promise.all(proms).then(() => dispatch(executeAuto()));
  };
}

export function toggleEdit() {
  return {
    type: TOGGLE_EDIT
  };
}

export function updateBlock(id, text) {
  return {
    type: UPDATE_BLOCK,
    id,
    text
  };
}
export function updateTitle(text) {
  return {
    type: UPDATE_META,
    field: 'title',
    text
  };
}
export function updateAuthor(text) {
  return {
    type: UPDATE_META,
    field: 'author',
    text
  };
}

export function updateImage(text) {
  return {
    type: UPDATE_META,
    field: 'featured_image',
    text
  };
}
export function toggleFooter() {
  return {
    type: TOGGLE_META,
    field: 'showFooter'
  };
}
export function addCodeBlock(id) {
  return {
    type: ADD_BLOCK,
    blockType: 'code',
    id
  };
}
export function addTextBlock(id) {
  return {
    type: ADD_BLOCK,
    blockType: 'text',
    id
  };
}
export function addGraphBlock(id) {
  return {
    type: ADD_BLOCK,
    blockType: 'graph',
    id
  };
}
export function addMapBlock(id) {
  return {
    type: ADD_BLOCK,
    blockType: 'map',
    id
  };
}
export function deleteBlock(id) {
  return {
    type: DELETE_BLOCK,
    id
  };
}
export function moveBlockUp(id) {
  graphElement = document.getElementById("kajero-graph-" + id);
  if (graphElement) {
    var mapContainerParent = graphElement.parentNode;
    mapContainerParent.removeChild(graphElement);
  }

  return {
    type: MOVE_BLOCK_UP,
    id
  };
}
export function moveBlockDown(id) {

  graphElement = document.getElementById("kajero-graph-" + id);
  if (graphElement) {
    var mapContainerParent = graphElement.parentNode;
    mapContainerParent.removeChild(graphElement);

  }
  return {
    type: MOVE_BLOCK_DOWN,
    id
  };
}
export function deleteDatasource(id) {
  return {
    type: DELETE_DATASOURCE,
    id
  };
}
export function updateDatasource(id, url) {
  return {
    type: UPDATE_DATASOURCE,
    id,
    text: url
  };
}
export function toggleSave() {
  return {
    type: TOGGLE_SAVE
  };
}
function gistCreated(id) {
  return {
    type: GIST_CREATED,
    id
  };
}

export function saveGist(title, markdown) {
  return (dispatch, getState) => {
    return fetch(gistApi, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        description: title,
        'public': true,
        files: {
          'notebook.md': {
            content: markdown
          }
        }
      })
    })
      .then(response => response.json())
      .then(gist => dispatch(gistCreated(gist.id)));
  };
}
export function undo() {
  return {
    type: UNDO
  };
}

export function changeCodeBlockOption(id) {
  return {
    type: CHANGE_CODE_BLOCK_OPTION,
    id
  };
}

export function updateGraphType(id, graph) {
  return {
    type: UPDATE_GRAPH_BLOCK_PROPERTY,
    id: id,
    property: 'graphType',
    value: graph
  };
}

export function updateGraphDataPath(id, path) {
  return {
    type: UPDATE_GRAPH_BLOCK_PROPERTY,
    id: id,
    property: 'dataPath',
    value: path
  };
}

export function updateMapDataPath(id, path) {
  return {
    type: UPDATE_MAP_BLOCK_PROPERTY,
    id: id,
    property: 'dataPath',
    value: path
  };
}

export function updateGraphHint(id, hint, value) {
  return {
    type: UPDATE_GRAPH_BLOCK_HINT,
    id: id,
    hint: hint,
    value: value
  };
}

export function updateGraphLabel(id, label, value) {
  return {
    type: UPDATE_GRAPH_BLOCK_LABEL,
    id,
    label,
    value
  };
}

export function compileGraphBlock(id) {
  return {
    type: UPDATE_GRAPH_BLOCK_PROPERTY,
    id: id,
    property: 'type',
    value: 'code'
  };
}

export function clearGraphData(id) {
  return {
    type: CLEAR_GRAPH_BLOCK_DATA,
    id
  };
}

export function editBlock(id) {


  graphElement = document.getElementById("kajero-graph-" + id);
  if (graphElement) {
    var mapContainerParent = graphElement.parentNode;
    mapContainerParent.removeChild(graphElement.parentNode.childNodes[1]);
  }


    /*
    alert("editBlock");
    graphElement = document.getElementById("kajero-graph-" + id);
    if (graphElement && (graphElement.getAttribute('value')=="map")){
      var mapContainerParent = graphElement.parentNode;
      mapContainerParent.removeChild(graphElement);
      var newMapContainer = document.createElement('div');
      newMapContainer.setAttribute("id", "kajero-graph-" + id);
      newMapContainer.setAttribute("hidden", true);
      newMapContainer.setAttribute("className", "graphBlock");
      newMapContainer.setAttribute("value", "map");
      mapContainerParent.appendChild(newMapContainer);
    }
    graphElement = document.getElementById("resultBlock-" + id);
    if (graphElement && (graphElement.getAttribute('value')=="map")){
      var mapContainerParent = graphElement.parentNode;
      mapContainerParent.removeChild(graphElement);
      var newMapContainer = document.createElement('div');
      newMapContainer.setAttribute("id", "resultBlock-" + id);
      newMapContainer.setAttribute("hidden", true);
      newMapContainer.setAttribute("className", "resultBlock");
      newMapContainer.setAttribute("value", "map");
      mapContainerParent.appendChild(newMapContainer);
    }
    */
  return {
    type: EDIT_BLOCK,
    id
  };
}


export const addItem = item => ({type: ADD_ITEM, item});
export const updateItem = item => ({type: UPDATE_ITEM, item});
export const deleteItem = item => ({type: DELETE_ITEM, item});
export const resetAll = () => ({type: RESET_ALL});
export const setDate = date => ({type: SET_DATE, date});
