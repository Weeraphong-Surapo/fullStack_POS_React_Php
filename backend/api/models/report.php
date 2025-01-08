<?php

class Report
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


    private function formatData($fields, $id = null)
    {
        foreach ($fields as $field) {
            $data[$field] = $_POST[$field] ?? null; // ตรวจสอบและดึงค่าจาก $_POST
        }
        !empty($id) ?? $data['id'] = $id;
        return $data;
    }

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getAllReport()
    {
        $fields = ['year', 'month'];
        $data = $this->formatData($fields);



        $topten = $this->topTenProduct($data);
        $totalPerDay = $this->totalPricePerDay($data);
        $typeSale = $this->totalTypeSale($data);
        $res = [
            "topten" => $topten,
            "totalTypeSale" => $typeSale,
            "totalPerDay" => $totalPerDay,
            "listCard" => $this->listCardProduct($data)
        ];

        $this->success("Get report", $res);
    }


    public function topTenProduct($yearAndMonth)
    {
        $queryCondition = ""; // Default: no condition
        $parameters = [];
        if (!empty($yearAndMonth['year']) && !empty($yearAndMonth['month'])) {
            $formattedMonth = sprintf("%02d", $yearAndMonth['month']); // Format month
            $formattedYearAndMonth = $yearAndMonth['year'] . '-' . $formattedMonth;

            $queryCondition = "WHERE DATE_FORMAT(order_date, '%Y-%m') = :yearAndMonth"; // Add condition
            $parameters['yearAndMonth'] = $formattedYearAndMonth; // Bind parameter
        }

        $sql = "
        SELECT 
            products.id, 
            products.name, 
            SUM(order_items.amount) as total_amount
        FROM order_items
        LEFT JOIN products ON products.id = order_items.product_id
        LEFT JOIN orders ON orders.id = order_items.id
        $queryCondition
        GROUP BY products.id, products.name
        ORDER BY total_amount DESC
        LIMIT 10
    ";

        $stmt = $this->conn->prepare($sql);

        $formattedMonth = sprintf("%02d",  $yearAndMonth['month']); // Formats as two digits

        $stmt->execute($parameters);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch the results

        return $data; // Return the top 10 products
    }

    public function totalTypeSale($yearAndMonth)
    {
        $queryCondition = ""; // Default: no condition
        $parameters = [];
        if (!empty($yearAndMonth['year']) && !empty($yearAndMonth['month'])) {
            $formattedMonth = sprintf("%02d", $yearAndMonth['month']); // Format month
            $formattedYearAndMonth = $yearAndMonth['year'] . '-' . $formattedMonth;

            $queryCondition = "AND DATE_FORMAT(order_date, '%Y-%m') = :yearAndMonth"; // Add condition
            $parameters['yearAndMonth'] = $formattedYearAndMonth; // Bind parameter
        }

        $sql = "SELECT 
        SUM(total_price) as total_price, type 
        FROM orders
        WHERE type IN ('QR CODE','CASH') 
        $queryCondition
        GROUP BY type";

        $stmt = $this->conn->prepare($sql);

        $formattedMonth = sprintf("%02d",  $yearAndMonth['month']); // Formats as two digits

        $stmt->execute($parameters);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // return $yearAndMonth = ; // Concatenation

        return $data;
    }


    public function totalPricePerDay($yearAndMonth)
    {
        $queryCondition = ""; // Default: no condition
        $parameters = [];     // Default: empty parameters array

        // Check if year and month are provided
        if (!empty($yearAndMonth['year']) && !empty($yearAndMonth['month'])) {
            $formattedMonth = sprintf("%02d", $yearAndMonth['month']); // Format month
            $formattedYearAndMonth = $yearAndMonth['year'] . '-' . $formattedMonth;

            $queryCondition = "WHERE DATE_FORMAT(order_date, '%Y-%m') = :yearAndMonth"; // Add condition
            $parameters['yearAndMonth'] = $formattedYearAndMonth; // Bind parameter
        }

        $sql = "
        SELECT 
            DATE(order_date) AS order_date, 
            SUM(total_price) AS total_amount,
            type
        FROM orders
        $queryCondition
        GROUP BY order_date,type
        ORDER BY order_date ASC
        ";
        $stmt = $this->conn->prepare($sql);

        $formattedMonth = sprintf("%02d",  $yearAndMonth['month']); // Formats as two digits

        $stmt->execute($parameters);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listCardProduct($yearAndMonth = null)
    {
        $queryCondition = ""; // Default: no condition
        $parameters = [];     // Default: empty parameters array

        // Check if year and month are provided
        if (!empty($yearAndMonth['year']) && !empty($yearAndMonth['month'])) {
            $formattedMonth = sprintf("%02d", $yearAndMonth['month']); // Format month
            $formattedYearAndMonth = $yearAndMonth['year'] . '-' . $formattedMonth;

            $queryCondition = "WHERE DATE_FORMAT(order_date, '%Y-%m') = :yearAndMonth"; // Add condition
            $parameters['yearAndMonth'] = $formattedYearAndMonth; // Bind parameter
        }

        // Query for orders data
        $prepareOrders = $this->conn->prepare("
            SELECT 
                SUM(total_cost) AS total_cost, 
                SUM(total_price) AS total_price, 
                COUNT(id) AS total_orders 
            FROM orders 
            $queryCondition
        ");
        $prepareOrders->execute($parameters);
        $ordersData = $prepareOrders->fetch(PDO::FETCH_ASSOC);

        // Query for total products
        $prepareProduct = $this->conn->prepare("SELECT COUNT(id) AS total_products FROM products");
        $prepareProduct->execute();
        $totalProducts = $prepareProduct->fetchColumn();

        // Return results as an array
        return [
            'total_cost' => $ordersData['total_cost'] ?? 0, // Default to 0 if null
            'total_price' => $ordersData['total_price'] ?? 0, // Default to 0 if null
            'total_orders' => $ordersData['total_orders'] ?? 0, // Default to 0 if null
            'total_products' => $totalProducts ?? 0 // Default to 0 if null
        ];
    }
}
