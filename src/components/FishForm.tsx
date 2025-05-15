'use client';

import { useState, useEffect } from 'react';
import { Fish, ApiResponse } from '@/types/fish';
import { useRouter } from 'next/navigation';

interface FishFormProps {
  existingFish?: Fish;
  isEditMode?: boolean;
}

// Omit id, createdAt, updatedAt from the form data type
type FishFormData = Omit<Fish, 'id' | 'createdAt' | 'updatedAt'>;

export default function FishForm({ existingFish, isEditMode = false }: FishFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FishFormData>(() => {
    if (isEditMode && existingFish) {
      return {
        name: existingFish.name,
        japaneseName: existingFish.japaneseName,
        classification: existingFish.classification,
        description: existingFish.description,
      };
    }
    return {
      name: '',
      japaneseName: '',
      classification: '',
      description: '',
    };
  });

  const [errors, setErrors] = useState<Record<keyof FishFormData, string>>({
    name: '',
    japaneseName: '',
    classification: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && existingFish) {
      setFormData({
        name: existingFish.name,
        japaneseName: existingFish.japaneseName,
        classification: existingFish.classification,
        description: existingFish.description,
      });
    } else if (!isEditMode) {
        setFormData({
            name: '',
            japaneseName: '',
            classification: '',
            description: '',
          });
    }
  }, [existingFish, isEditMode]);

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<keyof FishFormData, string> = {
      name: '',
      japaneseName: '',
      classification: '',
      description: '',
    };

    if (!formData.name) {
      newErrors.name = '名前は必須です';
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = '名前は50文字以内で入力してください';
      isValid = false;
    }

    if (!formData.japaneseName) {
      newErrors.japaneseName = '標準和名は必須です';
      isValid = false;
    } else if (formData.japaneseName.length > 50) {
      newErrors.japaneseName = '標準和名は50文字以内で入力してください';
      isValid = false;
    }

    if (formData.classification && formData.classification.length > 50) {
      newErrors.classification = '分類は50文字以内で入力してください';
      isValid = false;
    }

    if (formData.description && formData.description.length > 200) {
        newErrors.description = '詳細情報は200文字以内で入力してください';
        isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const apiUrl = isEditMode ? `/api/fish/${existingFish?.id}` : '/api/fish';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || (isEditMode ? 'データの更新に失敗しました' : 'データの保存に失敗しました'));
      }

      const result = await response.json() as ApiResponse;
      if (result.success) {
        alert(isEditMode ? 'データが正常に更新されました' : 'データが正常に保存されました');
        if (isEditMode && existingFish) {
          router.push(`/fish/${existingFish.id}`);
        } else {
          router.push('/');
        }
      } else {
        throw new Error(result.error || (isEditMode ? '更新処理中にエラーが発生しました' : '保存処理中にエラーが発生しました'));
      }
    } catch (error) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        alert(`エラーが発生しました: ${error.message}`);
      } else {
        alert(isEditMode ? 'データの更新中に不明なエラーが発生しました' : 'データの保存中に不明なエラーが発生しました');
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const ErrorMessage = ({ message }: { message: string }) => {
    return message ? <p className='text-red-500 text-sm mt-1'>{message}</p> : null;
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
        <ErrorMessage message={errors.description} />
      </div>

      <div className='flex justify-end gap-4'>
        <button
          type='button'
          onClick={() => router.back()}
          className='px-4 py-2 border rounded hover:bg-gray-100'
          disabled={isSubmitting}
        >
          戻る
        </button>
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'
          disabled={isSubmitting}
        >
          {isSubmitting ? '処理中...' : (isEditMode ? '更新' : '登録')}
        </button>
      </div>
    </form>
  );
}
