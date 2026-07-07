<?php

namespace App\Enums;

enum TopicStatus: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Failed = 'failed';
}
