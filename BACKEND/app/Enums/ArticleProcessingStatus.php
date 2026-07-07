<?php

namespace App\Enums;

enum ArticleProcessingStatus: string
{
    case Received = 'received';
    case Processing = 'processing';
    case Ready = 'ready';
    case Failed = 'failed';
}
