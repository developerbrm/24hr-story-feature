import { Flip, ToastContainer } from 'react-toastify'
import HelperSection from './assets/components/HelperSection'
import Stories from './assets/components/Stories'
import StoriesContextProvider from './Context/StoriesContextProvider'

function App() {
  return (
    <StoriesContextProvider>
      <div className="grid h-screen w-full grid-rows-[auto_1fr] bg-gradient-to-b from-yellow-500 via-amber-500 to-yellow-600">
        <Stories />

        <HelperSection />
      </div>

      <ToastContainer
        autoClose={1500}
        transition={Flip}
        position={window.innerWidth > 600 ? 'top-right' : 'bottom-center'}
      />
    </StoriesContextProvider>
  )
}

export default App
