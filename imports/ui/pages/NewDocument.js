import React from 'react';
import PropTypes from 'prop-types';

import DocumentNewEditor from '../components/DocumentNewEditor.js';

const NewDocument = () => (
  <div className="NewDocument">
    <h4 className="page-header">New Guideline</h4>
    <DocumentNewEditor />
  </div>
);

NewDocument.propTypes = {
  doc: PropTypes.object,
};

export default NewDocument;


