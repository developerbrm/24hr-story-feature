import { getPercentage, STORY_TIMEOUT } from '../../utilities'

const ProgressComponent = ({ progressValue }: { progressValue: number }) => {
  return (
    <div className="absolute top-0 right-0 left-0 z-30 grid w-full grid-cols-1 grid-rows-1">
      <div className="col-start-1 row-start-1 h-2 w-full bg-rose-300"></div>
      <div
        style={{
          width: `${getPercentage(progressValue, STORY_TIMEOUT)}%`,
        }}
        className="col-start-1 row-start-1 h-2 w-0 bg-rose-600 transition-all duration-100 ease-linear"
      ></div>
    </div>
  )
}

export default ProgressComponent
