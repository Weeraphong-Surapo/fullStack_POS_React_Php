<?php
require_once "../Header.php";
require_once "models/product.php";
require_once "models/category.php";
require_once "models/order.php";
require_once "models/auth.php";
require_once "models/report.php";

$response = new Response();
$product = new Product($conn);
$category = new Category($conn);
$order = new Order($conn);
$user = new Auth($conn);
$report = new Report($conn);

$requestMethod = $_SERVER['REQUEST_METHOD'];
$service = $_GET['service'] ?? ''; // Read 'service' parameter
$id = $_GET['id'] ?? null; // Read 'id' parameter (if any)

if (empty($service)) {
    $response->error("Parameter 'service' is required", 400);
}

switch ($service) {
    case "products":
        handleProductRequest($product, $id, $requestMethod, $response);
        break;
    case "categorys":
        handleCategoryRequest($category, $id, $requestMethod, $response);
        break;
    case "orders":
        handleOrderRequest($order, $id, $requestMethod, $response);
        break;
    case "auth":
        handleAuthRequest($user, $id, $requestMethod, $response, $service);
        break;
    case "report":
        handleReportRequest($report, $id, $requestMethod, $response);
        break;
    default:
        $response->error("Invalid service specified", 404);
        break;
}

// Handle Products Requests
function handleProductRequest($product, $id, $requestMethod, $response)
{
    if ($id) {
        switch ($requestMethod) {
            case 'GET': // Read One Product
                $product->readProduct($id);
                break;
            case 'POST': // Update Product
                $product->updateProduct($id);
                break;
            case 'DELETE': // Delete Product
                $product->deleteProduct($id);
                break;
            default:
                $response->error("Method not allowed", 405);
                break;
        }
    } else {
        switch ($requestMethod) {
            case 'GET': // Read All Products
                $product->allProducts();
                break;
            case 'POST': // Create Product
                $product->createProduct();
                break;
            default:
                $response->error("Method not allowed", 405);
                break;
        }
    }
}

// Handle Categories Requests
function handleCategoryRequest($category, $id, $requestMethod, $response)
{
    if ($id) {
        switch ($requestMethod) {
            case 'GET': // Read One Category
                $category->readCategory($id);
                break;
            case 'DELETE': // Delete Category
                $category->deleteCategory($id);
                break;
            case 'POST': // Update Category
                $category->updateCategory($id);
                break;
            default:
                $response->error("Method not allowed", 405);
                break;
        }
    } else {
        switch ($requestMethod) {
            case 'GET': // Read All Categories
                $category->allCategory();
                break;
            case 'POST': // Create Category
                $category->createCategory();
                break;
            default:
                $response->error("Method not allowed", 405);
                break;
        }
    }
}

function handleOrderRequest($order, $id, $requestMethod, $response)
{
    if ($id) {
        switch ($requestMethod) {
            case "GET":
                $order->readOrder($id);
                break;
            case "POST":
                $order->updateOrder($id);
                break;
            case "DELETE":
                $order->deleteOrder($id);
                break;
            default:
                $response->error("Method not allowed", 405);
                break;
        }
    } else {
        switch ($requestMethod) {
            case "POST":
                $order->createOrder();
                break;
            case "GET":
                $order->allOrder();
                break;
            default:
                $response->error("Method not allowed", 405);
                break;
        }
    }
}


function handleAuthRequest($user, $id, $requestMethod, $response, $service)
{
    switch ($requestMethod) {
        case "POST":
            $user->login();
            break;
        case "GET":
            $user->user();
            break;
        default:
            $response->error("Method not allowed", 405);
            break;
    }
}

function handleReportRequest($report, $id, $requestMethod, $response)
{
    switch ($requestMethod) {
        case "POST":
            $report->getAllReport();
            break;
        default:
            $response->error("Method not allowed", 405);
            break;
    }
}
