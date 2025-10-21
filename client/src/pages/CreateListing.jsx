import React, { useState } from 'react'

const CreateListing = () => {
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    imageUrls: []
  })
const [imageUploadError, setImageUploadError] = useState(null)
const [uploading, setUploading] = useState(false)
  // Cloudinary config (Vite env)
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const handleImageSubmit = async () => {
    
      setUploading(true)
    setImageUploadError('')
    if (!files || files.length === 0) return
    if (files.length > 6) {
      const msg = 'Maximum 6 images allowed'
      setImageUploadError(msg)
      return
    }

    try {
      const promises = files.map((f) => storeImage(f))
      const urls = await Promise.all(promises)
      setFormData((prev) => ({ ...prev, imageUrls: prev.imageUrls.concat(urls) }))
      // optionally clear selected files:
      setFiles([])
      // If you want to reset the file input in the DOM, do that via a ref
    } catch (err) {
      console.error('Image upload error', err)
        const message = err?.message || 'Image upload failed'
      setImageUploadError(message)
      
    }
          setUploading(false)
  }

  const storeImage = async (file) => {
    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
        
    throw new Error(
        'Cloudinary config missing. Set VITE_CLOUDINARY_URL and VITE_CLOUDINARY_UPLOAD_PRESET in your .env'
      )
    }

    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: data
    })

    if (!res.ok) {
      const text = await res.text()
       throw new Error(`Cloudinary upload failed: ${text}`)
       setImageUploadError('Error Occurred During Image Upload')
       
    }

    const json = await res.json()
    return json.secure_url || json.url
    setImageUploadError(null)
    

  }
    const handleRemoveImage = (i) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, index) => index !== i),
        })
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
          <textarea placeholder='Description' className='border p-3 rounded-lg' id='description' required />
          <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='sale' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='rent' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='parking' />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='furnished' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='offer' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input className='bg-white p-3 border border-gray-300 rounded-lg ' type='number' id='bedrooms' min='1' max='10' required />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input className='bg-white p-3 border border-gray-300 rounded-lg ' type='number' id='bathrooms' min='1' max='10' required />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input className='bg-white p-3 border border-gray-300 rounded-lg ' type='number' id='regularPrice' min='1' required />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span>($ / Months)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input className='bg-white p-3 border border-gray-300 rounded-lg ' type='number' id='discountedPrice' min='1' />
              <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                <span>($ / Months)</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold '>
            Images:<span className='text-gray-600 font-normal ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className='flex gap-4'>
            <input onChange={(e) => setFiles(Array.from(e.target.files))} type='file' id='images' accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full' />
            <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading? '...uploading' : 'upload'}</button>
          </div>
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>

          {formData.imageUrls && formData.imageUrls.length > 0 && (
            <div className='mt-3'>
              <p className='font-medium'>Uploaded images:</p>
              <div className='flex gap-2 flex-wrap mt-2'>
                {formData.imageUrls.map((u, i) => (
                    <div key={i} className='flex justify-between p-3 border items-center w-full'>
                  <img  src={u} alt={`uploaded-${i}`} className='h-20 w-20 object-cover rounded' />
                  <button onClick={()=>handleRemoveImage(i)} className='text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className='text-red-700'>{imageUploadError}</p>
      </form>
    </main>
  )
}

export default CreateListing
