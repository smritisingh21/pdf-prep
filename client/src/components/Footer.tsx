import React from 'react'
import { HeartIcon } from 'lucide-react'

export default function Footer() {
  return (
    <div className='w-full max-h-40 mt-10 '>
        <div className='bg-black text-white p-3 '>
            <h5 className='flex justify-center items-center gap-2'>Created with <HeartIcon fill='white'/>
             by <a href="https://smriitiisiingh.netlify.app/" target='_blank' className='underline'> Smriti Singh</a> </h5>
        </div>
    </div>
  )
}
