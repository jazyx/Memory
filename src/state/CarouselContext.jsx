/**
 * frontend/src/state/CarouselContext.jsx
 *
 * description
 */


import React, { createContext, useState } from 'react'


export const CarouselContext = createContext()


export const CarouselProvider = ({ children }) => {
  const [ previous, setPrevious ] = useState("HOW MANY THINGS ARE IN THE SUITCASE?")

  return (
    <CarouselContext.Provider
      value ={{
        previous,
        setPrevious
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}


export default {
  label: "Carousel",
  Context: CarouselContext,
  Provider: CarouselProvider
}
