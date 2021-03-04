/**
 * 监听页面元素的点击事件，并获取到组件对应的文件路径、行和列，发请求打开文件
 * 该文件在 App.tsx 中引入
 */
const run = () => {
  // 监听到 control 被按着的时候，绑定鼠标事件
  document.onkeydown = (e) => {
    // 只有在单单只按了 control 的情况下才能开启鼠标监听
    if (e.ctrlKey && e.key === 'Control') {
      document.addEventListener("mouseover", handleHover);
      document.addEventListener("click", handleClick);
    } else {
      // 这里是为了规避组合键的情况，要是有组合键点击例如 ctrl + l，只会触发两个 down 事件，不会触发 up 事件
      // 所以要在这里点了 ctrl 以外的键时撤销监听
      document.removeEventListener("mouseover", handleHover);
      document.removeEventListener("click", handleClick);
    }
  };

  // control 被松开的时候，撤销鼠标事件
  document.onkeyup = (e) => {
    if (!e.ctrlKey) {
      if (preHoverDom && document.body.contains(preHoverDom)) {
        document.body.removeChild(preHoverDom);
        // const style = preHoverDom.getAttribute("style");
        // style &&
        //   preHoverDom.setAttribute("style", `${style.replace(maskStyle, "")}`);
      }
      document.removeEventListener("mouseover", handleHover);
      document.removeEventListener("click", handleClick);
    }
  };
};

run();

let preHoverDom = false;

const getMaskStyle = (top, left, width, height) => {
  return `
    pointer-events: none;
    position: fixed;
    top: ${top}px;
    left: ${left}px;
    width: ${width}px;
    height: ${height}px;
    background-color: #e6f7ffb0;
    box-shadow: inset 0px 0px 5px #1890ff, 0px 0px 5px #1890ff;
    border-color: #1890ff;
  `;
};

function handleHover(e) {
  const dom = e.path[0];
  if (dom) {
    if (preHoverDom && document.body.contains(preHoverDom)) {
      // const style = preHoverDom.getAttribute("style");
      // style &&
      //   preHoverDom.setAttribute("style", `${style.replace(maskStyle, "")}`);
      console.log(preHoverDom);
      document.body.removeChild(preHoverDom);
    }
    const domRect = dom.getBoundingClientRect();

    // 生成文字描述
    const testDom = document.createElement("span");
    testDom.innerText = `${(
      dom.dataset.inspectorRelativePath || "undefined"
    ).replace(/\\\\/g, "/")}:${dom.dataset.inspectorLine || 0}:${
      dom.dataset.inspectorColumn || 0
    }`;
    testDom.style = `
      position: fixed;
      display: inline-block;
      top: ${
        domRect.bottom + 5 > document.body.clientHeight
          ? document.body.clientHeight - 21
          : domRect.bottom + 5
      }px;
      left: ${domRect.left}px;
      padding: 0 5px;
      border-radius: 2px;
      background-color: white;
    `;

    // 生成遮罩
    const hoverDom = document.createElement("div");
    hoverDom.setAttribute(
      "style",
      getMaskStyle(domRect.top, domRect.left, domRect.width, domRect.height)
    );
    hoverDom.appendChild(testDom);
    document.body.appendChild(hoverDom);

    preHoverDom = hoverDom;
    // const style = dom.getAttribute("style");
    // dom.setAttribute("style", `${style || ""}${maskStyle}`);
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
    console.dir(e.path[0]);
    const data = e.path[0]["dataset"];
    // instance.get(`?path=${e.path[0]['dataset']['inspectorRelativePath']}`).then((data) => { console.log(data) })
    fetch(
      `/__open_in_editor?path=${data["inspectorRelativePath"]}&line=${data["inspectorLine"]}&col=${data["inspectorColumn"]}`
    );
  }
}
