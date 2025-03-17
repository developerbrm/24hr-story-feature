import { useContext, useLayoutEffect } from 'react'
import { toast, TypeOptions } from 'react-toastify'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { getImagesFromDB } from '../../db'
import { commonToastOptions } from '../../utilities'
import StoryItem from './StoryItem'

const RenderStories = () => {
  const { stories, setStories } =
    useContext<StoriesContextInterface>(StoriesContext)

  useLayoutEffect(() => {
    const toastId = toast.loading('Finding Existing Images')

    getImagesFromDB()
      .then((data) => {
        let render = `No Existing Images Found`
        let type: TypeOptions = `info`

        if (data?.length) {
          render = `Images Search Success`
          type = `success`

          setStories(() => data)
        }

        toast.update(toastId, {
          ...commonToastOptions,
          render,
          type,
          isLoading: false,
        })
      })
      .catch((err) => {
        console.log(err)

        toast.update(toastId, {
          ...commonToastOptions,
          render: 'Images loaded failed',
          type: 'error',
          isLoading: false,
        })
      })
  }, [setStories])

  return (
    <div className="grid grid-flow-col items-center justify-start gap-2 p-5 pl-0">
      {stories?.map((story) => (
        <StoryItem story={story} key={story.fileName} />
      ))}
    </div>
  )
}

export default RenderStories
