import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Divider, Heading, Row, FlatList, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'

export default class JobView extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static contextType = Context

  renderList = () => {
    let { job } = this.context
    let html = []
    let list = [
      { x: 'Type', y: job.type },
      { x: 'Title', y: job.title },
      { x: 'Tip', y: `$${job.tip}` },
      { x: 'Description', y: job.description },
      { x: 'Creation Date', y: format(new Date(job.creationDate.seconds*1000), 'E PP') },
      { x: 'Deadline', y: format(new Date(job.endDate.seconds*1000), 'E PPp') },
      { x: 'Name', y: job.userName },
      { x: 'Address', y: job.address.replace(/([,][\s])/, `\n`) },
      { x: 'Email', y: job.email },
      { x: 'Phone', y: job.phone },
    ]

    list.map(x => {
      html.push(
        <Stack
          key={x.x}
          w='100%'
          mb={wp(5)}
          // flex='1'
          // borderWidth='1'
        >
          <Row
            p={wp(1)}
            pb={wp(1.5)}
            mb={wp(1.5)}
            justifyContent='space-between'
            borderBottomWidth='1'
            alignItems='flex-start'
          >
            <Heading py={wp(1)} fontSize={wp(7)}>{x.x}</Heading>
          </Row>
          <Box
            flex='2'
            p={wp(1)}
            justifyContent='center'
            alignItems='flex-end'
          >
            <Text
              h='100%'
              px={wp(2)}
              textAlign='right'
            >{x.y}</Text>
          </Box>
          <Box
            flex='1'
            p={wp(1)}
            alignItems='center'
          >
          </Box>
        </Stack>
      )
    })

    return html
  }

  render() {
    return (
      <ScrollView bg='primary.1'>
        <LinearGradient
          colors={['#289d15', '#ffffff']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          {this.renderList()}
        </LinearGradient>
      </ScrollView>
    )
  }
}

// <Box mt={wp(4)}>
//   <Row
//     justifyContent='space-between'
//     mb={wp(4)}
//     // borderWidth='1'
//   >
//     <Box flex='1'>
//       <Text>{item.x}</Text>
//     </Box>
//     <Box flex='5' pl={wp(2)}>
//       <Text fontSize={wp(3)}>{item.y}</Text>
//     </Box>
//   </Row>
//   <Divider />
// </Box>