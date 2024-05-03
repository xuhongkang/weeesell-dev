git_package_dir=$(pwd)
version=4.3

# Dependencies
sudo yum install -y git
sudo yum install -y maven
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
sudo yum makecache
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"                                                                                       
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install 20
nvm use 20
npm install --global yarn
yarn global add @vue/cli-service --save-dev
echo "export PATH=\"\$PATH:$(yarn global bin)\"" >> ~/.bashrc && source ~/.bashrc

# Initialization
mkdir -p /home/project
mkdir -p /home/source

# Middleware Deployment In Docker
docker_code_path=/home/project/docker
cp -r ./docker ${docker_code_path}
sudo systemctl start docker
sudo docker-compose up -d
cd ${git_package_dir}

# Backend Deployment
backend_code_path=/home/project/weeesell
backend_run_path=/home/project/api
cp -r ./weeesell/ ${backend_code_path}
mkdir -p ${backend_run_path}
cd ${backend_code_path}
mvn clean install -DskipTests
ps -ef |grep java |grep buyer  |grep -v 'grep'|awk '{print $2}'  | xargs kill -9
ps -ef |grep java |grep seller  |grep -v 'grep'|awk '{print $2}'  | xargs kill -9
ps -ef |grep java |grep manager  |grep -v 'grep'|awk '{print $2}'  | xargs kill -9
ps -ef |grep java |grep common  |grep -v 'grep'|awk '{print $2}'  | xargs kill -9
ps -ef |grep java |grep consumer  |grep -v 'grep'|awk '{print $2}'  | xargs kill -9
ps -ef |grep java |grep im  |grep -v 'grep'|awk '{print $2}'  | xargs kill -9
rm -rf ${backend_run_path}*.jar
mv ${backend_code_path}/common-api/target/common-api-$version.jar ${backend_run_path}
mv ${backend_code_path}/buyer-api/target/buyer-api-$version.jar ${backend_run_path}
mv ${backend_code_path}/consumer/target/consumer-$version.jar ${backend_run_path}
mv ${backend_code_path}/manager-api/target/manager-api-$version.jar ${backend_run_path}
mv ${backend_code_path}/seller-api/target/seller-api-$version.jar ${backend_run_path}
mv ${backend_code_path}/im-api/target/im-api-$version.jar ${backend_run_path}
cd ${backend_run_path}
mkdir logs
nohup java -Xmx256m -Xms128m -Xss256k -jar manager-api-$version.jar> logs/manager.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar common-api-$version.jar> logs/common.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar buyer-api-$version.jar> logs/buyer.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar consumer-$version.jar> logs/consumer.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar im-api-$version.jar> logs/im.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar seller-api-$version.jar> logs/seller.out  &
cd ${git_package_dir}

# Frontend Deployment
#代码目录
frontend_code_path=/home/source/weeesell-ui

cp -r ./weeesell-ui/ ${frontend_code_path}
cd ${frontend_code_path}/manager
yarn install
yarn build
cd ${frontend_code_path}/seller
yarn install
yarn build
cd ${frontend_code_path}/buyer
yarn install
yarn build
cd ${git_package_dir}


