import Immutable from 'immutable';
import Jutsu from 'jutsu';
import {parse, render} from '../markdown';
import {kajeroHomepage} from '../config';
import {
  LOAD_STATE,
  LOAD_MARKDOWN,
  GET_STATE,
  UPDATE_BLOCK,
  UPDATE_META,
  TOGGLE_META,
  ADD_BLOCK,
  DELETE_BLOCK,
  MOVE_BLOCK_UP,
  MOVE_BLOCK_DOWN,
  DELETE_DATASOURCE,
  UPDATE_DATASOURCE,
  GIST_CREATED,
  UNDO,
  CHANGE_CODE_BLOCK_OPTION,
  UPDATE_MAP_BLOCK_PROPERTY,
  UPDATE_CONDITION_BLOCK_PROPERTY,
  UPDATE_CONDITION_BLOCK_LABEL,
  UPDATE_GRAPH_BLOCK_PROPERTY,
  UPDATE_GRAPH_BLOCK_HINT,
  UPDATE_GRAPH_BLOCK_LABEL,
  CLEAR_GRAPH_BLOCK_DATA,
  UPDATE_P5_BLOCK_PROPERTY,
  UPDATE_TEXT_BLOCK_LABEL
} from '../actions';

/*
 * This reducer handles the state of the notebook's actual content,
 * obtained by parsing Markdown. This is kept separate from the execution
 * state to help with implementing 'undo' in the editor.
 */
export const initialState = Immutable.Map({
  metadata: Immutable.fromJS({
    datasources: {}
  }),
  content: Immutable.List(),
  blocks: Immutable.Map(),
  undoStack: Immutable.List()
});

