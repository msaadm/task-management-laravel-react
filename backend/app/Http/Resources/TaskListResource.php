<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'user_id' => $this->user_id,
            'owner' => $this->whenLoaded('user', function() {
                return [
                    'id' => $this->user->id,
                    'username' => $this->user->username,
                ];
            }),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'tasks_count' => $this->whenCounted('tasks'),
            'completed_tasks_count' => $this->whenLoaded('tasks', function() {
                return $this->tasks->where('is_completed', true)->count();
            }, 0),
            'shares' => $this->whenLoaded('sharedUsers', function() {
                return $this->sharedUsers->map(function($user) {
                    return [
                        'user' => [
                            'id' => $user->id,
                            'username' => $user->username,
                        ],
                        'permission' => $user->pivot->permission,
                        'created_at' => $this->created_at,
                    ];
                });
            }),
            'share_permission' => $this->when($this->pivot, function() {
                return $this->pivot->permission ?? null;
            }),
            'created_at' => $this->created_at,
        ];
    }
}
