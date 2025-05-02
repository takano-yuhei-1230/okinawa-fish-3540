'use client';

import { useState } from 'react';
import { Fish, ApiResponse } from '@/types/fish';

export default function FishForm() {
  const [formData, setFormData] = useState({
    name: '',
    japaneseName: '',
    classification: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    japaneseName: '',
    classification: '',
    description: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      japaneseName: '',
      classification: '',
      description: '',
    };

    // 名前のバリデーション
    if (!formData.name) {
      newErrors.name = '名前は必須です';
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = '名前は50文字以内で入力してください';
      isValid = false;
    }

    // 標準和名のバリデーション
    if (!formData.japaneseName) {
      newErrors.japaneseName = '標準和名は必須です';
      isValid = false;
    } else if (formData.japaneseName.length > 50) {
      newErrors.japaneseName = '標準和名は50文字以内で入力してください';
      isValid = false;
    }

    // 分類のバリデーション
    if (formData.classification && formData.classification.length > 50) {
      newErrors.classification = '分類は50文字以内で入力してください';
      isValid = false;
    }

    // 詳細情報のバリデーション
    if (formData.description) {
      if (formData.description.length > 200) {
        newErrors.description = '詳細情報は200文字以内で入力してください';
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('/api/fish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('データの保存に失敗しました');
        }

        const result = (await response.json()) as ApiResponse;
        if (result.success) {
          alert('データが正常に保存されました');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('データの保存中にエラーが発生しました');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const ErrorMessage = ({ message }: { message: string }) => {
    return message ? <p className='text-red-500'>{message}</p> : null;
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl mx-auto'>
      <div className='mb-4'>
        <label htmlFor='name' className='block mb-2 font-medium'>
          名前
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='w-full border p-2 rounded'
        />
        <ErrorMessage message={errors.name} />
      </div>

      <div className='mb-4'>
        <label htmlFor='japaneseName' className='block mb-2 font-medium'>
          標準和名
        </label>
        <input
          type='text'
          id='japaneseName'
          name='japaneseName'
          value={formData.japaneseName}
          onChange={handleChange}
          className='w-full border p-2 rounded'
        />
        <ErrorMessage message={errors.japaneseName} />
      </div>

      <div className='mb-6'>
        <label htmlFor='classification' className='block mb-2 font-medium'>
          分類
        </label>
        <input
          type='text'
          id='classification'
          name='classification'
          value={formData.classification}
          onChange={handleChange}
          className='w-full border p-2 rounded'
        />
        <ErrorMessage message={errors.classification} />
      </div>

      <div className='mb-6'>
        <label htmlFor='description' className='block mb-2 font-medium'>
          詳細情報
        </label>
        <textarea
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          className='w-full border p-2 rounded h-32'
        />
        <ErrorMessage message={errors.description} />
      </div>

      <div className='flex justify-end gap-4'>
        <button
          type='button'
          onClick={() => window.history.back()}
          className='px-4 py-2 border rounded hover:bg-gray-100'
        >
          戻る
        </button>
        <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
          登録
        </button>
      </div>
    </form>
  );
}
