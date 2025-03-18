import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useContext, useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { updateImagesDB } from '../../db'
import { STORY_PROGRESS_INTERVAL, STORY_TIMEOUT } from '../../utilities'
import ProgressComponent from './ProgressComponent'

dayjs.extend(relativeTime)

const ImagePreviewModal = () => {
  const {
    stories,
    currentSelectedStory,
    setCurrentSelectedStory,
    handleImagePreviewModalOpenClose,
    setStories,
  } = useContext<StoriesContextInterface>(StoriesContext)

  const [progressValue, setProgressValue] = useState(0)
  const story = stories?.[currentSelectedStory]

  const updateWatchedState = useCallback(
    (newValue: number) => {
      setStories((stories) => {
        const newStories =
          stories?.map((story, index) => {
            if (index === newValue) {
              const newStory = { ...story, isWatched: true }

              updateImagesDB([newStory])

              return newStory
            }

            return story
          }) ?? []

        return newStories
      })
    },
    [setStories]
  )

  useEffect(() => {
    if (progressValue !== STORY_TIMEOUT) return

    setCurrentSelectedStory((prevValue) => {
      const n = stories?.length ?? 0

      if (n <= prevValue + 1) {
        handleImagePreviewModalOpenClose(false)
      }

      const nextValue = prevValue + 1

      updateWatchedState(nextValue)
      return nextValue
    })
  }, [
    stories,
    setCurrentSelectedStory,
    updateWatchedState,
    handleImagePreviewModalOpenClose,
    progressValue,
  ])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgressValue((prevValue) => {
        const newValue = prevValue + STORY_PROGRESS_INTERVAL

        if (newValue >= STORY_TIMEOUT) {
          clearInterval(intervalId)

          return STORY_TIMEOUT
        }

        return newValue
      })
    }, STORY_PROGRESS_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  if (!story) return

  return (
    <div>
      <dialog
        id="image-preview-modal"
        className="modal !bg-transparent backdrop-blur-xs transition-all will-change-auto"
      >
        <div className="modal-box relative h-11/12 w-11/12 !max-w-7xl p-0 shadow-[2px_2px_5px_1px_rgba(0,0,0,0.25)]">
          <ProgressComponent progressValue={progressValue} />
          <IoClose
            className="absolute top-3 right-3 z-50 cursor-pointer text-3xl text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transition-all hover:scale-110"
            onClick={() => handleImagePreviewModalOpenClose(false)}
          />

          <p className="absolute top-2 z-10 flex h-10 w-full items-center justify-start gap-2 truncate bg-gradient-to-r from-white/90 via-transparent to-transparent px-2 text-ellipsis text-slate-600 backdrop-blur-xs">
            <span className="text-md font-semibold capitalize">
              {dayjs(story.createdAt).fromNow()}
            </span>
            <span>|</span>
            <span className="max-w-[20ch] truncate font-normal text-ellipsis">
              {story.fileName}
            </span>
          </p>

          <img
            src={story.data}
            alt={story.fileName}
            title={story.fileName}
            className={`absolute inset-0 block h-full w-full overflow-hidden object-cover object-center`}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default ImagePreviewModal
