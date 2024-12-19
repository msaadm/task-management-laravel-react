<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskListController;
use App\Http\Controllers\Api\TaskListShareController;
use App\Http\Controllers\Auth\AuthController;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Task Lists
    Route::apiResource('task-lists', TaskListController::class);
    Route::get('task-lists/shared/with-me', [TaskListController::class, 'sharedWithMe']);
    Route::get('task-lists/stats/all', [TaskListController::class, 'stats']);
    
    // Tasks
    Route::get('task-lists/{taskList}/tasks', [TaskController::class, 'index']);
    Route::post('task-lists/{taskList}/tasks', [TaskController::class, 'store']);
    Route::get('tasks/{task}', [TaskController::class, 'show']);
    Route::put('tasks/{task}', [TaskController::class, 'update']);
    Route::delete('tasks/{task}', [TaskController::class, 'destroy']);
    Route::patch('tasks/{task}/toggle-complete', [TaskController::class, 'toggleComplete']);
    Route::post('task-lists/{taskList}/reorder', [TaskController::class, 'reorder']);
    
    // Sharing
    Route::post('task-lists/{taskList}/share', [TaskListShareController::class, 'store']);
    Route::get('task-lists/{taskList}/shared-users', [TaskListShareController::class, 'getSharedUsers']);
    Route::put('task-lists/{taskList}/share/{user}', [TaskListShareController::class, 'update']);
    Route::delete('task-lists/{taskList}/share/{user}', [TaskListShareController::class, 'destroy']);
});
