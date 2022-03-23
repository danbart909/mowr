import React, { Component } from 'react'
import { Box, Button, Center, Heading, Factory, FlatList, Input, Modal, ScrollView, Spinner, Text, Select, Stack, Row, Switch } from 'native-base'
import { Animated, View, Pressable, Platform, Keyboard, KeyboardAvoidingView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
// import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export const WText = (props) => {
  return <Text {...props} color='white'>{props.children}</Text>
}

export const SText = (props) => {
  return <Text
    {...props}
    fontSize={Platform.OS === 'ios' ? wp(5) : wp(4)}
    lineHeight={Platform.OS === 'ios' ? wp(6.5) : wp(5)}
    >{props.children}</Text>
}

export const HelpIcon = (props) => {
  return <FontAwesomeIcon
    {...props}
    icon={faQuestionCircle}
    color='darkgreen'
    size={Platform.OS === 'ios' ? wp(7) : wp(6)}
  />
}

export const animHideAndSlideUp = (height, rotate) => {
  Animated.parallel([
    Animated.spring(height, {
      toValue: 1,
      useNativeDriver: false
    }),
    Animated.spring(rotate, {
      toValue: 1,
      useNativeDriver: false
    })
  ]).start()
}

export const animSlideDownAndShow = (height, rotate) => {
  Animated.parallel([
    Animated.spring(height, {
      toValue: 0,
      useNativeDriver: false
    }),
    Animated.spring(rotate, {
      toValue: 0,
      useNativeDriver: false
    })
  ]).start()
}

export const heightTo1 = (height) => {
  Animated.spring(height, {
    toValue: 1,
    useNativeDriver: false
  }).start()
}

export const heightTo0 = (height) => {
  Animated.spring(height, {
    toValue: 0,
    useNativeDriver: false
  }).start()
}

export const fadeInText = (opacity) => {
  Animated.timing(opacity, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: false
  }).start()
}

export const fadeOutText = (opacity) => {
  Animated.spring(opacity, {
    toValue: 0,
    // duration: 1000,
    useNativeDriver: false
  }).start()
}