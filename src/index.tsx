import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.d';
// import Track from '@xiao-edu/track'

// const track = new Track({
//   commonData: {
//     module: 'bi',
//     project_type: 4,
//     env: 1
//   }
// })
// console.log(`track: `, track)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
