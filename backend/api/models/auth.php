<?php

class Auth
{
    private $conn;
    public function errorFields($message,  $error, $code)
    {
        header('Content-Type: application/json'); // Set header to JSON

        $response = [
            'success' => false,
            'message' => $message,
            'errors' => $error,
            'statusCode' => $code,
        ];
        // http_response_code($code);
        echo json_encode($response);
        exit;
    }
    public function success($message, $result = [], $code = 200)
    {
        header('Content-Type: application/json'); // Set header to JSON
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $result
        ];
        http_response_code($code);
        echo json_encode($response);
        exit;
    }

    public function error($message, $code)
    {
        header('Content-Type: application/json'); // Set header to JSON

        $response = [
            'success' => false,
            'message' => $message,
            'statusCode' => $code,
        ];
        // http_response_code($code);
        echo json_encode($response);
        exit;
    }

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    private function uploadFile($file)
    {
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newFileName = uniqid('file_', true) . '.' . $fileExtension;
        $uploadDir = '../uploads/';

        if ($file['error'] !== 0) {
            return null; // ถ้ามีข้อผิดพลาดในการอัปโหลด
        }


        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $uploadFilePath = $uploadDir . $newFileName;
        move_uploaded_file($file['tmp_name'], $uploadFilePath);

        return $newFileName;
    }

    private function validate($fields)
    {
        $errors = [];
        foreach ($fields as $field) {
            if (empty($_POST[$field])) {
                $errors[] = ["field" => $field, "message" => "$field is required"];
            }
        }

        if ($errors) {
            $this->errorFields("All fields are required", $errors, 400);
        }
    }

    private function formatData($fields, $id = null)
    {
        foreach ($fields as $field) {
            $data[$field] = $_POST[$field] ?? null; // ตรวจสอบและดึงค่าจาก $_POST
        }
        !empty($id) ?? $data['id'] = $id;
        return $data;
    }

    function generateApiKey($length = 32)
    {
        $prefix = 'PJV||';
        $key = bin2hex(random_bytes((int)(($length - strlen($prefix)) / 2)));
        return $prefix . $key;
    }

    public function login()
    {
        try {

            $fields = ["username", "password"];
            $this->validate($fields);
            $data = $this->formatData($fields);

            $sql = "SELECT * FROM users WHERE username = :username AND password = :password";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($data);
            if ($stmt->rowCount() < 1) {
                $this->success("username or password invaild!!");
            }
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            unset($user['password']);

            // สร้าง API key ใหม่และบันทึกลงในฐานข้อมูล
            $apiKey = $this->generateApiKey();
            // $expirationDate = date('Y-m-d H:i:s', strtotime('+1 hour')); // เพิ่มเวลา 1 ชั่วโมง
            $expirationDate = date('Y-m-d H:i:s', strtotime('+8 hours 30 minutes')); // เพิ่มเวลา 2 ชั่วโมง 30 นาที

            $query = $this->conn->prepare("
             INSERT INTO api_keys (`token`, `status`, `expiration_date`,`user_id`) 
             VALUES (:token, 'active', :expiration_date, :user_id)
         ");
            $query->bindParam(':token', $apiKey);
            $query->bindParam(':expiration_date', $expirationDate);
            $query->bindParam(':user_id', $user['id']);
            $query->execute();

            // เพิ่ม API key ลงในข้อมูลผู้ใช้
            $user['token'] = $apiKey;
            // เพิ่ม API key ลงในข้อมูลผู้ใช้
            $user['time_api'] = $expirationDate;
            $this->success("Login success fully!", $user);
        } catch (PDOException $e) {
            $this->error("Server error : {$e}", 500);
        }
    }

    public function user()
    {
        try {
            $headers = getallheaders();

            if (!isset($headers['X-Auth-Token'])) {

                http_response_code(401);
                echo json_encode([
                    "status" => "error",
                    "message" => "X-Auth-Token header is missing."
                ]);
                exit();
            }

            $authHeader = $headers['X-Auth-Token'];
            if (strpos($authHeader, 'Bearer ') !== 0) {
                http_response_code(401);
                echo json_encode(["status" => "error", "message" => "Invalid X-Auth-Token format."]);
                exit();
            }

            // ดึง API key จาก X-Auth-Token Header
            $api_key = substr($authHeader, 7);

            // ค้นหา API key ในฐานข้อมูล
            $query = $this->conn->prepare("
                SELECT * 
                FROM api_keys 
                WHERE `token` = :token AND `status` = 'active'
            ");
            $query->bindParam(':token', $api_key);
            $query->execute();

            $apiKeyData = $query->fetch(PDO::FETCH_ASSOC);

            if (!$apiKeyData) {
                http_response_code(401);
                echo json_encode(["status" => "expired", "message" => "Token has expired."]);
                exit();
            }

            // ตรวจสอบว่า Token หมดอายุหรือยัง
            $currentDate = date('Y-m-d H:i:s');
            if ($currentDate > $apiKeyData['expiration_date']) {
                // อัปเดตสถานะของ Token เป็น expired
                $updateStatus = $this->conn->prepare("
                    UPDATE api_keys 
                    SET `status` = 'expired' 
                    WHERE `token` = :token
                ");
                $updateStatus->bindParam(':token', $api_key);
                $updateStatus->execute();

                http_response_code(401);
                echo json_encode(["status" => "expired", "message" => "Token has expired."]);
                exit();
            }

            $stmt = $this->conn->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->execute([
                "id" => $apiKeyData['user_id']
            ]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            unset($user['password']);
            $this->success("User data login", $user);
        } catch (PDOException $e) {

            $this->error("Server error : {$e}", 500);
        }
    }
}
