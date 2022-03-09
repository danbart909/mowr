import React from 'react'
import { Factory } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'

const Gradient = (props) => {
  const LG = Factory(LinearGradient);
  return (
    <LG
      // colors={['#ffffff', '#bfbfbf']} // 8c8c8c
      colors={['#bfbfbf', '#ffffff']} // bfbfbf
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      borderRadius='40'
      // {...props}
    />
  )
}

export default Gradient