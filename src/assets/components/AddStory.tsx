import React, { useContext } from 'react'
import { IoAddOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import {
  commonStoriesClasses,
  getErrorMessage,
  handleFileItem,
  updateImagesDB,
} from '../../utilities'

const AddStory = () => {
  const { setStories } = useContext<StoriesContextInterface>(StoriesContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const allPromises = [...e.target.files].map(handleFileItem)

    Promise.all(allPromises)
      .then((data) => {
        updateImagesDB(data)
        setStories(data)
      })
      .catch((err) => {
        console.error(err)

        toast.error(getErrorMessage(err))
      })
  }

  return (
    <div>
      <label
        className={`${commonStoriesClasses} border-2 border-slate-600 text-slate-600`}
      >
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
