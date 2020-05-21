// window.onload = function () {
  const Track = require("./track");
  // import * as Track from './track.js'

  // 区分环境
  const getEnv = () => {
    if (process.env.NODE_ENV === "development") {
      return process.env.NODE_ENV;
    } else {
      if (window.location.includes("localhost")) {
        return "development"; // 开发环境
      } else if (window.location.includes("test")) {
        return "test"; // 测试环境
      } else {
        return "production"; // 生产环境
      }
    }
  };

  console.log("fdlkjhflds");
  const env = getEnv();

  const track = new Track({
    env: env,
    trackUrl: "www.xxx.com/track",
    commonData: {
      trackVersion: "0.0.1",
    },
    silence: env === "development",
  });

  window.track = track;
  console.log("track", track);
// };

// export default track;
