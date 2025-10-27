import { useSelector } from "react-redux"
import { useRef, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, Links } from 'react-router-dom'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "./../../redux/user/userSlice.js"
const Profile = () => {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [filePerc, setFilePerc] = useState(0)
  const [file, setFile] = useState(undefined)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingError] = useState(null)
  const [userListing, setUserListing] = useState([])
  const dispatch = useDispatch()
  const handleFileUpload = async (file) => {
    setFileUploadError(false)
    setFilePerc(0)
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)
    formDataUpload.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    const xhr = new XMLHttpRequest()
    xhr.open("POST", import.meta.env.VITE_CLOUDINARY_URL)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100
        setFilePerc(Math.round(progress))
      }
    }
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        setFormData(prev => ({ ...prev, avatar: response.secure_url }))
        setFilePerc(100)
      } else {
        setFileUploadError(true)
      }
    }
    xhr.onerror = () => setFileUploadError(true)
    xhr.send(formDataUpload)
  }
  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(
        `/api/user/update/${currentUser._id}`,
        {
          method: "POST", // or "PUT" if your backend expects it
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // <-- this sends cookies!
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if (data.success === false) {
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json()
      if (data.success === false) {
        setShowListingError(true);
        return
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true)
    }
  }
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message)
        return;
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input onChange={(e) => setFile(e.target.files[0])} hidden type="file" ref={fileRef} accept="image/*" />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center" />
        {
          fileUploadError ? (
            <span className="text-red-700">Error Image Upload(image must be less than 2mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Uploaded successfully</span>
          ) : null
        }
        <input onChange={handleChange} type="text" placeholder="Username" defaultValue={currentUser.username} className="border p-3 rounded-lg" id="username" />
        <input onChange={handleChange} type="email" placeholder="email" defaultValue={currentUser.email} className="border p-3 rounded-lg" id="email" />
        <input onChange={handleChange} type="password" placeholder="password" defaultValue={currentUser.password} className="border p-3 rounded-lg" id="password" />
        <button disabled={loading} className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading...' : 'Update'}</button>
        <Link to={"/create-listing"} className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95">Create Listing</Link>
      </form>
      <div className="flex justify-between">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User Updated Successfully' : ""}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700">{showListingsError ? 'Error Showing Listings' : ''}</p>
      {userListing &&
        userListing.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
            {userListing.map((listing) => (
              <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center">
                <Link to={`/listing/${listing._id}`}>
                  <img className='h-16 w-16 object-contain' src={listing.imageURLs[0]} alt="Listing Cover" />
                </Link>
                <Link to={`/listing/${listing._id}`} className="text-slate-700 font-semibold flex-1 hover:underline truncate">
                  <p >{listing.name}</p>
                </Link>
                <div className="flex flex-col">
                  <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
export default Profile