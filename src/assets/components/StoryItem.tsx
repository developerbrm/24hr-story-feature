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

  const handleStoryClick = (s: StoryType) => {
    setStories(
      (stories) =>
        stories?.map((story, index) => {
          const match = story.fileName === s.fileName

          if (story.isWatched && match) {
            setCurrentSelectedStory(index)

            return story
          }

          const finalStory = match ? { ...story, isWatched: true } : story

          if (match) {
            setCurrentSelectedStory(index)
            updateImagesDB([finalStory])
          }

          return finalStory
        }) ?? []
    )

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
