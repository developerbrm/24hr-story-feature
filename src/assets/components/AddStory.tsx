import React, { useContext } from 'react'
import { IoAddOutline } from 'react-icons/io5'
import {
  getErrorMessage,
  handleFileItem,
  updateImagesDB,
} from '../../utilities'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { toast } from 'react-toastify'

const AddStory = () => {
  const { setStories } = useContext<StoriesContextInterface>(StoriesContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const imagesDataMap = new Map<string, string>()
    const allPromises = [...e.target.files].map(handleFileItem)

    Promise.all(allPromises)
      .then((data) => {
        data.forEach((obj) => {
          imagesDataMap.set(obj.file.name, obj.data)
        })

        updateImagesDB(imagesDataMap)
        setStories(data)
      })
      .catch((err) => {
        console.error(err)

        toast.error(getErrorMessage(err))
      })
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
          accept="image/*"
          onChange={handleChange}
        />
      </label>
    </div>
  )
}

export default AddStory
