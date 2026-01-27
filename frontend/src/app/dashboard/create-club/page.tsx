'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PlusIcon, ImageIcon, Cross2Icon } from '@radix-ui/react-icons';

export default function CreateClubPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clubName: '',
    description: '',
    coordinatorName: '',
    mentorName: '',
    clubPhoto: null as File | null,
    oldEventsPhotos: [] as File[],
  });
  const [clubPhotoPreview, setClubPhotoPreview] = useState<string>('');
  const [eventPhotoPreviews, setEventPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClubPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, clubPhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setClubPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxPhotos = 5;
    const currentCount = formData.oldEventsPhotos.length;
    const availableSlots = maxPhotos - currentCount;
    const filesToAdd = files.slice(0, availableSlots);

    if (filesToAdd.length > 0) {
      setFormData((prev) => ({
        ...prev,
        oldEventsPhotos: [...prev.oldEventsPhotos, ...filesToAdd],
      }));

      // Create previews
      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEventPhotoPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeEventPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      oldEventsPhotos: prev.oldEventsPhotos.filter((_, i) => i !== index),
    }));
    setEventPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file uploads
      const submitData = new FormData();
      submitData.append('name', formData.clubName);
      submitData.append('description', formData.description);
      submitData.append('coordinatorName', formData.coordinatorName);
      submitData.append('mentorName', formData.mentorName);
      submitData.append('category', 'Other');
      
      // Add club photo
      if (formData.clubPhoto) {
        submitData.append('clubPhoto', formData.clubPhoto);
      }
      
      // Add event photos
      formData.oldEventsPhotos.forEach((file) => {
        submitData.append('eventPhotos', file);
      });

      const response = await fetch('http://localhost:5000/api/clubs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create club');
      }

      const result = await response.json();
      alert('Club created successfully! It is now pending approval from faculty.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to create club:', error);
      setError(error.message || 'Failed to create club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Club</h1>
          <p className="text-muted-text">
            Fill in the details to create a new club. Your request will be sent for faculty approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Club Name */}
          <div>
            <label htmlFor="clubName" className="block text-sm font-medium mb-2">
              Club Name *
            </label>
            <input
              id="clubName"
              name="clubName"
              type="text"
              value={formData.clubName}
              onChange={handleChange}
              placeholder="e.g., Coding Club, Art Society"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Club Photo */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Club Photo *
            </label>
            <div className="space-y-3">
              {clubPhotoPreview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                  <img
                    src={clubPhotoPreview}
                    alt="Club preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, clubPhoto: null }));
                      setClubPhotoPreview('');
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Cross2Icon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <ImageIcon className="w-12 h-12 text-muted-text mb-2" />
                  <span className="text-sm text-muted-text">Click to upload club photo</span>
                  <span className="text-xs text-muted-text mt-1">PNG, JPG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleClubPhotoChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Club Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the club's mission, activities, and what members will gain..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          {/* Coordinator Name */}
          <div>
            <label htmlFor="coordinatorName" className="block text-sm font-medium mb-2">
              Coordinator Name *
            </label>
            <input
              id="coordinatorName"
              name="coordinatorName"
              type="text"
              value={formData.coordinatorName}
              onChange={handleChange}
              placeholder="Your name as club coordinator"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Mentor Name */}
          <div>
            <label htmlFor="mentorName" className="block text-sm font-medium mb-2">
              Faculty Mentor Name *
            </label>
            <input
              id="mentorName"
              name="mentorName"
              type="text"
              value={formData.mentorName}
              onChange={handleChange}
              placeholder="Faculty member who will mentor this club"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Old Events Photos */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Previous Events Photos (Optional, 3-5 photos)
            </label>
            <p className="text-xs text-muted-text mb-3">
              Upload photos from past events to showcase your club's activities
            </p>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {eventPhotoPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img
                    src={preview}
                    alt={`Event ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeEventPhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Cross2Icon className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add More Button */}
              {formData.oldEventsPhotos.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <PlusIcon className="w-8 h-8 text-muted-text mb-1" />
                  <span className="text-xs text-muted-text">Add Photo</span>
                  <span className="text-xs text-muted-text">
                    ({formData.oldEventsPhotos.length}/5)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEventPhotosChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {formData.oldEventsPhotos.length >= 3 && formData.oldEventsPhotos.length < 5 && (
              <p className="text-xs text-green-600 dark:text-green-400">
                ✓ Good! You can add {5 - formData.oldEventsPhotos.length} more photo(s)
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5" />
              {loading ? 'Creating Club...' : 'Create Club'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
