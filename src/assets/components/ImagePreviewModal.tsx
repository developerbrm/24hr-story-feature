import { IoClose } from 'react-icons/io5'
import { Delay, PROGRESS_DELAY } from '../../utilities'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { useCallback, useContext, useEffect, useState } from 'react'
import ProgressComponent from './ProgressComponent'
import { updateImagesDB } from '../../db'

const d = new Delay()

const ImagePreviewModal = () => {
  const {
    stories,
    currentSelectedStory,
    setCurrentSelectedStory,
    handleImagePreviewModalOpenClose,
    setStories,
  } = useContext<StoriesContextInterface>(StoriesContext)

  const [showProgressBar, setShowProgressBar] = useState(false)
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
    setShowProgressBar(true)

    d.delay(PROGRESS_DELAY, () => {
      setCurrentSelectedStory((prevValue) => {
        let newValue: number

        const n = stories?.length ?? 0

        if (n <= prevValue + 1) {
          newValue = 0
        } else {
          newValue = prevValue + 1
        }

        setShowProgressBar(false)
        updateWatchedState(newValue)
        return newValue
      })
    })
  }, [story, stories, setCurrentSelectedStory, updateWatchedState])

  if (!story) return

  return (
    <div>
      <dialog
        id="image-preview-modal"
        className="modal !bg-transparent backdrop-blur-xs transition-all will-change-auto"
      >
        <div className="modal-box relative h-11/12 w-11/12 !max-w-7xl shadow-[2px_2px_5px_1px_rgba(0,0,0,0.25)]">
          {showProgressBar && <ProgressComponent />}
          <IoClose
            className="absolute top-3 right-3 z-10 cursor-pointer text-3xl text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transition-all hover:scale-110"
            onClick={() => handleImagePreviewModalOpenClose(false)}
          />

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
