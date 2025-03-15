import { useContext } from 'react'
import { StoriesContext } from '../../Context/StoriesContext'
import {
  StoriesContextInterface,
  StoryType,
} from '../../Context/StoriesContextProvider'
import { commonStoriesClasses } from '../../utilities'
import { updateImagesDB } from '../../db'

interface IStoryItem {
  story: StoryType
}

const StoryItem = (props: IStoryItem) => {
  const { story } = props
  const {
    setStories,
    setCurrentSelectedStory,
    handleImagePreviewModalOpenClose,
  } = useContext<StoriesContextInterface>(StoriesContext)

  if (!story) return

  const handleStoryClick = (story: StoryType) => {
    setStories((stories) => {
      const newStories =
        stories?.map((s, index) => {
          const match = s.fileName === story.fileName
          const finalStory = match ? { ...s, isWatched: true } : s

          if (match) {
            setCurrentSelectedStory(index)
          }

          return finalStory
        }) ?? []

      updateImagesDB(newStories)

      return newStories
    })

    handleImagePreviewModalOpenClose(true)
  }

  return (
    <button
      onClick={() => handleStoryClick(story)}
      className={`${commonStoriesClasses} relative`}
    >
      <img
        src={story.data}
        alt={story.fileName}
        title={story.fileName}
        className={`absolute inset-0 block h-full w-full overflow-hidden rounded-full border-3 object-cover object-center p-0 transition-all hover:scale-105 hover:opacity-80 ${
          story.isWatched ? 'border-amber-600/20' : 'border-rose-600'
        }`}
      />
    </button>
  )
}

export default StoryItem
