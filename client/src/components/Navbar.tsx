import React from 'react'
import { FileBadgeIcon } from 'lucide-react'
import { GitGraphIcon } from 'lucide-react'
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  return (
    
      <nav className="h-16 pt-4 border-b border-zinc-200 bg-white flex items-cente justify-between px-10">
        <h1 className="text-xl font-semibold text-zinc-900 flex gap-2">
         <FileBadgeIcon/> PDF Prep 
        </h1>

        <div className=' rounded-full flex justify-center p-2 gap-2 items-center hover:text-gray-500 cursor-pointer'>
           <a href="https://github.com/smritisingh21/pdf-prep">
            <FaGithub size={20}/> 
           </a>
        </div>


      </nav>
  )
}
