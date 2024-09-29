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

docker run -d --name mysql-master --network my_master_slave_mysql -p 8811:3306 -e MYSQL_ROOT_PASSWORD=phatnv mysql:8.0
docker run -d --name mysql-slave --network my_master_slave_mysql -p 8822:3306 -e MYSQL_ROOT_PASSWORD=phatnv mysql:8.0

CHANGE MASTER TO
MASTER_HOST='172.20.0.2',
MASTER_PORT=3306,
MASTER_USER='root',
MASTER_PASSWORD='phatnv',
MASTER_LOG_FILE='mysql-bin.000001',
MASTER_LOG_POS=157,
MASTER_CONNECT_RETRY=60,
GET_MASTER_PUBLIC_KEY=1;

// create
CREATE TABLE test_table (
id INT NOT NULL,
name varchar(50) default null,
age int default null,
address varchar(50) default null,
PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// CREATE PROCEDURE
CREATE DEFINER=`phatnv'@'%` PROCEDURE `insert_data`()
BEGIN
DECLARE max_id INT DEFAULT 1000000;
DECLARE i INT DEFAULT 1;
WHILE i<=max_id DO
INSERT INTO test_table (id, name, age, address) VALUES (i, CONCAT('Name', i), i%100, CONCAT('Address', i));
SET i = i + 1;
END WHILE;
END
