import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'

const Listing = () => {
  //state
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const params = useParams()
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/listing/get/${params.listingId}`)
        const data = await res.json()
        if (data.success === false) {

          setError(true)
          setLoading(false)
          return
        }
        
        setLoading(false)
        setListing(data)
      }
      catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchListing()
  }, [params.listingId])

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-red-700 text-center text-2xl my-7'>Something Went Wrong</p>}
      {listing && !loading && !error && (
       <div>
       <Swiper modules={[Navigation]}
  navigation>
        {listing.imageURLs.map((url) => {
          return <SwiperSlide key={url}> 
          <div className='h-[550px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
          </SwiperSlide>
        })}
       </Swiper>
       </div>
      )}
    </main>
  )
}

export default Listing