import React, {Component} from 'react';
import {connect} from 'react-redux';
import {contentSelector} from '../selectors';
import TextBlock from './TextBlock';
import CodeBlock from './CodeBlock';
import GraphBlock from './GraphBlock';
import MapBlock from './MapBlock';
import ConditionBlock from './ConditionBlock';
import p5Block from './p5Block';


import AddControls from './AddControls';


// ...render:


class Content extends Component {

  render() {
    const {
      dispatch, content, results, blocksExecuted, editable, activeBlock
    } = this.props;
    let blocks = [];

    for (let i = 0; i < content.size; i++) {
      const block = content.get(i);
      const id = block.get('id');
      const isFirst = (i === 0);
      const isLast = (i === content.size - 1);
      blocks.push(
        <AddControls key={'add' + i} dispatch={dispatch}
                     id={block.get('id')} editable={editable}/>
      );

      //alert(block.get('type'));
      switch (block.get('type')) {
        case 'text':
          blocks.push(
            <TextBlock editable={editable} dispatch={dispatch}
                       block={block} key={String(i)} isFirst={isFirst}
                       isLast={isLast} editing={id === activeBlock}
            />
          );
          break;
        case 'condition':

          hasBeenRun = blocksExecuted.includes(id);
          result = results.get(id);
          BlockClass = ConditionBlock;
          blocks.push(
            <BlockClass
              block={block} result={result} editable={editable}
              key={String(i)} hasBeenRun={hasBeenRun} dispatch={dispatch}
              isFirst={isFirst} isLast={isLast}
              editing={id === activeBlock}
            />
          );
        case 'code':
          hasBeenRun = blocksExecuted.includes(id);
          result = results.get(id);
          BlockClass = CodeBlock;
          blocks.push(
            <BlockClass
              block={block} result={result} editable={editable}
              key={String(i)} hasBeenRun={hasBeenRun} dispatch={dispatch}
              isFirst={isFirst} isLast={isLast}
              editing={id === activeBlock}
            />
          );
        case 'p5':
          /*
          alert("DENTRO");
          alert(id === activeBlock);
          alert("CONTENT");
          alert(activeBlock);
          alert(id);
          alert(block.get('type'));
          */
          hasBeenRun = blocksExecuted.includes(id);
          result = results.get(id);
          BlockClass = p5Block;
          blocks.push(
            <BlockClass
              block={block} result={result} editable={editable}
              key={String(i)} hasBeenRun={hasBeenRun} dispatch={dispatch}
              isFirst={isFirst} isLast={isLast}
              editing={id === activeBlock}
            />
          );
        case 'graph':
          hasBeenRun = blocksExecuted.includes(id);
          result = results.get(id);
          BlockClass = GraphBlock;
          blocks.push(
            <BlockClass
              block={block} result={result} editable={editable}
              key={String(i)} hasBeenRun={hasBeenRun} dispatch={dispatch}
              isFirst={isFirst} isLast={isLast}
              editing={id === activeBlock}
            />
          );
        case 'map':
          hasBeenRun = blocksExecuted.includes(id);
          result = results.get(id);
          BlockClass = MapBlock;
          blocks.push(
            <BlockClass
              block={block} result={result} editable={editable}
              key={String(i)} hasBeenRun={hasBeenRun} dispatch={dispatch}
              isFirst={isFirst} isLast={isLast}
              editing={id === activeBlock}
            />
          );
      }
    }
    blocks.push(
      <AddControls key="add-end" dispatch={dispatch} editable={editable}/>
    );

    return <div>{blocks}</div>;
  }

}

export default connect(contentSelector)(Content);
