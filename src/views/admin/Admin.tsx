import React, { useEffect } from 'react';
import { withRouter, match } from 'react-router';

interface PropsType {
  match: match;
};

const Admin: React.FC<PropsType> = ({ match }) => {
  
  useEffect(() => {
    console.log(match);
    console.log("控制台首页检查是否有登录");
  }, [match]);

  return (
    <div className="Admin">
      我是控制台主页
    </div>
  );
};

export default withRouter(Admin);