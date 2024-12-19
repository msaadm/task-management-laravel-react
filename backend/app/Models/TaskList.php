<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Task;
use App\Models\TaskListShare;

class TaskList extends Model
{
    use HasFactory;

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($taskList) {
            // Delete all shares associated with this task list
            $taskList->shares()->delete();
            
            // Delete all tasks associated with this task list
            $taskList->tasks()->delete();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class)
            ->orderBy('order')
            ->orderBy('id', 'asc');
    }

    public function shares()
    {
        return $this->hasMany(TaskListShare::class);
    }

    public function sharedUsers()
    {
        return $this->belongsToMany(User::class, 'task_list_shares')
            ->withPivot('permission')
            ->withTimestamps();
    }

    /**
     * Check if the task list is shared with a specific user
     */
    public function isSharedWith(User $user): bool
    {
        // Check if the user is the owner
        if ($this->user_id === $user->id) {
            return true;
        }

        // Check if there's a share record for this user
        return $this->shares()->where('user_id', $user->id)->exists();
    }
}
