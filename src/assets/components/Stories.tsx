import AddStory from './AddStory'
import RenderStories from './RenderStories'

const Stories = () => {
  return (
    <div className="bg-white/95 shadow-md">
      <div className="mx-auto grid max-w-5xl">
        <div className="flex w-full overflow-x-auto overflow-y-hidden">
          <AddStory />
          <RenderStories />
        </div>
      </div>
    </div>
  )
}

export default Stories
