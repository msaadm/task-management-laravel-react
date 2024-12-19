<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskListShare\StoreRequest;
use App\Http\Requests\TaskListShare\UpdateRequest;
use App\Models\TaskList;
use App\Models\TaskListShare;
use App\Models\User;
use App\Traits\APIResponseMessages;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TaskListShareController extends Controller
{
    use APIResponseMessages;

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request, TaskList $taskList): JsonResponse
    {
        Gate::authorize('share', $taskList);

        $user = User::where('username', $request->username)->first();

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        // Prevent sharing with the owner
        if ($user->id === $taskList->user_id) {
            return $this->errorResponse('Cannot share task list with yourself', [], 422);
        }

        if ($taskList->isSharedWith($user)) {
            return $this->errorResponse('Task list is already shared with this user', [], 422);
        }

        $taskListShare = new TaskListShare();
        $taskListShare->task_list_id = $taskList->id;
        $taskListShare->user_id = $user->id;
        $taskListShare->permission = $request->permission ?? 'view';
        $taskListShare->save();

        return $this->createdResponse(null, 'Task list shared successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, TaskList $taskList, User $user): JsonResponse
    {
        Gate::authorize('share', $taskList);

        if ($user->id === $taskList->user_id) {
            return $this->errorResponse('Cannot modify sharing settings for the owner', [], 422);
        }

        if (!$taskList->isSharedWith($user)) {
            return $this->errorResponse('Task list is not shared with this user', [], 422);
        }

        $taskListShare = TaskListShare::where([
            'task_list_id' => $taskList->id,
            'user_id' => $user->id
        ])->first();

        $taskListShare->update([
            'permission' => $request->permission
        ]);

        return $this->successResponse(null, 'Permission updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskList $taskList, User $user): JsonResponse
    {
        Gate::authorize('share', $taskList);

        if ($user->id === $taskList->user_id) {
            return $this->errorResponse('Cannot remove sharing settings for the owner', [], 422);
        }

        if (!$taskList->isSharedWith($user)) {
            return $this->errorResponse('Task list is not shared with this user', [], 422);
        }

        $taskListShare = TaskListShare::where([
            'task_list_id' => $taskList->id,
            'user_id' => $user->id,
        ])->first();

        if ($taskListShare) {
            $taskListShare->delete();
            return $this->noContentResponse('Task list sharing removed successfully');
        }

        return $this->errorResponse('Task list is not shared with this user', [], 422);
    }
}
