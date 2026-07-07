<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTopicRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('data.attributes.topic_prompt')) {
            $this->merge([
                'topic_prompt' => $this->input('data.attributes.topic_prompt'),
            ]);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'topic_prompt' => ['required', 'string', 'min:3', 'max:2000'],
        ];
    }
}
