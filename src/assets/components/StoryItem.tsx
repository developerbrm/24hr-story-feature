import { useContext } from 'react'
import { StoriesContext } from '../../Context/StoriesContext'
import {
  StoriesContextInterface,
  StoryType,
} from '../../Context/StoriesContextProvider'
import { commonStoriesClasses, updateImagesDB } from '../../utilities'

interface IStoryItem {
  story: StoryType
}

const StoryItem = (props: IStoryItem) => {
  const { story } = props
  const { setStories } = useContext<StoriesContextInterface>(StoriesContext)

  if (!story) return

  const handleStoryClick = (story: StoryType) => {
    setStories((stories) => {
      const newStories =
        stories?.map((s) =>
          s.fileName === story.fileName ? { ...s, isWatched: true } : s
        ) ?? []

      updateImagesDB(newStories)

      return newStories
    })
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
        className={`absolute inset-0 block h-full w-full overflow-hidden rounded-full border-3 object-cover object-center p-0 ${
          story.isWatched ? 'border-amber-600/20' : 'border-amber-600'
        }`}
      />
    </button>
  )
}

export default StoryItem
