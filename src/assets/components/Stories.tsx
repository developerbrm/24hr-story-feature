import { useState } from 'react'
import AddStory from './AddStory'
import RenderStories from './RenderStories'

export interface PropsInterface {
  showPlaceholder: boolean
  setShowPlaceholder: React.Dispatch<React.SetStateAction<boolean>>
}

const Stories = () => {
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  return (
    <div className="bg-white shadow-md">
      <div className="relative mx-auto grid max-w-5xl">
        <div className="flex w-full overflow-x-auto overflow-y-hidden">
          <AddStory
            showPlaceholder={showPlaceholder}
            setShowPlaceholder={setShowPlaceholder}
          />
          <RenderStories
            showPlaceholder={showPlaceholder}
            setShowPlaceholder={setShowPlaceholder}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-[90deg,_white_0%,_transparent_18px,_transparent_93%,_white_100%]"></div>
      </div>
    </div>
  )
}

export default Stories
