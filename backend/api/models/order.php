<?php

class Order
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
                $errors[] = [$field => "$field is required"];
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
    public function allOrder()
    {
        try {
            $sql = "SELECT 
                o.id AS order_id,
                o.order_code,
                o.total_price,
                o.total_cost,
                o.order_date,
                u.id AS user_id,
                u.username,
                u.phone,
                u.role,
                p.id AS product_id,
                p.name AS product_name,
                p.price AS product_price,
                p.cost AS product_cost,
                oi.amount
                FROM orders o
                LEFT JOIN order_items oi ON oi.order_id = o.id
                LEFT JOIN users u ON u.id = o.user_id
                LEFT JOIN products p ON p.id = oi.product_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            $orders = [];
            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $order_id = $row['order_id'];

                // Initialize the order if it doesn't already exist
                if (!isset($orders[$order_id])) {
                    $orders[$order_id] = [
                        "id" => $row['order_id'],
                        "order_code" => $row['order_code'],
                        "total_price" => $row['total_price'],
                        "total_cost" => $row['total_cost'],
                        "userSale" => [
                            "id" => $row['user_id'],
                            "username" => $row['username'],
                            "phone" => $row['phone'],
                            "role" => $row['role'],
                        ],
                        "order_date" => $row['order_date'],
                        "products" => []
                    ];
                }

                // Add product details if they exist
                if ($row['product_id']) {
                    $orders[$order_id]["products"][] = [
                        "id" => $row['product_id'],
                        "name" => $row['product_name'],
                        "price" => $row['product_price'],
                        "cost" => $row['product_cost'],
                        "amount" => $row['amount']
                    ];
                }
            }

            // Reset numeric keys for the response
            $orders = array_values($orders);

            $this->success("Get all orders", $orders);
        } catch (PDOException $e) {
            $this->error("Server error: {$e->getMessage()}", 500);
        }
    }



    public function readOrder($id)
    {
        try {
            $sql = "SELECT 
            o.id,
            o.order_code,
            o.total_price,
            o.total_cost,
            o.order_date,
            o.type,
            u.id as user_id,
            u.username,
            u.phone,
            u.role,
            p.id as product_id,
            p.name as product_name,
            p.price as product_price,
            p.cost as product_cost,
            oi.amount
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN users u ON u.id = o.user_id
            LEFT JOIN products p ON p.id = oi.product_id
            WHERE o.id = :id
            ";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "id" => $id
            ]);
            $countOrder = $stmt->fetchColumn();
            if ($countOrder < 1) {
                $this->error("Order not found", 404);
            }
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "id" => $id
            ]);

            $order = null; // Initialize the order

            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                // Initialize the order object on the first iteration
                if (!$order) {
                    $order = [
                        "id" => $row['id'],
                        "order_code" => $row['order_code'],
                        "type" => $row['type'],
                        "total_price" => $row['total_price'],
                        "total_cost" => $row['total_cost'],
                        "userSale" => [
                            "id" => $row['user_id'],
                            "username" => $row['username'],
                            "phone" => $row['phone'],
                            "role" => $row['role'],
                        ],
                        "order_date" => $row['order_date'],
                        "products" => []
                    ];
                }

                // Add product details if they exist
                if ($row['product_id']) {
                    $order["products"][] = [
                        "id" => $row['product_id'],
                        "name" => $row['product_name'],
                        "price" => $row['product_price'],
                        "cost" => $row['product_cost'],
                        "amount" => $row['amount']
                    ];
                }
            }

            if ($order) {
                $this->success("Get order details", $order);
            } else {
                $this->error("Order not found", 404);
            }
        } catch (PDOException $e) {
            $this->error("Server error : {$e}", 500);
        }
    }

    public function createOrder()
    {
        $fields = ["user_id", "order", "type"];
        $this->validate($fields);
        $data = $this->formatData($fields);
        $total_price = 0;
        $total_cost = 0;
        $date = date('Y-m-d');


        foreach (json_decode($data['order'], true) as $row) {
            // ตรวจสอบว่ามีคีย์ที่ต้องการในแต่ละ $row
            $total_price += $row['price'] * $row['quantity'] ?? 0; // ใช้ ?? เพื่อป้องกันข้อผิดพลาดหากคีย์ไม่มี
            $total_cost += $row['cost'] * $row['quantity'] ?? 0;
        }

        $sql = "INSERT INTO orders(total_price,total_cost,order_code,type,user_id,order_date)
        VALUES(:total_price,:total_cost,:order_code,:type,:user_id,:order_date)";
        $order_code = $this->generateOrderCode();
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            "total_price" => $total_price,
            "total_cost" => $total_cost,
            "order_code" => $order_code,
            "type" => $data['type'],
            "user_id" => $data['user_id'],
            "order_date" => $date
        ]);

        $insertId = $this->conn->lastInsertId();

        // กำลังจะเพิ่มการขาย sold

        foreach (json_decode($data['order'], true) as $product) {
            $sql = "INSERT INTO order_items(order_id,product_id,amount)
            VALUES(:order_id,:product_id,:amount)
            ";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "order_id" => $insertId,
                "product_id" => $product['id'],
                "amount" => $product['quantity']
            ]);
            $updateProduct = $this->conn->prepare("UPDATE products SET amount = amount - :amount, sold = sold + :qty WHERE id = :id");
            $updateProduct->execute([
                "qty" => $product['quantity'],
                "amount" => $product['quantity'],
                "id" => $product['id']
            ]);
        }
        $this->success("Create order successfully");
    }

    public function deleteOrder($id) {}


    public function generateOrderCode()
    {
        // Define a prefix for the order code
        $prefix = "ORDER";

        // Get the current timestamp
        $timestamp = time();

        // Generate a random number to ensure uniqueness
        $randomNumber = mt_rand(1000, 9999);

        // Combine all parts to form the order code
        $orderCode = $prefix  . $randomNumber;

        return $orderCode;
    }
}
