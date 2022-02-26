import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, Input, Row, ScrollView, Spinner, Stack, Text, TextArea } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Gradient from '../config/gradient'

export default class About extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static contextType = Context

  render() {
    return (
      <Center
        flex='1'
        p={wp(5)}
        bg='primary.1'
      >
        <Center
          flex='1'
          w='100%'
          // p={wp(5)}
          // bg='white'
          borderRadius='40'
        >
          <Stack
            flex='1'
            w='100%'
            justifyContent='space-around'
            alignItems='center'
            // borderWidth='1'
          >

            <Stack
              space={wp(4)}
              mb={wp(20)}
            >
              <WhiteText>The idea behind this app came to me in the Summer of 2020. As I was driving home from work, I noticed that many yards were overgrown due to the early COVID days. I sent a message to my neighbors that if they can't afford or find a lawn service and needed help, I would set them up with a former baseball player of mine who wanted to work. They could pay them whatever they wanted.</WhiteText>
              
              <WhiteText>I was busy for hours each day the entire summer matching players to those who needed help.</WhiteText>
  
              <WhiteText>Having coached youth baseball for the last 20 years, I knew a lot of former players. Several took the opportunity to help their neighbors and were very happy for the work. A bonus to all this was the connections that the youth made to their neighbors who they otherwise would never have met. Many good relationships were made between the older community and the youth. Providing opportunities for youth to engage in meaningful work to help others in their community is the primary purpose of this app.</WhiteText>

              <WhiteText>Interestingly, a mother with an autistic son (the son was a recent high school graduate) asked if they could also take jobs, which I readily agreed to. When the summer was over, she sent a very polite note thanking me for giving her and her son opportunities to work together and giving him a chance to develop skills.</WhiteText>
  
              <WhiteText>I hope you find this app to be an encouragement for you to get involved in your community, or a valuable resource to you if you need some tasks done.</WhiteText>

              <WhiteText>- Coach Henry Bartlett</WhiteText>
            </Stack>

          </Stack>
        </Center>
      </Center>
    )
  }
}

let WhiteText = (props) => {
  return <Text color='white' {...props}>{props.children}</Text>
}