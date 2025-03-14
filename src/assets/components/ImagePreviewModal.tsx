import { IoClose } from 'react-icons/io5'
import { Delay, PROGRESS_DELAY } from '../../utilities'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { useContext, useEffect, useState } from 'react'
import ProgressComponent from './ProgressComponent'

const d = new Delay()

const ImagePreviewModal = () => {
  const {
    stories,
    currentSelectedStory,
    setCurrentSelectedStory,
    handleImagePreviewModalOpenClose,
  } = useContext<StoriesContextInterface>(StoriesContext)

  const [showProgressBar, setShowProgressBar] = useState(false)
  const story = stories?.[currentSelectedStory]

  useEffect(() => {
    setShowProgressBar(true)
    d.delay(PROGRESS_DELAY, () => {
      setCurrentSelectedStory((prevValue) => {
        const n = stories?.length ?? 0
        setShowProgressBar(false)

        if (n <= prevValue + 1) {
          return 0
        }

        return prevValue + 1
      })
    })
  }, [story, stories, setCurrentSelectedStory])

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
