syntax create container mysql with image mysql:latest + env: mysql_root_password=passroot and max_connections=1000
on port 3306 -> 3306 in container
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=passroot -d mysql:latest --max_connections=1000

access bash mysql
docker exec -it mysql bash
-> mysql -uroot -ppassroot (login to user root with passroot)
-> show databases;
-> create user 'phatnv'@'%' identified by '123456';
-> create database shopDEV;

-> grant all privileges on shopDEV.\* to 'phatnv'@'%' ;
-> flush privileges;
-> use shopDEV;
-> show tables;
-> create table users(id INT, name VARCHAR(50), age iNT);
-> insert into users (id, name, age) values (1, "phatnv", 21);

System Master / Slave
When Master has events -> push to log_bin -> push to Slave
Benefit: prevent deadlog -> reduce traffic. Because we write in Master and read in Slave

Create network:
Benefit:
-> when docker manage distribute api address in custome network, it receive ip address automatelly instead of we have to manual assignment => Simplify deployment and expansion
-> provides a network that isolates containers. => helps with security
docker network create my_master_slave_mysql
