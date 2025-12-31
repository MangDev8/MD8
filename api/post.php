<?php
header("Content-Type: application/json");

$file = __DIR__ . "/../data/posts.json";

// Ambil data dari JS
$data = json_decode(file_get_contents("php://input"), true);

// Validasi
if (
    empty($data["user"]) ||
    empty($data["title"]) ||
    empty($data["content"])
) {
    echo json_encode([
        "status" => "error",
        "msg" => "Data tidak lengkap"
    ]);
    exit;
}

// Pastikan folder data ada
if (!file_exists(dirname($file))) {
    mkdir(dirname($file), 0777, true);
}

// Ambil data lama
$posts = [];
if (file_exists($file)) {
    $posts = json_decode(file_get_contents($file), true);
    if (!is_array($posts)) $posts = [];
}

// Tambah post baru
$posts[] = [
    "user"    => htmlspecialchars($data["user"]),
    "title"   => htmlspecialchars($data["title"]),
    "content" => htmlspecialchars($data["content"]),
    "image"   => $data["image"] ?? "",
    "video"   => $data["video"] ?? "",
    "time"    => time()
];

// Simpan
file_put_contents($file, json_encode($posts, JSON_PRETTY_PRINT));

echo json_encode([
    "status" => "success"
]);