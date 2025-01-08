

<?php

require_once "response.php";
require_once "condb.php";
header('Content-Type: application/json'); // Set header to JSON

// เพิ่ม Header CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
date_default_timezone_set('Asia/Bangkok');
$data = json_decode(file_get_contents("php://input"), true);
$response = new Response();

// จัดการกับ preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// // ดึง Header X-Auth-Token
// $headers = getallheaders();

// if (!isset($headers['X-Auth-Token'])) {

//     http_response_code(401);
//     echo json_encode([
//         "status" => "error",
//         "message" => "X-Auth-Token header is missing."
//     ]);
//     exit();
// }

// $authHeader = $headers['X-Auth-Token'];
// if (strpos($authHeader, 'Bearer ') !== 0) {
//     http_response_code(401);
//     echo json_encode(["status" => "error", "message" => "Invalid X-Auth-Token format."]);
//     exit();
// }

// // ดึง API key จาก X-Auth-Token Header
// $api_key = substr($authHeader, 7);

// // ค้นหา API key ในฐานข้อมูล
// $query = $conn->prepare("
//     SELECT * 
//     FROM api_keys 
//     WHERE `token` = :token AND `status` = 'active'
// ");
// $query->bindParam(':token', $api_key);
// $query->execute();

// $apiKeyData = $query->fetch(PDO::FETCH_ASSOC);

// if (!$apiKeyData) {
//     http_response_code(401);
//     echo json_encode(["status" => "expired", "message" => "Token has expired."]);
//     exit();
// }

// // ตรวจสอบว่า Token หมดอายุหรือยัง
// $currentDate = date('Y-m-d H:i:s');
// if ($currentDate > $apiKeyData['expiration_date']) {
//     // อัปเดตสถานะของ Token เป็น expired
//     $updateStatus = $conn->prepare("
//         UPDATE api_keys 
//         SET `status` = 'expired' 
//         WHERE `token` = :token
//     ");
//     $updateStatus->bindParam(':token', $api_key);
//     $updateStatus->execute();

//     http_response_code(401);
//     echo json_encode(["status" => "expired", "message" => "Token has expired."]);
//     exit();
// }
