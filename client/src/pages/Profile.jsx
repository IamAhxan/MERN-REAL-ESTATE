import { useSelector } from "react-redux"
import { useRef, useEffect, useState } from "react"

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvbt4rlof/image/upload"
const CLOUDINARY_UPLOAD_PRESET = "real-estate"

const Profile = () => {
  const fileRef = useRef(null)
  const { currentUser } = useSelector(state => state.user)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [filePerc, setFilePerc] = useState(0)
  const [file, setFile] = useState(undefined)
  const [formData, setFormData] = useState({})

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className="flex flex-col gap-3">
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

        <input type="text" placeholder="Username" className="border p-3 rounded-lg" id="username" />
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" />
        <button className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}

export default Profile