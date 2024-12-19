<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\ReorderRequest;
use App\Http\Requests\Task\StoreRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\TaskList;
use App\Traits\APIResponseMessages;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    use APIResponseMessages;

    /**
     * Display a listing of the resource.
     */
    public function index(TaskList $taskList): JsonResponse
    {
        Gate::authorize('view', $taskList);

        $tasks = $taskList->tasks()->with('taskList')->get();
        return $this->successResponse(
            TaskResource::collection($tasks),
            'Tasks retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request, TaskList $taskList): JsonResponse
    {
        Gate::authorize('update', $taskList);

        $task = new Task();
        $task->title = $request->title;
        $task->order = $request->order ?? 1;
        $task->task_list_id = $taskList->id;
        $task->is_completed = false;
        $task->save();

        return $this->createdResponse(
            new TaskResource($task),
            'Task created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task): JsonResponse
    {
        Gate::authorize('view', $task->taskList);

        return $this->successResponse(
            new TaskResource($task),
            'Task retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreRequest $request, Task $task): JsonResponse
    {
        Gate::authorize('update', $task->taskList);

        $task->title = $request->title ?? $task->title;
        $task->order = $request->order ?? $task->order;
        $task->save();

        return $this->successResponse(
            new TaskResource($task),
            'Task updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task): JsonResponse
    {
        Gate::authorize('update', $task->taskList);

        $task->delete();

        return $this->noContentResponse('Task deleted successfully');
    }

    /**
     * Toggle the completion status of the specified resource.
     */
    public function toggleComplete(Task $task): JsonResponse
    {
        Gate::authorize('update', $task->taskList);

        $task->is_completed = !$task->is_completed;
        $task->save();

        return $this->successResponse(
            new TaskResource($task),
            'Task completion status updated successfully'
        );
    }

    /**
     * Reorder tasks in a list
     */
    public function reorder(ReorderRequest $request, TaskList $taskList): JsonResponse
    {
        Gate::authorize('update', $taskList);

        try {
            DB::beginTransaction();

            // Get the validated task IDs in their new order
            $taskIds = $request->input('tasks');

            // Update the order of each task
            foreach ($taskIds as $index => $taskId) {
                Task::where('id', $taskId)
                    ->where('task_list_id', $taskList->id)
                    ->update(['order' => $index]);
            }

            DB::commit();

            return $this->successResponse(
                data: null,
                message: 'Tasks reordered successfully'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse(
                message: 'Failed to reorder tasks',
                errors: [$e->getMessage()]
            );
        }
    }
}
