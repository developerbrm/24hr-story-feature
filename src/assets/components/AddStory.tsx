import React from 'react'
import { IoAddOutline } from 'react-icons/io5'

const AddStory = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesUrls = [...e.target.files].map(URL.createObjectURL)

    console.log(filesUrls)
  }

  return (
    <div>
      <label className="grid aspect-square w-14 cursor-pointer place-content-center rounded-full text-slate-600 ring-2 ring-slate-600">
        <IoAddOutline size={22} strokeWidth={2} />

        <input
          multiple
          className="hidden"
          name="add-stories"
          title="add-stories"
          type="file"
          accept="video/*, image/*"
          onChange={handleChange}
        />
      </label>
    </div>
  )
}

export default AddStory
