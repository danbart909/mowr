import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Factory, FormControl, Heading, Input, Row, ScrollView, Select, Stack, Spinner, TextArea, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import DateTimePicker from '@react-native-community/datetimepicker'
import { collection, doc, setDoc, addDoc, getDoc, Timestamp } from 'firebase/firestore'
import { format, parseISO, toString } from 'date-fns'
import Gradient from '../config/gradient'
// import { LinearGradient } from 'expo-linear-gradient'

// const Gradient = (props) => {
//   const LG = Factory(LinearGradient);
//   return (
//     <LG
//       position='absolute'
//       h='100%'
//       w='100%'
//       // colors={['#ffffff', '#bfbfbf']} // 8c8c8c
//       colors={['#bfbfbf', '#ffffff']} // bfbfbf
//       start={{ x: 1, y: 1 }}
//       end={{ x: 0, y: 0 }}
//       borderRadius='40'
//       alignSelf='center'
//       {...props}
//     />
//   )
// }

export default class CreateJob extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      type: 'Yardwork',
      tip: '',
      endDate: '',
      endTime: '',
      pickerMode: 'date',
      firstCheck: false,
      busy: false,
      error: false,
      showDatePicker: false,
    }
  }

  static contextType = Context

  componentDidMount() {
  }

  submit = async () => {
    let { user, fire } = this.context
    let { title, description, type, tip, endDate, endTime } = this.state
    let { address, phone, email, uid, name, latitude, longitude } = user

    if (endDate === '') { alert('Please select an End Date') }
    else if (endTime === '') { alert('Please select a Time after you select a Date./\n/If you do not want to select a time, please select 12:00 PM (Noon)') }

    let endDateAndTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes())

    if (title === '') { alert('Please enter a Title') }
    else if (description === '') { alert('Please enter a Description') }
    else if (type === '') { alert('Please select a Type of Job') }
    else if (tip === '') { alert('Please enter a Tip.') }
    else if (isNaN(tip)) { alert('Please enter in only numbers for the tip.') }
    else {
      this.setState({ busy: true })
      await addDoc(collection(fire, 'jobs'), {
        userId: uid,
        userName: name,
        title: title,
        phone: phone,
        email: email,
        address: address,
        latitude: latitude,
        longitude: longitude,
        description: description,
        creationDate: new Date(),
        type: type,
        tip: parseInt(tip),
        endDate: endDateAndTime,
      })
        .then(async (x) => {
          this.setState({
            title: '',
            description: '',
            type: 'Yardwork',
            tip: '',
            endDate: '',
            busy: false,
            error: false
          })
          this.context.refreshUserJobs()
          console.log('Create Job', 'job created')
          this.context.navigation.navigate('Manage Jobs')
        })
        .catch((e) => {
          this.setState({
            busy: false,
            error: true
          }, () => console.log('Create Job', 'error creating job', e))
        })
    }
  }

  render() {

    let { address, phone } = this.context.user
    let { title, description, type, tip, endDate, endTime, showDatePicker, pickerMode, busy, error } = this.state

    return (
      <ScrollView
        p={wp(5)}
        bg='primary.1'
      >

        <Gradient
          position='absolute'
          h='100%'
          w='100%'
        />
          <Stack
            p={wp(3)}
          >
            <Box>
              <Text pb={wp(1)}>Title</Text>
              <Input
                // w={wp(70)}
                fontSize={wp(2.5)}
                bg='white'
                onChangeText={(x) => this.setState({ title: x })}
                value={title}
              />
            </Box>
            <Row>
              <Box flex='1' mr={wp(1)}>
                <Text py={wp(1)}>Tip</Text>
                <Input
                  // w={wp(70)}
                  fontSize={wp(2.5)}
                  placeholder='Please use numbers only'
                  bg='white'
                  onChangeText={(x) => this.setState({ tip: x })}
                  value={tip}
                />
              </Box>
              <Box flex='1' ml={wp(1)}>
                <Text py={wp(1)}>Type</Text>
                <Select
                  bg='white'
                  fontSize={wp(2.5)}
                  selectedValue={type}
                  onValueChange={(x) => this.setState({ type: x })}
                  ref='type'
                >
                  <Select.Item p={wp(3)} label='Yardwork' value='Yardwork' />
                  <Select.Item p={wp(3)} label='Child Care' value='Child Care' />
                  <Select.Item p={wp(3)} label='Other' value='Other' />
                </Select>
              </Box>
            </Row>
            <Box>
              <Text py={wp(1)}>Description</Text>
              <TextArea
                h={wp(40)}
                // w={wp(70)}
                p={wp(2)}
                bg='white'
                fontSize={wp(2.5)}
                onChangeText={(x) => this.setState({ description: x })}
                value={description}
              />
            </Box>
            <Box>
              <Text py={wp(1)}>Deadline</Text>
              <Input
                // w={wp(70)}
                bg='white'
                fontSize={wp(2.5)}
                variant='rounded'
                onFocus={() => this.setState({ showDatePicker: true })}
                caretHidden={true}
                value={(endDate !== '' && endTime !== '') ? `${new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes())}` : 'Press Here to Set a Date and Time'}
              />
            </Box>
          </Stack>
  
          <Box
            p={wp(3)}
          >
            <Text fontSize={wp(4)}>Your Address:</Text>
            <Text py={wp(1)}>{address.replace(/([,][\s])/, `\n`)}</Text>
            <Text fontSize={wp(4)} py={wp(1)}>Your Phone Number:</Text>
            <Text>{phone}</Text>
          </Box>

          { error && <Text textAlign='center' color='red.400'>An error occured. Please try again.</Text> }
  
          <Button
            isLoading={busy}
            w='80%'
            m={wp(5)}
            alignSelf='center'
            onPress={() => this.submit()}
          >Create Job</Button>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode={pickerMode}
            minuteInterval={5}
            onChange={(event, date) => {
              pickerMode === 'date' ?
              this.setState({ pickerMode: 'time', endDate: new Date(date)}) :
              this.setState({ pickerMode: 'date', showDatePicker: false, endTime: new Date(date)})
            }}
          />
        )}

      </ScrollView>
    )
  }
}




















