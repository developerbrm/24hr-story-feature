import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { IoClose, IoPause, IoPlay } from 'react-icons/io5'
import { StoriesContext } from '../../Context/StoriesContext'
import { StoriesContextInterface } from '../../Context/StoriesContextProvider'
import { updateImagesDB } from '../../db'
import { startProgressInterval, STORY_TIMEOUT } from '../../utilities'
import ProgressComponent from './ProgressComponent'

dayjs.extend(relativeTime)

type PointerUPDownXY = {
  x: number
  y: number
} | null

type SwipeDirection = 'left' | 'right' | null

const ImagePreviewModal = () => {
  const {
    stories,
    currentSelectedStory,
    setCurrentSelectedStory,
    handleImagePreviewModalOpenClose,
    setStories,
  } = useContext<StoriesContextInterface>(StoriesContext)

  const [progressValue, setProgressValue] = useState(0)
  const [pauseProgress, setPauseProgress] = useState(false)
  const story = useMemo(
    () => stories?.[currentSelectedStory],
    [currentSelectedStory, stories]
  )

  const [pointerDownXY, setPointerDownXY] = useState<PointerUPDownXY>(null)
  const [pointerUpXY, setPointerUpXY] = useState<PointerUPDownXY>(null)
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null)

  const handlePausePlay = (type: 'pause' | 'play') => {
    setPauseProgress(type === 'pause')
  }

  const handleImagePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    setPauseProgress(true)
    setPointerUpXY(null)
    setPointerDownXY({ x: e.screenX, y: e.screenY })
  }

  const handleImagePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    setPauseProgress(false)
    setPointerUpXY({ x: e.screenX, y: e.screenY })
  }

  const updateWatchedState = useCallback(
    (newIndex: number) => {
      setStories((stories) => {
        const newStories =
          stories?.map((story, index) => {
            const match = index === newIndex

            if (story.isWatched && match) return story
            if (match) {
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

  const handleStoryChange = useCallback(
    (isNext = true) => {
      setCurrentSelectedStory((prevValue) => {
        const n = stories?.length ?? 0

        if ((n <= prevValue + 1 && isNext) || (prevValue === 0 && !isNext)) {
          handleImagePreviewModalOpenClose(false)
        }

        const nextIndex = prevValue + 1
        const prevIndex = prevValue - 1

        const finalIndex = isNext ? nextIndex : prevIndex

        updateWatchedState(finalIndex)
        return finalIndex
      })
    },
    [
      stories,
      setCurrentSelectedStory,
      handleImagePreviewModalOpenClose,
      updateWatchedState,
    ]
  )

  useEffect(() => {
    if (!swipeDirection) return

    handleStoryChange(swipeDirection === 'left')

    setSwipeDirection(null)
  }, [swipeDirection, handleStoryChange])

  useEffect(() => {
    if (!pointerDownXY || !pointerUpXY) return

    const direction = pointerUpXY.x > pointerDownXY.x ? 'right' : 'left'
    setSwipeDirection(direction)
  }, [pointerUpXY, pointerDownXY])

  useEffect(() => {
    if (progressValue !== STORY_TIMEOUT) return

    handleStoryChange(true)
  }, [
    stories,
    setCurrentSelectedStory,
    updateWatchedState,
    handleImagePreviewModalOpenClose,
    progressValue,
    handleStoryChange,
  ])

  useEffect(() => {
    if (progressValue === STORY_TIMEOUT) {
      setProgressValue(0)
    }

    const intervalId = startProgressInterval(setProgressValue, pauseProgress)

    return () => {
      clearInterval(intervalId)
    }
  }, [story, progressValue, pauseProgress])

  if (!story) return

  return (
    <div>
      <dialog
        id="image-preview-modal"
        className="modal !bg-transparent backdrop-blur-xs transition-all will-change-auto"
      >
        <div className="modal-box relative h-11/12 w-11/12 !max-w-7xl p-0 shadow-[2px_2px_5px_1px_rgba(0,0,0,0.25)]">
          <ProgressComponent progressValue={progressValue} />
          <div className="absolute top-3 right-3 z-50 flex gap-1">
            <IoPause
              className={`${pauseProgress ? 'hidden' : ''} cursor-pointer text-3xl text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transition-all hover:scale-110`}
              onClick={() => handlePausePlay('pause')}
            />
            <IoPlay
              className={`${pauseProgress ? '' : 'hidden'} cursor-pointer text-3xl text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transition-all hover:scale-110`}
              onClick={() => handlePausePlay('play')}
            />
            <IoClose
              className="cursor-pointer text-3xl text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transition-all hover:scale-110"
              onClick={() => handleImagePreviewModalOpenClose(false)}
            />
          </div>

          <p className="absolute top-2 z-20 flex h-10 w-full items-center justify-start gap-2 truncate bg-gradient-to-r from-white/90 via-transparent to-transparent px-2 text-ellipsis text-slate-600 backdrop-blur-xs">
            <span className="text-md font-semibold capitalize">
              {dayjs(story.createdAt).fromNow()}
            </span>
            <span>|</span>
            <span className="max-w-[20ch] truncate font-normal text-ellipsis">
              {story.fileName}
            </span>
          </p>

          <img
            draggable={false}
            onPointerDownCapture={handleImagePointerDown}
            onPointerUpCapture={handleImagePointerUp}
            src={story.data}
            alt={story.fileName}
            title={story.fileName}
            onContextMenu={(e) => e.preventDefault()}
            className={`absolute inset-0 z-10 block h-full w-full touch-pan-x overflow-hidden object-contain object-center`}
          />
          <img
            draggable={false}
            src={story.data}
            alt={story.fileName}
            className={`pointer-events-none absolute inset-0 block h-full w-full overflow-hidden object-cover object-center blur-xs`}
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
