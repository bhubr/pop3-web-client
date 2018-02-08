create database nodejs_pop3_webmail character set utf8mb4 collate utf8mb4_unicode_ci;
grant all privileges on nodejs_pop3_webmail.* to 'nodejs'@'localhost';
flush privileges;


CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
