import { useSelector } from "react-redux"
import { useRef, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess } from "./../../redux/user/userSlice.js"

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvbt4rlof/image/upload"
const CLOUDINARY_UPLOAD_PRESET = "real-estate"

const Profile = () => {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [filePerc, setFilePerc] = useState(0)
  const [file, setFile] = useState(undefined)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()

  const handleFileUpload = async (file) => {
    setFileUploadError(false)
    setFilePerc(0)
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)
    formDataUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", CLOUDINARY_URL)
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
    setFormData({...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(updateUserStart());
  try {
    const res = await fetch(
      `http://localhost:3000/api/user/update/${currentUser._id}`,
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
    const res = await fetch(`http://localhost:3000/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return
    }
    dispatch(deleteUserSuccess(data))
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
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
        <button disabled={loading} className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading? 'Loading...' : 'Update'}</button>
      </form>
      <div className="flex justify-between">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess? 'User Updated Successfully' : ""}</p>
    </div>
  )
}

export default Profile