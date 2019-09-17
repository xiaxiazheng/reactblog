import React from 'react';
import { withRouter, match } from 'react-router';
import { Location, History } from 'history';

interface PropsType {
  match: match;
  location: Location;
  history: History;
};

const Admin: React.FC<PropsType> = () => {

  return (
    <div className="Admin">
      我是控制台主页
    </div>
  );
};

export default withRouter(Admin);