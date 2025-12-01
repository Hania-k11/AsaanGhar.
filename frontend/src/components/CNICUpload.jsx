/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileImage, Loader2, CheckCircle } from 'lucide-react';

const CNICUpload = ({ onUploadSuccess, currentCnic }) => {
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [cnicFrontPreview, setCnicFrontPreview] = useState(null);
  const [cnicBackPreview, setCnicBackPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cnicNumber, setCnicNumber] = useState(currentCnic || '');

  useEffect(() => {
    setCnicNumber(currentCnic || '');
  }, [currentCnic]);

  const handleFileSelect = (file, side) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === 'front') {
        setCnicFront(file);
        setCnicFrontPreview(reader.result);
      } else {
        setCnicBack(file);
        setCnicBackPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, side) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file, side);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (side) => {
    if (side === 'front') {
      setCnicFront(null);
      setCnicFrontPreview(null);
    } else {
      setCnicBack(null);
      setCnicBackPreview(null);
    }
  };

const handleUpload = async () => {
  if (!cnicFront || !cnicBack) {
    setError('Please select both front and back images');
    return;
  }

  if (!cnicNumber || cnicNumber.length !== 13) {
    setError('CNIC number must be exactly 13 digits');
    return;
  }

  setIsUploading(true);
  setError('');

  try {
    const formData = new FormData();
    formData.append('cnicFront', cnicFront);
    formData.append('cnicBack', cnicBack);
    formData.append('cnic', cnicNumber);

    // Log FormData entries for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch('/api/users/upload-cnic', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type header - let the browser set it with the correct boundary
    });

    const data = await response.json();
    console.log('Response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload CNIC images');
    }

    setUploadSuccess(true);
    if (onUploadSuccess) {
      onUploadSuccess(data);
    }
  } catch (err) {
    console.error('CNIC upload error:', err);
    setError(err.message || 'Failed to upload CNIC images');
  } finally {
    setIsUploading(false);
  }
};

  const UploadBox = ({ side, preview, onSelect, onRemove }) => (
    <div
      className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:border-emerald-500 transition-colors"
      onDrop={(e) => handleDrop(e, side)}
      onDragOver={handleDragOver}
    >
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={`CNIC ${side}`}
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => onRemove(side)}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center h-48">
          <FileImage className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drop image here or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            CNIC {side === 'front' ? 'Front' : 'Back'} (Max 5MB)
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onSelect(e.target.files[0], side)}
          />
        </label>
      )}
    </div>
  );

  if (uploadSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          CNIC Uploaded Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your CNIC images have been securely uploaded.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadBox
          side="front"
          preview={cnicFrontPreview}
          onSelect={handleFileSelect}
          onRemove={removeImage}
        />
        <UploadBox
          side="back"
          preview={cnicBackPreview}
          onSelect={handleFileSelect}
          onRemove={removeImage}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          CNIC Number
        </label>
        <input
          type="text"
          value={cnicNumber}
          onChange={(e) => setCnicNumber(e.target.value.replace(/\D/g, '').slice(0, 13))}
          placeholder="Enter 13-digit CNIC"
          maxLength={13}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!cnicFront || !cnicBack || cnicNumber.length !== 13 || isUploading}
        className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Upload CNIC</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CNICUpload;
