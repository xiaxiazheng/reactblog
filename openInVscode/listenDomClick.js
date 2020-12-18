/**
 * 监听页面元素的点击事件，并获取到组件对应的文件路径、行和列，发请求打开文件
 */
const run = () => {
  document.onkeydown = (e) => {
    if (e.key === "Control") {
      document.addEventListener("mouseover", handleHover);
      document.addEventListener("click", handleClick);
    }
  };
  document.onkeyup = (e) => {
    if (e.key === "Control") {
      if (preHoverDom) {
        const style = preHoverDom.getAttribute("style");
        style &&
          preHoverDom.setAttribute("style", `${style.replace(maskStyle, "")}`);
      }
      document.removeEventListener("mouseover", handleHover);
      document.removeEventListener("click", handleClick);
    }
  };
};
run();

let preHoverDom = false;

const maskStyle =
  "background-color: #e6f7ffb0;box-shadow: inset 0px 0px 5px #1890ff, 0px 0px 5px #1890ff;border-color: #1890ff;";

function handleHover(e) {
  const dom = e.path[0];
  if (dom) {
    if (preHoverDom) {
      const style = preHoverDom.getAttribute("style");
      style &&
        preHoverDom.setAttribute("style", `${style.replace(maskStyle, "")}`);
    }
    preHoverDom = dom;
    const style = dom.getAttribute("style");
    dom.setAttribute("style", `${style || ""}${maskStyle}`);
  }
}

// const axios = require('axios')
// const instance = axios.create({
//   baseURL: `http://localhost:8080/`
// })
function handleClick(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.path[0]) {
    console.dir(e.path[0])
    const data = e.path[0]["dataset"];
    // instance.get(`?path=${e.path[0]['dataset']['inspectorRelativePath']}`).then((data) => { console.log(data) })
    fetch(
      `/__open_in_editor?path=${data["inspectorRelativePath"]}&line=${data["inspectorLine"]}&col=${data["inspectorColumn"]}`
    );
  }
}
