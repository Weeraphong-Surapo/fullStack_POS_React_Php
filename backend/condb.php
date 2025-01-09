<?php
function connectDatabase($dbOption)
{
    // ตรวจสอบตัวเลือกที่เลือก
    if ($dbOption === 'icandefine') {
        $dbname = 'mysql:dbname=;host=';
        $username = '';
        $password = '';
    } elseif ($dbOption === 'addpaycrypto') {
        $dbname = 'mysql:dbname=ecommerce_php_api;port:8889;host=localhost';
        $username = 'root';
        $password = 'root';
    } else {
        throw new Exception("ไม่พบตัวเลือกฐานข้อมูล");
    }

    try {
        $conn = new PDO($dbname, $username, $password);
        // echo "เชื่อมต่อฐานข้อมูลสำเร็จ: $dbOption";
        return $conn;
    } catch (PDOException $e) {
        echo "ข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล: " . $e->getMessage();
        return null;
    }
}

// เรียกใช้ฟังก์ชันและระบุตัวเลือกฐานข้อมูล
$dbOption = 'addpaycrypto';
$conn = connectDatabase($dbOption);