// renderList = () => {
//   let html = []
//   let i = 0
//   let { type, title, description, tip, endDate, endTime } = this.state
//   let list = [
//     // { x: type, y: 'Type', z: 'type' },
//     { x: title, y: 'Title', z: 'title'},
//     { x: description, y: 'Description', z: 'description'},
//     { x: tip, y: 'Tip', z: 'tip'},
//     { x: endDate, y: 'Deadline', z: 'endDate'},
//   ]

//   list.map(x => {
//     html.push(
//       <Box key={i++}>
//         <Text pb={wp(1)}>{x.y}</Text>
//         { x.z === 'type' ?
//           <Select
//             bg='white'
//             selectedValue={type}
//             onValueChange={(k) => this.setState({ type: k })}
//             ref='type'
//           >
//             <Select.Item p={wp(3)} label='Yardwork' value='Yardwork' />
//             <Select.Item p={wp(3)} label='Child Care' value='Child Care' />
//             <Select.Item p={wp(3)} label='Other' value='Other' />
//           </Select> :
//         x.z === 'description' ?
//           <TextArea
//             h={wp(40)}
//             // w={wp(70)}
//             p={wp(2)}
//             bg='white'
//             onChangeText={(k) => this.setState({ description: k })}
//             value={description}
//           /> :
//         x.z === 'endDate' ?
//           <Input
//             // w={wp(70)}
//             bg='white'
//             variant='rounded'
//             onFocus={() => this.setState({ showDatePicker: true })}
//             caretHidden={true}
//             value={(endDate !== '' && endTime !== '') ? `${endDate} at ${endTime}` : 'Press Here to Set a Date and Time'}
//           /> :
//           <Input
//             // w={wp(70)}
//             bg='white'
//             onChangeText={(k) => this.setState({ [x.z]: k })}
//             value={x.x}
//           />
//         }
//       </Box>
//     )
//   })

//   return (
//     <Stack
//       p={wp(3)}
//       mt={wp(2)}
//     >
//       {html}
//     </Stack>
//   )
// }
