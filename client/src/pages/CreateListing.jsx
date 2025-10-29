import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const CreateListing = () => {
  const [files, setFiles] = useState([])
  const { currentUser } = useSelector(state => state.user)
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 50,
    discountedPrice: 0,
  })
  const [imageUploadError, setImageUploadError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  // Cloudinary config (Vite env)
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const navigate = useNavigate()
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
      setFormData((prev) => ({ ...prev, imageURLs: prev.imageURLs.concat(urls) }))
      // optionally clear selected files:
      setFiles([])
      setUploading(false)
      // If you want to reset the file input in the DOM, do that via a ref
    } catch (err) {
      console.error('Image upload error', err)
      const message = err?.message || 'Image upload failed'
      setImageUploadError(message)
      setUploading(false)
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
      imageURLs: formData.imageURLs.filter((_, index) => index !== i),
    })
  }
  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      })
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageURLs.length === 0) {
        return setError('Please upload at least one image')
      };
      if (formData.regularPrice < +formData.discountedPrice) {
        return setError('Discount price must be less than regular price')
      };

      setLoading(true)
      setError(false)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/create`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      });

      // 1. You successfully moved this to the correct position!
      const data = await res.json()

      setLoading(false)

      // 2. Add a 'return' here. If the API call fails (data.success === false),
      // we must stop execution and not try to navigate.
      if (data.success === false) {
        setError(data.message)
        return
      }

      // 3. ONLY navigate if the request was successful
      // (and assuming data contains { listing: { _id: '...' } })
      navigate(`/listing/${data._id}`)

    } catch (error) {
      // 4. FIX: 'data' is NOT defined in the scope of the catch block. 
      // Use the 'error' object itself to set the error message.
      console.error(error); // Log the error for debugging
      setError(error.message || 'An unexpected error occurred.')
      setLoading(false)
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' onChange={handleChange} value={formData.name} placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
          <textarea onChange={handleChange} value={formData.description} placeholder='Description' className='border p-3 rounded-lg' id='description' required />
          <input onChange={handleChange} value={formData.address} type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' onChange={handleChange} checked={formData.type === 'sale'} className='w-5' id='sale' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='rent' onChange={handleChange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='parking' onChange={handleChange} checked={formData.parking} />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='furnished' onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='offer' onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input className='bg-white p-3 border border-gray-300 rounded-lg ' type='number' id='bedrooms' min='1' max='10' required onChange={handleChange} value={formData.bedrooms} />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input className='bg-white p-3 border border-gray-300 rounded-lg ' type='number' id='bathrooms' min='1' max='10' required onChange={handleChange} value={formData.bathrooms} />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input className='bg-white p-3 border border-gray-300 rounded-lg ' type='number' id='regularPrice' min='50' max='1000000' required onChange={handleChange} value={formData.regularPrice} />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span>($ / Months)</span>
              </div>
            </div>
            {(formData.offer) && (
              <div className='flex items-center gap-2'>
                <input className='bg-white p-3 border border-gray-300 rounded-lg ' type='number' id='discountedPrice' min='0' max='1000000' onChange={handleChange} value={formData.discountedPrice} />
                <div className='flex flex-col items-center'>
                  <p>Discounted Price</p>
                  <span>($ / Months)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold '>
            Images:<span className='text-gray-600 font-normal ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className='flex gap-4'>
            <input onChange={(e) => setFiles(Array.from(e.target.files))} type='file' id='images' accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full' />
            <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? '...uploading' : 'upload'}</button>
          </div>
          <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? '...Loading' : 'Create Listing'}</button>
          {error && <p className='text-red-700'>{error}</p>}
          {formData.imageURLs && formData.imageURLs.length > 0 && (
            <div className='mt-3'>
              <p className='font-medium'>Uploaded images:</p>
              <div className='flex gap-2 flex-wrap mt-2'>
                {formData.imageURLs.map((u, i) => (
                  <div key={i} className='flex justify-between p-3 border items-center w-full'>
                    <img src={u} alt={`uploaded-${i}`} className='h-20 w-20 object-cover rounded' />
                    <button onClick={() => handleRemoveImage(i)} className='text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
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
