import React, { useContext } from 'react'
import { IoAddOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { updateImagesDB } from '../../db'
import {
  commonStoriesClasses,
  getErrorMessage,
  handleFileItem,
} from '../../utilities'
import { PropsInterface } from './Stories'

const AddStory = ({ setShowPlaceholder }: PropsInterface) => {
  const { setStories } = useContext<StoriesContextInterface>(StoriesContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    setShowPlaceholder(e.target.files.length)
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
      .finally(() => setShowPlaceholder(null))
  }

  return (
    <div className="sticky left-0 z-10 bg-white/50 p-5 backdrop-blur-xs">
      <label
        className={`${commonStoriesClasses} border-2 border-slate-600 text-slate-600 transition-all hover:scale-105 hover:border-amber-600 hover:text-amber-600`}
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
