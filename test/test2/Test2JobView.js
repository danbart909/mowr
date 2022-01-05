import React, { Component } from 'react'
import Context from '../../context/Context.js'
import { Box, Button, Center, Divider, Heading, FlatList, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as dFNS from 'date-fns'

export default class Test2JobView extends Component {
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
      { x: 'Name', y: job.name },
      { x: 'Description', y: job.description },
      { x: 'Tip', y: `$ ${job.tip}` },
      { x: 'Address', y: job.address.replace(/([,][\s])/, `\n`) },
      { x: 'Email', y: job.email },
      { x: 'Phone', y: job.phone },
      { x: 'Creation Date', y: dFNS.format(new Date(job.creationDate), 'EEEE, PPP') },
      { x: 'Deadline', y: dFNS.format(new Date(job.endDate), 'EEEE PPP') },
    ]

    list.map(x => {
      html.push(
        <Box mt={wp(4)} key={x.x}>
          <Row
            justifyContent='space-between'
            mb={wp(4)}
            // borderWidth='1'
          >
            <Box flex='1'>
              <Text>{x.x}</Text>
            </Box>
            <Box flex='5' pl={wp(2)}>
              <Text fontSize={wp(3)}>{x.y}</Text>
            </Box>
          </Row>
          <Divider />
        </Box>
      )
    })

    return html
  }

  render() {

    

    return (
      <ScrollView
        bg='green.500'
        _contentContainerStyle={{ alignItems: 'center' }}
      >
        <Stack
          w='90%'
          my={wp(4)}
          px={wp(4)}
          bg='white'
          // borderWidth='1'
          borderRadius='20'
        >
          {this.renderList()}
        </Stack>
      </ScrollView>
    )
  }
}










// let { job } = this.context
// let list = [
//   { x: 'Type', y: job.type },
//   { x: 'Title', y: job.title },
//   { x: 'Name', y: job.name },
//   { x: 'Description', y: job.description },
//   { x: 'Tip', y: `$ ${job.tip}` },
//   { x: 'Address', y: job.address.replace(/([,][\s])/, `\n`) },
//   { x: 'Email', y: job.email },
//   { x: 'Phone', y: job.phone },
//   { x: 'Creation Date', y: dFNS.format(new Date(job.creationDate), 'EEEE, PPP') },
//   { x: 'Deadline', y: dFNS.format(new Date(job.endDate), 'EEEE PPP') },
// ]

// return (
//   <Center
//     flex='1'
//     justifyContent='flex-start'
//     bg='green.500'
//   >
//     <Stack
//       w='90%'
//       mt={wp(4)}
//       px={wp(4)}
//       // pt={wp(4)}
//       bg='white'
//       // borderWidth='1'
//       borderRadius='20'
//     >
//       <FlatList
//         data={list}
//         keyExtractor={item => item.x}
//         renderItem={({item}) => (
//           <Box
//             mt={wp(4)}
//           >
//             <Row
//               // w='100%'
//               justifyContent='space-between'
//               mb={wp(4)}
//               // borderWidth='1'
//             >
//               <Box flex='1'>
//                 <Text>{item.x}</Text>
//               </Box>
//               <Box flex='5'>
//                 <Text>{item.y}</Text>
//               </Box>
//             </Row>
//             <Divider />
//           </Box>
//         )}
//       />
//     </Stack>
//   </Center>
// )
// }
// }