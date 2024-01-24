const path = require("path");
const fs = require("fs");
const dir = path.resolve(__dirname, "../blog-deploy");
const needDeleteList = fs
    .readdirSync(dir)
    .filter((item) => item !== "fe" && !item.match(/^\./g));

needDeleteList.forEach((item) => {
    const itemPath = path.join(dir, item);
    dfsDelete(itemPath);
});

dfsCopyDir(path.join(dir, 'fe'), dir);
dfsDelete(path.join(dir, 'fe'));

function dfsDelete(p) {
    if (fs.statSync(p).isDirectory()) {
        const list = fs.readdirSync(p);
        list.forEach(item => {
          const itemPath = path.join(p, item);
          dfsDelete(itemPath);
        });
        fs.rmdirSync(p);
    } else {
        fs.rmSync(p);
    }
}

function dfsCopyDir(p, t) {
    const list = fs.readdirSync(p);
    list.forEach(item => {
      const itemPath = path.join(p, item);
      const targetItemPath = path.join(t, item);
      if (fs.statSync(itemPath).isDirectory()) {
        dfsCopyDir(itemPath, targetItemPath);
      } else {
        fs.cpSync(itemPath, targetItemPath);
      }
    });
}