import React, { useEffect, useContext } from 'react';
import { withRouter, match } from 'react-router';
import { History } from 'history';

const Admin: React.FC = () => {

  return (
    <div className="Admin">
      我是控制台主页
    </div>
  );
};

export default withRouter(Admin);