import { IoClose } from 'react-icons/io5'
import { handleImagePreviewModalOpenClose } from '../../utilities'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { useContext } from 'react'

const ImagePreviewModal = () => {
  const { stories, currentSelectedStory } =
    useContext<StoriesContextInterface>(StoriesContext)

  const story = stories?.[currentSelectedStory]

  if (!story) return

  return (
    <div>
      <dialog
        id="image-preview-modal"
        className="modal !bg-transparent backdrop-blur-xs transition-all will-change-auto"
      >
        <div className="modal-box relative h-11/12 w-11/12 !max-w-7xl shadow-[2px_2px_5px_1px_rgba(0,0,0,0.25)]">
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