export default function notebook(state = initialState, action) {
  const {id, text, field, blockType} = action;
  const content = state.get('content');
  let newState;

  //alert(action.type);

  switch (action.type) {
    case GET_STATE:
      action.text =  render(state);
      return state;
    case LOAD_STATE:
      return action.state;
    case LOAD_MARKDOWN:
      return parse(action.markdown).mergeDeep(state);
    case UPDATE_BLOCK:
      return handleChange(
        state, state.setIn(['blocks', id, 'content'], text)
      );
    case UPDATE_META:
      return handleChange(
        state, state.setIn(['metadata', field], text)
      );
    case TOGGLE_META:
      return handleChange(
        state, state.setIn(['metadata', field], !state.getIn(['metadata', field]))
      );
    case ADD_BLOCK:
      const newId = getNewId(content);
      let newBlock = {type: blockType, id: newId};

      if (blockType === 'code') {
        newBlock.content = '// New code block';
        newBlock.language = 'javascript';
        newBlock.option = 'runnable';
        newBlock.condID = '';
        newBlock.condValue = '';

      }
      else if (blockType === 'p5') {
        newBlock.content = '// New p5 code block';
        newBlock.language = 'javascript';
        newBlock.option = 'runnable';
        newBlock.condID = '';
        newBlock.condValue = '';
      }
      else if (blockType === 'map') {
        newBlock.language = 'javascript';
        newBlock.option = 'runnable';
        newBlock.content = 'return map.map(data);';
        newBlock.graphType = 'map';
        newBlock.dataPath = 'data';
        newBlock.hints = Immutable.fromJS({
          zoom: '',
          x: '',
          y: ''
        });

      }
      else if (blockType === 'graph') {
        newBlock.language = 'javascript';
        newBlock.option = 'runnable';
        newBlock.content = 'return graphs.pieChart(data);';
        newBlock.graphType = 'pieChart';
        newBlock.dataPath = 'data';
        newBlock.hints = Immutable.fromJS({
          label: '',
          value: '',
          x: '',
          y: ''
        });
        newBlock.labels = Immutable.fromJS({
          x: '',
          y: ''
        });
      }
      else if (blockType === 'condition') {
        newBlock.language = 'javascript';
        newBlock.option = 'runnable';
        newBlock.content = 'return condition.simple(data);';
        newBlock.graphType = 'simple';
        newBlock.dataPath = 'data';
        newBlock.labels = Immutable.fromJS({
          Condition: '',
          Default: ''
        });
      }
      else {
        newBlock.content = 'New text block';
        newBlock.condID = '';
        newBlock.condValue = '';
      }
      newState = handleChange(
        state, state.setIn(['blocks', newId], Immutable.fromJS(newBlock))
      );
      if (id === undefined) {
        return newState.set('content', content.push(newId));
      }
      return newState.set('content', content.insert(content.indexOf(id), newId));
    case DELETE_BLOCK:
      return handleChange(
        state,
        state.deleteIn(['blocks', id]).set(
          'content', content.delete(content.indexOf(id))
        )
      );
    case MOVE_BLOCK_UP:
      return handleChange(
        state, state.set('content', moveItem(content, id, true))
      );
    case MOVE_BLOCK_DOWN:
      return handleChange(
        state, state.set('content', moveItem(content, id, false))
      );
    case DELETE_DATASOURCE:
      return handleChange(
        state, state.deleteIn(['metadata', 'datasources', id])
      );
    case UPDATE_DATASOURCE:
      return handleChange(
        state, state.setIn(['metadata', 'datasources', id], text)
      );
    case GIST_CREATED:
      return state.setIn(['metadata', 'gistUrl'], kajeroHomepage + '?id=' + id);
    case UNDO:
      return undo(state);
    case CHANGE_CODE_BLOCK_OPTION:
      return handleChange(state, state.setIn(
        ['blocks', id, 'option'],
        getNewOption(state.getIn(['blocks', id, 'option']))
      ));
    case UPDATE_GRAPH_BLOCK_PROPERTY:
      newState = state.setIn(
        ['blocks', id, action.property], action.value
      );
      return handleChange(state, newState.setIn(
        ['blocks', id, 'content'],
        generateCode(newState.getIn(['blocks', id]))
      ));
    case UPDATE_GRAPH_BLOCK_HINT:
      newState = state.setIn(
        ['blocks', id, 'hints', action.hint], action.value
      );
      return handleChange(state, newState.setIn(
        ['blocks', id, 'content'],
        generateCode(newState.getIn(['blocks', id]))
      ));
    case UPDATE_GRAPH_BLOCK_LABEL:
      newState = state.setIn(
        ['blocks', id, 'labels', action.label], action.value
      );
      return handleChange(state, newState.setIn(
        ['blocks', id, 'content'],
        generateCode(newState.getIn(['blocks', id]))
      ));
    case CLEAR_GRAPH_BLOCK_DATA:
      return state.setIn(
        ['blocks', id],
        state.getIn(['blocks', id]).remove('hints')
          .remove('graphType').remove('labels')
          .remove('dataPath')
      );

    case UPDATE_MAP_BLOCK_PROPERTY:
      newState = state.setIn(
        ['blocks', id, action.property], action.value
      );
      return handleChange(state, newState.setIn(
        ['blocks', id, 'content'],
        generateCode(newState.getIn(['blocks', id]))
      ));

    case UPDATE_CONDITION_BLOCK_LABEL:
      newState = state.setIn(
        ['blocks', id, 'labels', action.label], action.value
      );
      return handleChange(state, newState.setIn(
        ['blocks', id, 'content'],
        generateCode(newState.getIn(['blocks', id]))
      ));

    case UPDATE_TEXT_BLOCK_LABEL:
      newState = state.setIn(
        ['blocks', id, 'labels', action.label], action.value
      );
      return handleChange(state, newState.setIn(
        ['blocks', id, 'content'],
        generateCode(newState.getIn(['blocks', id]))
      ));

    case UPDATE_CONDITION_BLOCK_PROPERTY:
      newState = state.setIn(
        ['blocks', id, action.property], action.value
      );
      return handleChange(state, newState.setIn(
        ['blocks', id, 'content'],
        generateCode(newState.getIn(['blocks', id]))
      ));

    default:
      return state;
  }
}

