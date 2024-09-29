create table `users` (
	`usr_id` int not null auto_increment,
    `usr_age` int default '0',
    `usr_status` int default '0',
    `usr_name` varchar(255) collate utf8mb4_bin default null,
    `usr_email` varchar(128) collate utf8mb4_bin default null,
    `usr_address` varchar(128) collate utf8mb4_bin default null,
    
    -- key index
    primary key(`usr_id`),
    key `idx_email_age_name` (`usr_email`,`usr_age` ,`usr_name`),
    key `idx_status` (`usr_status`)
) engine=InnoDB auto_increment=4 default charset=utf8mb4 collate utf8mb4_bin;

INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address ) VALUES (1, 36, 1, 'Messi', 'messi@phatnv.com', '137, HCM city' );
INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address ) VALUES (2, 37, 0, 'Ronaldo', 'Ronaldo@phatnv.com', '138, HCM city' );
INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address ) VALUES (3, 38, 1, 'phatnv', 'phatnv@phatnv.com', '139, HCM city' );

select version();

explain select * from users where usr_id=1;

-- index = idx_email_age_name: phải có key bên trái ngoài cùng thì mới sử dụng được index này còn khong thì sẽ duyệt qua toàn bản
-- có dùng
EXPLAIN select * from users where usr_email = 'messi@phatnv.com';
EXPLAIN select * from users where usr_email = 'messi@phatnv.com' AND usr_age=36;
EXPLAIN select * from users where usr_email = 'messi@phatnv.com' AND usr_age=36 AND usr_name='Messi';
-- khong dùng index này
EXPLAIN select * from users where usr_age=36;
EXPLAIN select * from users where usr_name='Messi';
EXPLAIN select * from users where usr_age=36 AND usr_name='Messi';

-- select * thì khong. Nhưng select 1 column chứa trong indx thì có
EXPLAIN select usr_age  from users where usr_age=36;

-- not tính toán trên hàm index primary
EXPLAIN select * from users where usr_id+1 = 2;

-- index = idx_status

-- LIKE %: khong dùng like '%messi' % của bên trái ngoài cùng
EXPLAIN select * from users where usr_email like 'messi%tnv.co'; 

-- OR: nếu chỉ cần một mệnh đề or dùng field không đánh chỉ mục thì toàn bộ những field trước coi như bỏ 
EXPLAIN select * from users where usr_id = 1 OR usr_status=0 or usr_address='abc';
