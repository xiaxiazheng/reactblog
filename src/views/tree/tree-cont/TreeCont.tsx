import React from 'react';
import styles from './TreeCont.module.scss';
import TreeContMain from './tree-cont-main/TreeContMain';
import TreeContMainEdit from './tree-cont-main-edit/TreeContMainEdit';
import TreeContEdit from './tree-cont-edit/TreeContEdit';
import TreeContShow from './tree-cont-show/TreeContShow';

interface ITreeCont {
  isMain: boolean
  isEdit: boolean
}

const TreeCont: React.FC<ITreeCont> = (props) => {
  const {
    isMain,
    isEdit
  } = props;

  return (
    <div className={styles.treecont}>
      {isMain && (
        isEdit ? <TreeContMainEdit /> : <TreeContMain />
      )}
      {!isMain && (
        isEdit ? <TreeContEdit /> : <TreeContShow />
      )}
    </div>
  );
}

export default TreeCont;
