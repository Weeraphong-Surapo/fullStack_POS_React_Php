-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jan 08, 2025 at 03:45 AM
-- Server version: 8.0.35
-- PHP Version: 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_php_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_keys`
--

CREATE TABLE `api_keys` (
  `id` int NOT NULL,
  `status` enum('expired','active')  NOT NULL DEFAULT 'active',
  `token` varchar(255)  NOT NULL,
  `expiration_date` datetime NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `api_keys`
--

INSERT INTO `api_keys` (`id`, `status`, `token`, `expiration_date`, `user_id`) VALUES
(8, 'active', 'PJV||2215c5985a28c8d2046a2df8b6', '2025-01-07 19:23:10', 1),
(9, 'active', 'PJV||b2934a808d2d5152bdebd2184d', '2025-01-07 19:23:20', 1),
(10, 'active', 'PJV||5750862e440fea33815ef6cd0d', '2025-01-07 19:30:34', 1),
(11, 'active', 'PJV||decc51639e8aed2203fd7280ae', '2025-01-07 19:32:17', 1),
(12, 'active', 'PJV||d5d8d00a8c187e3659c5263b70', '2025-01-07 19:35:35', 1),
(13, 'expired', 'PJV||a0ef21a03ce730c1944cbc30f3', '2025-01-08 00:02:36', 1),
(14, 'active', 'PJV||cd385b858abbeab2c8d90f5855', '2025-01-08 17:53:25', 1);

-- --------------------------------------------------------

--
-- Table structure for table `categorys`
--

CREATE TABLE `categorys` (
  `id` int NOT NULL,
  `name` varchar(255)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categorys`
--

