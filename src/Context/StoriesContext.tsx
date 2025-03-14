import { createContext } from 'react'
import { StoriesContextInterface } from './StoriesContextProvider'

const defaultContextValue = {
  stories: null,
  setStories: () => null,
  currentSelectedStory: 0,
  setCurrentSelectedStory: () => null,
}

export const StoriesContext =
  createContext<StoriesContextInterface>(defaultContextValue)
