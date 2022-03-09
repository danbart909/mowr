import React, { Component } from 'react'
import { format } from 'date-fns'
import { Box, Button, Center, FormControl, Heading, Input, Modal, TextArea, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Context from '../context/Context.js'
import { collection, doc, setDoc, addDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore'
import Gradient from '../config/gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'

export default class UserJobView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      titleNew: '',
      titleShow: false,
      titleBusy: false,
      titleError: false,

      tipNew: '',
      tipShow: false,
      tipBusy: false,
      tipError: false,

      descNew: '',
      descShow: false,
      descBusy: false,
      descError: false,
      
      newDate: '',
      newTime: '',
      endDateTime: new Date(),
      timeShow: false,
      timeBusy: false,
      timeError: false,
      showDatePicker: false,
      pickerMode: 'date'
    }
  }

  static contextType = Context

  componentDidMount() {
    // let { title, tip, description, phone } = this.context.job
    // this.setState({ titleNew: title, tipNew: tip, descNew: description, phoneNew: phone })
  }

  combineDateAndTime = () => {
    let { newDate, newTime } = this.state

    this.setState({ endDateTime: new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newTime.getHours(), newTime.getMinutes()) })
  }

  update = async (x) => {
    let { fire, job } = this.context
    let { newDate, newTime, endDateTime } = this.state

    if (x.x === 'Tip') { x.new = parseInt(x.new) }
    if (x.x === 'Tip' && typeof(x.new) !== 'number') {
      alert('Please Enter a Number')
    } else {
      this.setState({ [x.busyName]: true, [x.errorName]: false })

      if (x.x === 'Deadline') {
        await setDoc(doc(fire, 'jobs', job.id), {
          endDate: endDateTime
        }, { merge: true })
        .then(() => this.setState({ [x.busyName]: false, [x.showName]: false }, () => this.context.refreshUserJobs()))
        .catch(e => console.log('updating error', e))
      } else {
        await setDoc(doc(fire, 'jobs', job.id), {
          [x.y]: x.new
        }, { merge: true })
        .then(() => this.setState({ [x.busyName]: false, [x.showName]: false }, () => this.context.refreshUserJobs()))
        .catch(e => console.log('updating error', e))
      }
    }
  }

  delete = async () => {
    let { fire, job } = this.context
    let emptyJob = { id: '', uid: '', address: '', creationDate: '', description: '', email: '', endDate: '', latitude: 0, longitude: 0, userName: '', phone: '', userId: '', tip: '', title: '', type: '' }

    await deleteDoc(doc(fire, 'jobs', job.id))
      .then(async () => {
        this.context.updateContext('job', emptyJob)
        this.context.refreshUserJobs()
        this.context.navigation.navigate('Manage Jobs')
      })
      .catch(e => console.log('deletion error', e))
  }

  updateThen = (x) => {
    this.setState({ [x.busyName]: false, [x.errorName]: false, [x.showName]: false, [x.newName]: '' })
    this.context.refresh()
    console.log(`${x.x} updated`)
  }

  updateCatch = (e, x) => {
    this.setState({ [x.busyName]: false, [x.errorName]: true })
    console.log(`${x.x} failed to update`, e)
  }

  modals = () => {
    let mr = this.state
    let html = []
    let list = [
      { x: 'Deadline', y: 'deadline', show: mr.timeShow, showName: 'timeShow', new: mr.newDate, newName: 'newDate', busy: mr.timeBusy, busyName: 'timeBusy', error: mr.timeError, errorName: 'timeError' },
      { x: 'Title', y: 'title', show: mr.titleShow, showName: 'titleShow', new: mr.titleNew, newName: 'titleNew', busy: mr.titleBusy, busyName: 'titleBusy', error: mr.titleError, errorName: 'titleError' },
      { x: 'Tip', y: 'tip', show: mr.tipShow, showName: 'tipShow', new: mr.tipNew, newName: 'tipNew', busy: mr.tipBusy, busyName: 'tipBusy', error: mr.tipError, errorName: 'tipError' },
      { x: 'Description', y: 'description', show: mr.descShow, showName: 'descShow', new: mr.descNew, newName: 'descNew', busy: mr.descBusy, busyName: 'descBusy', error: mr.descError, errorName: 'descError' }
    ]

    list.map(x => {
      html.push(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Modal
            key={x.x}
            isOpen={x.show}
            onClose={() => this.setState({ [x.showName]: false })}
          >
            <Modal.Content w={wp(80)}>
            <Modal.CloseButton />
              <Modal.Header>Edit Job</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>{`${x.x}`}</FormControl.Label>
                  {this.renderInput(x)}
                </FormControl>
              </Modal.Body>
              {x.error && <Text bold alignSelf='center' color='red.600'>An Error Occurred, Please Try Again</Text>}
              <Button.Group
                space={wp(2)}
                alignSelf='flex-end'
                pr={wp(2)}
                pb={wp(2)}
              >
                <Button
                  variant='ghost'
                  onPress={() => this.setState({ [x.showName]: false, [x.newName]: '' })}
                >Cancel</Button>
                <Button
                  // colorScheme={job.completed && 'red'}
                  isLoading={x.busy}
                  onPress={() => this.update(x)}
                >Save</Button>
              </Button.Group>
            </Modal.Content>
          </Modal>
        </TouchableWithoutFeedback>
      )
    })

    return html
  }

  renderInput = (x) => {
    let { newDate, newTime, showDatePicker, endDateTime, pickerMode } = this.state
    if (x.x === 'Title') {
      return (
        <Input
          // autoFocus
          onEndEditing={() => Keyboard.dismiss()}
          value={x.new}
          onChangeText={y => this.setState({ [x.newName]: y })}
        />
      )
    } else if (x.x === 'Tip') {
      return (
        <Input
          // autoFocus
          onEndEditing={() => Keyboard.dismiss()}
          value={x.new}
          onChangeText={y => this.setState({ [x.newName]: y })}
        />
      )
    } else if (x.x === 'Description') {
      return (
        <TextArea
          h={wp(40)}
          // w={wp(70)}
          p={wp(2)}
          bg='white'
          onChangeText={(y) => this.setState({ [x.newName]: y })}
          value={x.new}
        />
      )
    } else if (x.x === 'Deadline') {
      return (
        <>
          <Button
            w='50%'
            my={wp(4)}
            p={wp(1)}
            alignSelf='center'
            textAlign='center'
            onPress={() => this.setState({ showDatePicker: true })}
            _text={{ color: 'white' }}
          >Deadline</Button>
          <Input
            // w={wp(70)}
            // p={Platform.OS === 'ios' ? wp(4) : 0}
            // p={wp(3)}
            onEndEditing={() => Keyboard.dismiss()}
            bg='white'
            fontSize={Platform.OS === 'ios' ? wp(3.6) : wp(2.5)}
            variant='rounded'
            // onFocus={() => this.setState({ showDatePicker: true })}
            caretHidden={true}
            value={(newDate !== '' && newTime !== '') ? `${endDateTime}` : 'Press the Button Above to Set a Date and Time'}
          />
          {showDatePicker && (
            <DateTimePicker
              value={endDateTime}
              mode={pickerMode}
              // mode={Platform.OS === 'ios' ? 'datetime' : pickerMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minuteInterval={5}
              onChange={async (event, date) => {
                pickerMode === 'date' ?
                this.setState({ pickerMode: 'time', newDate: new Date(date)}) :
                this.setState({ pickerMode: 'date', showDatePicker: false, newTime: new Date(date)}, () => this.combineDateAndTime())
              }}
            />
          )}
        </>
      )
    }
  }

  renderList = () => {
    let { job } = this.context
    let html = []
    let formatCreationDate = () => {
      if (job.creationDate) {
        // console.log('creationDate 1', job.creationDate.seconds)
        return format(new Date(job.creationDate.seconds*1000), 'E, PP')
      } else {
        // console.log('creationDate 2', job.creationDate.seconds)
        return format(new Date(), 'E, PP')
      }
    }
    let formatEndDate = () => {
      if (job.endDate) {
        // console.log('endDate 1', job.endDate.seconds)
        return format(new Date(job.endDate.seconds*1000), 'E, PPp')
      } else {
        // console.log('endDate 2', job.endDate.seconds)
        return format(new Date(), 'E, PPp')
      }
    }
    let list = [
      { name: 'Title', value: job.title, show: 'titleShow', busy: 'titleBusy', error: 'titleError' },
      { name: 'Tip', value: `$ ${job.tip}`, show: 'tipShow', busy: 'tipBusy', error: 'tipError' },
      { name: 'Description', value: job.description, show: 'descShow', busy: 'descBusy', error: 'descError' },
      { name: 'Creation Date', value: formatCreationDate(), show: '', busy: '', error: '' },
      { name: 'Deadline', value: formatEndDate(), show: 'timeShow', busy: 'timeBusy', error: 'timeError' },
      { name: 'Type', value: job.type, show: '', busy: '', error: '' },
      { name: 'Address', value: job.address.replace(/([,][\s])/, `\n`), show: '', busy: '', error: '' },
      { name: 'Phone', value: job.phone, show: '', busy: '', error: '' },
      { name: 'Email', value: job.email, show: '', busy: '', error: '' },
    ]

    list.map(x => {
      html.push(
        <Stack
          key={x.name}
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
            <Heading py={wp(1)}>{x.name}</Heading>
            {x.show ?
              <Text
                bold
                px={wp(2)}
                py={wp(1)}
                mr={wp(1)}
                mt={wp(1)}
                color='primary.1'
                borderColor='primary.1'
                borderWidth='1'
                onPress={() => this.setState({ [x.show]: true })}
              >Edit</Text> : null}
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
            >{x.value}</Text>
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
  
    let { pickerMode, showDatePicker } = this.state

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView bg='primary.1'>
  
            <Gradient
              m={wp(4)}
              p={wp(3)}
            >
              {this.renderList()}
              <Button
                w={wp(60)}
                my={wp(5)}
                alignSelf='center'
                onPress={() => this.delete()}
              >Delete</Button>
            </Gradient>
    
            {this.modals()}
    
            {/* {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode={pickerMode}
                minuteInterval={5}
                onChange={(event, date) => {
                  pickerMode === 'date' ?
                  this.setState({ pickerMode: 'time', newDate: new Date(date)}) :
                  this.setState({ pickerMode: 'date', showDatePicker: false, newTime: new Date(date)})
                }}
              />
            )} */}
  
        </ScrollView>
      </TouchableWithoutFeedback>
    )
  }
}