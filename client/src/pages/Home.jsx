import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SwiperSlide, Swiper } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle'
import ListingItem from './../components/ListingItem'


const Home = () => {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation])

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?offer=true&limit=4`)
        const data = await res.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?type=rent&limit=4`)
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?type=sale&limit=4`)
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListings()
  }, [])
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find Your Next <span className='text-slate-500'>Perfect</span><br />
          place with ease</h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Ahsan Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className='text-cs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get starter...
        </Link>

      </div>


      {/* Swiper */}
      <Swiper navigation>
        {
          offerListings && offerListings.length > 0 && (
            offerListings.map((listing) => (
              <SwiperSlide >
                <div className='h-[500px]' style={{ background: `url(${listing.imageURLs[0]}) center no-repeat`, backgroundSize: 'cover' }}></div>
              </SwiperSlide>
            ))
          )
        }
      </Swiper>

      {/* Listing Result */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show More Offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                offerListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div>
              <h2 className='text-2xl font-semibold text-slate-600'>Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show More Places for Rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                rentListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div>
              <h2 className='text-2xl font-semibold text-slate-600'>Sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                Show More Places for Sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                saleListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
export default Home