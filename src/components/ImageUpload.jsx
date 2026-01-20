import { motion } from 'framer-motion'
import { useState } from 'react'

const ImageUpload = ({ onImageSelect, selectedImages, onRemoveImage }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
  }

  const processFiles = (files) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          onImageSelect({
            file,
            preview: e.target.result,
            name: file.name
          })
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-2">
      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative group"
            >
              <img
                src={img.preview}
                alt={img.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-primary/20"
              />
              <button
                onClick={() => onRemoveImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] sm:text-[10px] px-1 py-0.5 rounded-b-lg truncate">
                {img.name}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative ${isDragging ? 'opacity-50' : ''}`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <span className="text-xs sm:text-sm hidden sm:inline">
            {isDragging ? 'Lepas gambar di sini' : 'Upload gambar'}
          </span>
        </label>
      </div>
    </div>
  )
}

export default ImageUpload
