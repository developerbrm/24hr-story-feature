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
    </StoriesContextProvider>
  )
}

export default App
