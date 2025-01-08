<?php

class Category
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

    public function readCategory($id)
    {
        try {
            $sql = "SELECT * FROM categorys WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "id" => $id
            ]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$data) {
                $this->error("Category not found", 404);
            }
            $this->success("read category", $data);
        } catch (PDOException $e) {
            $this->error("Server Error : {$e}", 500);
        }
    }

    public function allCategory()
    {
        try {
            $sql = "SELECT * FROM categorys";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->success("Get All Categorys", $data);
        } catch (PDOException $e) {
            $this->error("Server Error : {$e}", 500);
        }
    }

    public function deleteCategory($id)
    {
        try {
            // Check if there are any products associated with the category
            $sql = "SELECT COUNT(*) FROM products WHERE category_id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute(['id' => $id]);
            $productCount = $stmt->fetchColumn();

            if ($productCount > 0) {
                // If there are products linked to this category, prevent deletion
                $this->error("Cannot delete category. There are products associated with this category.", 400);
            }
            $sql = "DELETE FROM categorys WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "id" => $id
            ]);
            if ($stmt->rowCount() < 1) {
                $this->error("Category not found", 404);
            }
            $this->success("Delete category successfully");
        } catch (PDOException $e) {
            $this->error("Server error : {$e}", 500);
        }
    }

    public function createCategory()
    {
        try {
            $name = $_POST['name'] ?? null;
            if (empty($name)) {
                $this->errorFields("All fields is required", [[
                    "name" => "name is required"
                ]], 400);
            }

            $sql = "INSERT INTO categorys(name) VALUES(:name)";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "name" => $name
            ]);
            $this->success("Create category successfully!");
        } catch (PDOException $e) {
            $this->error("Server Error : {$e}", 500);
        }
    }

    public function updateCategory($id)
    {
        try {
            $name = $_POST["name"] ?? null;
            if (empty($name)) {
                $this->errorFields("All fields is required", [[
                    "name" => "name is required"
                ]], 400);
            }

            $sql = "UPDATE categorys SET name = :name WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "name" => $name,
                "id" => $id
            ]);
            $this->success("Update category successfully!");
        } catch (PDOException $e) {
            $this->error("Server Error : {$e}", 500);
        }
    }
}
