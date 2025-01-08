<?php
class Product
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
    public function allProducts()
    {
        try {
            $currentURL = "http://$_SERVER[HTTP_HOST]/test_api_pp/uploads/";

            $sql = "SELECT 
            p.id,
            p.name,
            p.price,
            p.cost,
            p.sold,
            p.amount,
            p.img,
            c.id as category_id,
            c.name as category_name
            FROM products p
            LEFT JOIN categorys c ON c.id = p.category_id
            ";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response = [];
            foreach ($data as $row) {
                $response[] = [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "price" => $row['price'],
                    "sold" => $row['sold'],
                    "cost" => $row['cost'],
                    "img" => $currentURL . $row['img'],
                    "amount" => $row['amount'],
                    "category" => [
                        "id" => $row['category_id'],
                        "name" => $row['category_name']
                    ]
                ];
            }
            $this->success("Products fetched successfully", $response);
        } catch (PDOException $e) {
            $this->error("server error : {$e}", 500);
        }
    }

    public function readProduct($id)
    {
        try {
            $currentURL = "http://$_SERVER[HTTP_HOST]/test_api_pp/uploads/";

            $sql = "SELECT 
            p.id,
            p.name,
            p.price,
            p.cost,
            p.sold,
            p.amount,
            p.img,
            c.id as category_id,
            c.name as category_name
            FROM products p
            LEFT JOIN categorys c ON c.id = p.category_id
            WHERE p.id = :id
            ";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "id" => $id
            ]);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!$data) {
                $this->error("Product not found", 404);
            }
            $response = [];
            foreach ($data as $row) {
                $response = [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "price" => $row['price'],
                    "cost" => $row['cost'],
                    "img" => $currentURL . $row['img'],
                    "amount" => $row['amount'],
                    "sold" => $row['sold'],
                    "category" => [
                        "id" => $row['category_id'],
                        "name" => $row['category_name']
                    ]
                ];
            }
            $this->success("Products fetched successfully", $response);
        } catch (PDOException $e) {
            $this->error("server error : {$e}", 500);
        }
    }

    public function deleteProduct($id)
    {
        try {
            $sql = "SELECT COUNT(*) FROM order_items WHERE product_id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "id" => $id
            ]);
            $productCount = $stmt->fetchColumn();
            if ($productCount > 0) {
                $this->error("Cannot delete products. There are products associated with this order_items.", 400);
            }
            $sql = "DELETE FROM products WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "id" => $id
            ]);
            if ($stmt->rowCount() < 1) {
                $this->error("Product not found", 404);
            }
            $this->success("Products delete successfully");
        } catch (PDOException $e) {
            $this->error("Server error : {$e}", 500);
        }
    }

    public function createProduct()
    {
        try {
            $fields = ["name", "price", "cost", "amount", "category_id"];

            $this->validate($fields);

            $data = $this->formatData($fields);
            // ถ้ามีการอัปโหลดไฟล์
            if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {
                $newFileName = $this->uploadFile($_FILES['file']);
                $data['img'] = $newFileName;
            }


            $sql =   "INSERT INTO products(name, price, cost, amount, category_id" . (isset($data['img']) ? ", img" : "") . ") 
            VALUES(:name, :price, :cost, :amount, :category_id" . (isset($data['img']) ? ", :img" : "") . ")";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($data);
            $this->success("Create product successfully");
        } catch (PDOException $e) {
            $this->error("Server error : {$e}", 500);
        }
    }

    public function updateProduct($id)
    {
        try {
            // ฟังก์ชันตรวจสอบว่าฟิลด์ทั้งหมดใน $_POST ถูกกรอกหรือไม่
            $fields = ["name", "price", "cost", "amount", "category_id"];

            // function validate
            $this->validate($fields);

            // functioin format data
            $data = $this->formatData($fields, $id);

            // ถ้ามีการอัปโหลดไฟล์
            if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {
                $newFileName = $this->uploadFile($_FILES['file']);
                $data['img'] = $newFileName;
            }

            // เตรียม SQL
            $sql = "UPDATE products 
            SET name = :name, 
            price = :price, 
            cost = :cost, 
            amount = :amount, 
            category_id = :category_id"
                . (isset($data['img']) ? ", img = :img" : "")
                . " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);

            // ผนวกข้อมูลจาก POST และไฟล์ (ถ้ามี)
            $stmt->execute($data);

            $this->success("Update product successfully");
        } catch (PDOException $e) {
            $this->error("Server error : {$e}", 500);
        }
    }

    // ฟังก์ชันอัปโหลดไฟล์
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
                $errors[] = [$field => $field, "message" => "$field is required"];
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
        $id && $data['id'] = $id;
        return $data;
    }
}