INSERT INTO `categorys` (`id`, `name`) VALUES
(38, 'ความงามและของใช้ส่วนตัว'),
(39, 'กลุ่มผลิตภัณฑ์เพื่อสุขภาพ'),
(40, 'เสื้อผ้าแฟชั่นผู้ชาย'),
(41, 'เสื้อผ้าแฟชั่นผู้หญิง'),
(42, 'กระเป๋า'),
(43, 'รองเท้าผู้ชาย'),
(44, 'รองเท้าผู้หญิง'),
(45, 'เครื่องประดับ'),
(46, 'นาฬิกาและแว่นตา'),
(47, 'อุปกรณ์อิเล็กทรอนิกส์');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `order_code` varchar(100)  NOT NULL,
  `total_price` int NOT NULL,
  `total_cost` int NOT NULL,
  `type` enum('CASH','QR CODE')  NOT NULL,
  `user_id` int NOT NULL,
  `order_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `total_price`, `total_cost`, `type`, `user_id`, `order_date`) VALUES
(29, 'ORDER8534', 577, 478, 'CASH', 1, '2025-01-07'),
(30, 'ORDER2285', 577, 478, 'CASH', 1, '2025-01-08'),
(31, 'ORDER1198', 69, 49, 'CASH', 1, '2025-01-09'),
(32, 'ORDER1643', 69, 49, 'QR CODE', 1, '2025-01-10'),
(33, 'ORDER3698', 69, 49, 'CASH', 1, '2025-01-11'),
(34, 'ORDER2755', 5659, 5049, 'CASH', 1, '2025-01-12'),
(35, 'ORDER3734', 5659, 5049, 'QR CODE', 1, '2025-01-13'),
(36, 'ORDER3908', 11492, 10167, 'CASH', 1, '2025-01-14'),
(37, 'ORDER9715', 312, 167, 'CASH', 1, '2025-01-15'),
(38, 'ORDER3876', 1131, 946, 'QR CODE', 1, '2025-01-16'),
(39, 'ORDER5597', 1131, 946, 'QR CODE', 1, '2025-01-07'),
(40, 'ORDER7710', 138, 99, 'CASH', 1, '2025-01-07'),
(41, 'ORDER6688', 69, 49, 'CASH', 1, '2025-01-07'),
(42, 'ORDER7806', 168, 129, 'CASH', 1, '2025-01-07'),
(43, 'ORDER8960', 529, 529, 'CASH', 1, '2025-01-07');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `amount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `amount`) VALUES
(30, 29, 22, 1),
(31, 29, 23, 1),
(32, 29, 27, 1),
(33, 29, 21, 1),
(34, 30, 22, 1),
(35, 30, 23, 1),
(36, 30, 27, 1),
(37, 30, 21, 1),
(38, 31, 22, 1),
(39, 32, 22, 1),
(40, 33, 22, 1),
(41, 34, 22, 1),
(42, 34, 25, 1),
(43, 35, 22, 1),
(44, 35, 25, 1),
(45, 36, 22, 2),
(46, 36, 25, 2),
(47, 36, 26, 1),
(48, 36, 27, 1),
(49, 37, 22, 2),
(50, 37, 26, 1),
(51, 37, 27, 1),
(52, 38, 22, 2),
(53, 38, 26, 1),
(54, 38, 27, 1),
(55, 38, 21, 1),
(56, 38, 20, 1),
(57, 38, 24, 1),
(58, 39, 22, 2),
(59, 39, 26, 1),
(60, 39, 27, 1),
(61, 39, 21, 1),
(62, 39, 20, 1),
(63, 39, 24, 1),
(64, 40, 27, 1),
(65, 40, 23, 1),
(66, 41, 22, 1),
(67, 42, 23, 1),
(68, 42, 22, 1),
(69, 43, 20, 1),
(70, 43, 21, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255)  NOT NULL,
  `price` int NOT NULL,
  `cost` int NOT NULL,
  `amount` int NOT NULL,
  `sold` int NOT NULL DEFAULT '0',
  `img` varchar(255)  NOT NULL DEFAULT 'default.png',
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `cost`, `amount`, `sold`, `img`, `category_id`) VALUES
(20, 'เฮดแอนด์โชว์เดอร์ แชมพูขจัดรังแค สูตรคูลเมนทอล 370 มล.', 159, 199, 28, 1, 'file_677caa338cd2d8.40682635.jpeg', 38),
(21, 'ออยลาตุ้ม เจนเทิล คลีนซิ่ง เฮดทูโทวอช 300 มล.', 370, 330, 31, 1, 'file_677caab5df2dc7.08775486.webp', 38),
(22, 'อินเตอร์ฟาร์มา ผลิตภัณฑ์เสริมอาหาร โปรแบค ไบโอแอคทีฟ 2 แคปซูล', 69, 49, 32, 1, 'file_677cab0b03f2e7.94943309.webp', 39),
(23, 'อินเตอร์ฟาร์มา ผลิตภัณฑ์เสริมอาหาร บราโว่ ฟิต 1 แคปซูล', 99, 80, 23, 1, 'file_677cabbe366867.19660865.webp', 39),
(24, 'เบสิโค กางเกงยีนส์ขายาว สำหรับผู้ชาย ', 290, 250, 23, 0, 'file_677cac12622aa6.85888101.webp', 40),
(25, 'กระเป๋าทรงโฮโบ', 5590, 5000, 23, 0, 'file_677cad2c8304a1.07823784.webp', 42),
(26, 'รองเท้าผ้าใบผู้หญิงสีขาว รองเท้าผ้าใบแฟชั่น', 135, 50, 23, 0, 'file_677cad5d1450f2.60509367.jpeg', 44),
(27, 'เอ็มทีอาร์ ชุดเครื่องประดับ', 39, 19, 234, 0, 'file_677cada38e1339.08268522.webp', 45),
(28, 'แว่นตากันแดด', 990, 300, 223, 0, 'file_677cade3bd00b9.76833443.jpg', 46),
(29, 'iPhone 16 Pro Max 256GB - Black Titanium', 46600, 40000, 32, 0, 'file_677cae13d68950.51072747.webp', 47);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255)  NOT NULL,
  `password` varchar(255)  NOT NULL,
  `img` varchar(255)  NOT NULL,
  `phone` varchar(20)  NOT NULL,
  `address` varchar(255)  NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `role` enum('ADMIN','USER')  NOT NULL DEFAULT 'USER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `img`, `phone`, `address`, `active`, `role`) VALUES
(1, 'big', 'big', 'big', '2323', 's32324', 1, 'ADMIN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categorys`
--
ALTER TABLE `categorys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_ibfk_1` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_keys`
--
ALTER TABLE `api_keys`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `categorys`
--
ALTER TABLE `categorys`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD CONSTRAINT `api_keys_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categorys` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
