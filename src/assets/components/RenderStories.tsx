import { useContext, useLayoutEffect } from 'react'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { getImagesFromDB } from '../../db'
import { PropsInterface } from './Stories'
import StoryItem from './StoryItem'

const RenderStories = ({
  showPlaceholder,
  setShowPlaceholder,
}: PropsInterface) => {
  const { stories, setStories } =
    useContext<StoriesContextInterface>(StoriesContext)

  useLayoutEffect(() => {
    setShowPlaceholder(8)

    getImagesFromDB()
      .then((data) => {
        if (!data?.length) return

        setShowPlaceholder(data.length)
        setStories(() => data)
      })
      .finally(() => {
        setShowPlaceholder(null)
      })
  }, [setStories, setShowPlaceholder])

  return (
    <div className="grid grid-flow-col items-center justify-start gap-2 p-5 pl-0">
      {showPlaceholder ? (
        <>
          {[...Array(showPlaceholder)].map((_, index) => (
            <div
              key={index}
              className={`pointer-events-none relative aspect-square w-16 shrink-0 animate-pulse rounded-full border-3 border-rose-600 bg-rose-200 shadow-sm`}
            />
          ))}
        </>
      ) : (
        stories?.map((story) => (
          <StoryItem story={story} key={story.fileName} />
        ))
      )}
    </div>
  )
}

export default RenderStories
