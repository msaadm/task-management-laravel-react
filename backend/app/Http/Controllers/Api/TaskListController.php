<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskList\StoreRequest;
use App\Http\Resources\TaskListResource;
use App\Models\TaskList;
use App\Traits\APIResponseMessages;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaskListController extends Controller
{
    use APIResponseMessages;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $taskLists = $request->user()->taskLists()
            ->withCount('tasks')
            ->with(['tasks', 'sharedUsers'])
            ->get();
        return $this->successResponse(TaskListResource::collection($taskLists));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): JsonResponse
    {
        $taskList = new TaskList();
        $taskList->name = $request->name;
        $taskList->user_id = $request->user()->id;
        $taskList->save();

        return $this->createdResponse(new TaskListResource($taskList), 'Task list created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(TaskList $taskList): JsonResponse
    {
        Gate::authorize('view', $taskList);
        return $this->successResponse(new TaskListResource($taskList->load(['sharedUsers'])));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreRequest $request, TaskList $taskList): JsonResponse
    {
        Gate::authorize('update', $taskList);
        
        $taskList->name = $request->name;
        $taskList->save();

        return $this->successResponse(new TaskListResource($taskList), 'Task list updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskList $taskList): JsonResponse
    {
        Gate::authorize('delete', $taskList);
        
        $taskList->delete();
        
        return $this->noContentResponse('Task list deleted successfully');
    }

    /**
     * Get task lists shared with the authenticated user.
     */
    public function sharedWithMe(Request $request): JsonResponse
    {
        $taskLists = $request->user()->sharedTaskLists()
            ->withCount('tasks')
            ->with(['tasks', 'user:id,username'])
            ->get();

        return $this->successResponse(TaskListResource::collection($taskLists));
    }

    /**
     * Get task list statistics for the authenticated user.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Get personal task lists
        $personalTaskLists = $user->taskLists()->with('tasks')->get();
        $personalStats = [
            'totalTaskLists' => $personalTaskLists->count(),
            'totalTasks' => $personalTaskLists->sum(fn($list) => $list->tasks->count()),
            'completedTasks' => $personalTaskLists->sum(fn($list) => $list->tasks->where('is_completed', true)->count()),
        ];

        // Get shared task lists
        $sharedTaskLists = $user->sharedTaskLists()->with('tasks')->get();
        $sharedStats = [
            'totalSharedLists' => $sharedTaskLists->count(),
            'totalSharedTasks' => $sharedTaskLists->sum(fn($list) => $list->tasks->count()),
            'completedSharedTasks' => $sharedTaskLists->sum(fn($list) => $list->tasks->where('is_completed', true)->count()),
        ];

        return $this->successResponse([
            'totalTaskLists' => $personalStats['totalTaskLists'] + $sharedStats['totalSharedLists'],
            'totalTasks' => $personalStats['totalTasks'] + $sharedStats['totalSharedTasks'],
            'completedTasks' => $personalStats['completedTasks'] + $sharedStats['completedSharedTasks'],
            'personal' => $personalStats,
            'shared' => $sharedStats,
        ]);
    }
}
