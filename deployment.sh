# Deploy Backend from Local to Cloud
version=4.3

backend_run_path=/home/project/api
mv ${backend_code_path}/common-api/target/common-api-$version.jar ${backend_run_path}
mv ${backend_code_path}/buyer-api/target/buyer-api-$version.jar ${backend_run_path}
mv ${backend_code_path}/consumer/target/consumer-$version.jar ${backend_run_path}
mv ${backend_code_path}/manager-api/target/manager-api-$version.jar ${backend_run_path}
mv ${backend_code_path}/seller-api/target/seller-api-$version.jar ${backend_run_path}
mv ${backend_code_path}/im-api/target/im-api-$version.jar ${backend_run_path}
scp -r ./weeesell/common-api/target/common-api-$version.jar root@8.209.82.119:/home/source
