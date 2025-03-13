import { useContext } from 'react'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import StoryItem from './StoryItem'

const RenderStories = () => {
  const { stories } = useContext<StoriesContextInterface>(StoriesContext)

  return (
    <div className="grid grid-flow-col items-center justify-start gap-2 p-5 pl-0">
      {stories?.map((story) => (
        <StoryItem story={story} key={story.fileName} />
      ))}
    </div>
  )
}

export default RenderStories
