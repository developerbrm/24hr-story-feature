import { PROGRESS_DELAY } from '../../utilities'

const ProgressComponent = () => {
  return (
    <div className="absolute top-0 right-0 left-0 z-10 grid w-full grid-cols-1 grid-rows-1">
      <div className="col-start-1 row-start-1 h-2 w-full bg-rose-300"></div>
      <div
        style={{
          animationDuration: `${PROGRESS_DELAY}ms`,
        }}
        className="animate-makeWidth100 col-start-1 row-start-1 h-2 bg-rose-600"
      ></div>
    </div>
  )
}

export default ProgressComponent
