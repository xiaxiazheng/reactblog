console.log("check byted！！！");

const fs = require('fs');

function checkByted(filename) {
    if (fs.existsSync(`./${filename}`)) {
        const data = fs.readFileSync(`./${filename}`, "utf8");
        if (data.indexOf('byted') !== -1) {
            console.log(`${filename} 包含了 byted ！！！，快删掉`);
            throw new Error('校验失败')
        }        
    } else {
        console.log(filename + ' 不存在');
    }
}

checkByted('package.json')
checkByted('package-lock.json');
checkByted('yarn.lock');

console.log('通过 byted 校验');
