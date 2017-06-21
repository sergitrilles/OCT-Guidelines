import { combineReducers } from 'redux';

import notebook from './notebookReducer';
import notebookList from './notebookListReducer';
import execution from './executionReducer';
import editor from './editorReducer';

export default combineReducers({
    notebook,
    notebookList,
    execution,
    editor
});

