# 这个命令执行打包出来的文件是访问本地 localhost:300/api 接口的前端文件
# 方便在后台本地用 yarn start:dev，然后直接在 localhost:300 调试

yarn buildLocal

cd ../blog-deploy

git pull

rm -rf *

cp -r ../reactblog/build/* ./

exec /bin/bash