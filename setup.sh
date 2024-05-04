git_package_dir=$(pwd)
version=4.3
node_version=14

# Cleanup
sudo systemctl disable nginx
sudo systemctl disable docker
sudo rm -rf /home/project >/dev/null
sudo rm -rf /home/source >/dev/null
sudo yum remove -y maven yum-utils device-mapper-persistent-data lvm2 makecache yarn

# Dependencies
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"                                                                                       
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install ${node_version}
nvm use ${node_version}
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg
sudo yum install -y maven yum-utils device-mapper-persistent-data lvm2 makecache yarn

# Initialization
mkdir -p /home/project
mkdir -p /home/source

# Middleware Docker Deplouyment
docker_code_path=/home/project/docker
sudo cp -rf ./docker ${docker_code_path}
cd ${docker_code_path}
sudo systemctl start docker
sudo docker-compose up -d
cd ${git_package_dir}

# Backend Deployment
backend_code_path=/home/project/weeesell
backend_run_path=/home/project/api
sudo cp -rf ./weeesell/ ${backend_code_path}
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
nohup java -Xmx256m -Xms128m -Xss256k -jar manager-api-$version.jar > logs/manager.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar common-api-$version.jar > logs/common.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar buyer-api-$version.jar > logs/buyer.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar consumer-$version.jar > logs/consumer.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar im-api-$version.jar > logs/im.out  &
nohup java -Xmx256m -Xms128m -Xss256k -jar seller-api-$version.jar > logs/seller.out  &
cd ${git_package_dir}

# Frontend Deployment
#代码目录
frontend_code_path=/home/source/weeesell-ui
sudo cp -rf ./weeesell-ui/ ${frontend_code_path}
cd ${frontend_code_path}/manager
sudo yarn install
sudo yarn build
cd ${frontend_code_path}/seller
sudo yarn install
sudo yarn build
cd ${frontend_code_path}/buyer
sudo yarn install
sudo yarn build
cd ${git_package_dir}

# Nginx Deployments
sudo yum install nginx
cp ./docker/nginx.conf /etc/nginx/nginx.conf
sudo cp ./ssl/* /etc/nginx/ssl/
cd /etc/nginx/ssl/
sudo chmod 600 *
sudo systemctl start nginx
cd ${git_package_dir}