function generateCode(block) {
  //alert(block.get('type'));
  if (block.get('type') === 'condition') {
    return 'return condition.' + block.get('graphType') +
      '(' + getLabels(block) + ');';
  }

  if (block.get('graphType') === 'map') {
    return 'return map.' + block.get('graphType') +
      '(' + block.get('dataPath') + ');';
  }

  if (block.get('graphType') === 'simple') {
    return 'return condition.' + block.get('graphType') +
      '(' + block.get('dataPath') + ');';
  }

  if (block.get('type') === 'text') {

    return getLabels(block) + ' ' + block.get('content');

   // return 'return condition.' + block.get('graphType') +
    //  '(' + getLabels(block) + ');';
  }

  return 'return graphs.' + block.get('graphType') +
    '(' + block.get('dataPath') + getLabels(block) +
    getHints(block) + ');';
}

function getHints(block) {
  const hints = block.get('hints');
  //alert(hints);
  const schema = Jutsu().__SMOLDER_SCHEMA[block.get('graphType')].data[0];
  const result = [];
  const keys = Object.keys(schema).sort();
  for (let i = 0; i < keys.length; i++) {
    const hint = keys[i];
    const value = hints.get(hint);
    if (value) {
      result.push(hint + ": '" + value + "'");
    }
  }
  if (result.length === 0) {
    return '';
  }
  return ', {' + result.join(', ') + '}';
}

function getLabels(block) {
  //alert(block);
  //alert(block.get('graphType'));
  const labels = block.get('labels');
  if (block.get('type') === 'condition') {
    const aux = [labels.get('Condition'), labels.get('Default')].map(
      (label) => "'" + label + "'"
    ).join(', ')
    //alert("kkk");
    return aux;
  }

  if (block.get('graphType') === 'pieChart') {
    return '';
  }

  if (block.get('graphType') === 'map') {
    return '';
  }

  if (block.get('type') === 'text'){
    const aux = [labels.get('Condition'), labels.get('Default')].map(
      (label) => "'" + label + "'"
    ).join(', ')
    //alert("kkk");
    return aux;
  }

  //const labels = block.get('labels');
  return ', ' +
    [labels.get('x'), labels.get('y')].map(
      (label) => "'" + label + "'"
    ).join(', ');
}

function getNewId(content) {
  var id = 0;
  while (content.contains(String(id))) {
    id++;
  }
  return String(id);
}

function getNewOption(option) {
  const options = ['runnable', 'auto', 'hidden'];
  const i = options.indexOf(option);
  return options[(i + 1) % options.length];
}

function moveItem(content, id, up) {
  const index = content.indexOf(id);
  if ((index === 0 && up) || (index === content.size - 1 && !up)) {
    return content;
  }
  if (up) {
    return content.slice(0, index - 1)
      .push(id).push(content.get(index - 1))
      .concat(content.slice(index + 1));
  }
  return content.slice(0, index)
    .push(content.get(index + 1)).push(id)
    .concat(content.slice(index + 2));
}

/*
 * Handles changes, if they exist, by pushing to the undo stack.
 */
function handleChange(currentState, newState) {
  if (currentState.equals(newState)) {
    return newState;
  }
  let result = newState.set(
    'undoStack',
    newState.get('undoStack').push(currentState.remove('undoStack'))
  ).deleteIn(
    ['metadata', 'gistUrl']
  ).setIn(
    ['metadata', 'created'],
    new Date()
  );

  // If it's the first change, update the parent link.
  if (currentState.get('undoStack').size === 0) {
    result = result.setIn(['metadata', 'original'], Immutable.fromJS({
      title: currentState.getIn(['metadata', 'title']),
      url: location.href
    }));
  }
  return result;
}

function undo(state) {
  if (state.get('undoStack').size === 0) {
    return state;
  }
  return state.get('undoStack').last()
    .set('undoStack', state.get('undoStack').pop());
}
