-- use shopDEV;-- 
-- create table test
CREATE TABLE test_table (
id INT NOT NULL,
name varchar(50) default null,
age int default null,
address varchar(50) default null,
PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- create table orders
CREATE TABLE orders (
	order_id INT, 							-- key hoa don
	order_date date not null,				-- ngay dat hang
	total_amount decimal(10,2),				-- tong so tien
	PRIMARY KEY(order_id, order_date)		-- pk: id, partition key: order_date
) 
-- Phân vùng với order_date (partition_key)
PARTITION BY RANGE COLUMNS (order_date) (	-- menh de de phan vung theo nam, thang, ngay
	PARTITION pO VALUES LESS THAN ('2022-01-01'), 
    PARTITION p2023 VALUES LESS THAN ('2023-01-01'),
	PARTITION p2024 VALUES LESS THAN ('2024-01-01'),
	PARTITION pmax VALUES LESS THAN (MAXVALUE)
)

-- select data
explain select * from orders; -- if not keyword order_date -> duyet all data from table orders. 

-- insert data
insert into orders(order_id, order_date, total_amount) values (1, '2021-10-10', 100.99);
insert into orders(order_id, order_date, total_amount) values (2, '2022-10-10', 100.99);
insert into orders(order_id, order_date, total_amount) values (3, '2023-10-10', 100.99);
insert into orders(order_id, order_date, total_amount) values (4, '2024-10-10', 100.99);

-- select by range 
explain select * from orders partition(p2023);  	-- chi tim trong phan vung nay

EXPLAIN SELECT * FROM orders 
WHERE order_date >='2022-01-01' AND order_date < '2025-01-01'; -- chi tim trong phan vung ung voi dieu kien cua order_date
-- Note: 
-- Cần được bảo trì thường xuyên, cập nhật ứng với xu hướng thực tế, theo thị trường,... 
-- Không dùng để cải thiện hiệu suất truy vấn db, mà thường dùng để quản lý, 

-- LEVEL HIGH (CRON JOBS (nodejs)): trigger with schedule 
 
-- Event with mysql
-- create table orders 202409
CREATE TABLE orders_202409 (
	order_id INT, 							-- key hoa don
	order_date date not null,				-- ngay dat hang
	total_amount decimal(10,2),				-- tong so tien
	PRIMARY KEY(order_id, order_date)		-- pk: id, partition key: order_date
) 

create event `create_table_auto_month_event` -- tao name event
on schedule every
	1 month -- cron job thuc thi moi thang 1 lan
starts
	'2024-09-29 09:19:09' -- bat dau sau thoi gian nay la start
on completion 
	preserve enable -- khong thuc hiện xoá bộ count thời gian
do 
	CALL create_table_auto_month();

show events;
drop event create_table_auto_month_event;
select now();