yarn build

cd ../blog-deploy

git pull

rm -rf *

cp -r ../reactblog/build/* ./

git add .

git commit -m "feat: 更新前端代码"

git push

exec /bin/bash