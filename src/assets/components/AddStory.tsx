import { IoAddOutline } from 'react-icons/io5'

const AddStory = () => {
  return (
    <div>
      <button
        name="add-stories"
        title="add-stories"
        className="grid aspect-square w-14 cursor-pointer place-content-center rounded-full text-slate-600 ring-2 ring-slate-600"
      >
        <IoAddOutline size={22} strokeWidth={2} />
      </button>
    </div>
  )
}

export default AddStory
