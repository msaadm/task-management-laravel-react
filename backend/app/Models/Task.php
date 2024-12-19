<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\TaskList;

class Task extends Model
{
    use HasFactory;

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }
}
