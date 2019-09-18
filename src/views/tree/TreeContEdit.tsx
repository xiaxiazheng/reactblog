import React, {useState, useEffect} from 'react';
import './TreeContEdit.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';

interface PropsType {
  history: History;
  match: match<{
    first_id: string;
    second_id: string;
    third_id: string;
  }>;
  location: Location;
};

const TreeContEdit: React.FC<PropsType> = ({ match }) => {

  useEffect(() => {
    console.log(match.params.third_id);
  }, [match.params.third_id])

  return (
    <div className="treecontedit">
      编辑树详情{match.params.third_id};
    </div>
  );
}

export default withRouter(TreeContEdit);
