# yarn build

cd ../blog-deploy

git pull

rm -rf *

mkdir fe

cp -r ../reactblog/build/* ./fe/

git add .

git commit -m "feat: 更新前端代码"

echo "正在上传至 github"

git push

echo "正在将文件夹上传至服务器"

scp -r ./fe/ root@123.207.5.131:/root/myproject/blog-deploy

cd ../reactblog

zsh