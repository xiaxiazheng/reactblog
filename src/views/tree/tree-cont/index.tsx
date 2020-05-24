import React from "react";
import styles from "./index.module.scss";
import TreeContMain from "./tree-cont-main";
import TreeContMainEdit from "./tree-cont-main-edit";
import TreeContEdit from "./tree-cont-edit";
import TreeContShow from "./tree-cont-show";

interface ITreeCont {
  first_id: string;
  second_id: string;
  isMain: boolean;
  isEdit: boolean;
}

const TreeCont: React.FC<ITreeCont> = props => {
  const { isMain, isEdit, first_id, second_id } = props;

  return (
    <div className={`${styles.treecont} ScrollBar`}>
      {isMain && (isEdit ? <TreeContMainEdit /> : <TreeContMain />)}
      {!isMain &&
        (isEdit ? (
          <TreeContEdit first_id={first_id} second_id={second_id} />
        ) : (
          <TreeContShow first_id={first_id} second_id={second_id} />
        ))}
    </div>
  );
};

export default TreeCont;
