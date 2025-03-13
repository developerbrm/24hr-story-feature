import AddStory from './AddStory'
import RenderStories from './RenderStories'

const Stories = () => {
  return (
    <div className="bg-white/95 p-5">
      <div className="mx-auto flex max-w-5xl items-center gap-5">
        <AddStory />
        <RenderStories />
      </div>
    </div>
  )
}

export default Stories
