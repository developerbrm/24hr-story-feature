import React, { useContext } from 'react'
import { IoAddOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { getImagesFromDB, updateImagesDB } from '../../db'
import {
  commonStoriesClasses,
  commonToastOptions,
  getErrorMessage,
  handleFileItem,
  handleOnExpiration,
} from '../../utilities'

const AddStory = () => {
  const { setStories } = useContext<StoriesContextInterface>(StoriesContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const toastId = toast.loading('Adding images')

    const allPromises = [...e.target.files].map(handleFileItem)

    Promise.all(allPromises)
      .then((data) => {
        updateImagesDB(data)

        getImagesFromDB().then((data) => {
          setStories(data)

          toast.update(toastId, {
            ...commonToastOptions,
            render: 'Images Added',
            type: 'success',
            isLoading: false,
          })

          handleOnExpiration(data, setStories)
        })
      })
      .catch((err) => {
        console.error(err)

        toast.update(toastId, {
          ...commonToastOptions,
          render: 'Images Addition Failed',
          type: 'error',
          isLoading: false,
        })

        toast.error(getErrorMessage(err))
      })
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
