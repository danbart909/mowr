import * as dFNS from 'date-fns'
import { Box, Button, Center, FormControl, Heading, Input, Modal, TextArea, ScrollView, Spinner, Stack, Text } from 'native-base'
import React, { Component } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import DateTimePicker from '@react-native-community/datetimepicker'
import Context from '../context/Context.js'
import * as database from 'firebase/database'

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

      phoneNew: '',
      phoneShow: false,
      phoneBusy: false,
      phoneError: false,

      completionShow: false,
      completionBusy: false,
      completionError: false,
      
      deleteShow: false,
      deleteBusy: false,
      deleteError: false,

      showDatePicker: false,
    }
  }

  static contextType = Context

  componentDidMount() {
    // let { title, tip, description, phone } = this.context.job
    // this.setState({ titleNew: title, tipNew: tip, descNew: description, phoneNew: phone })
  }

  update = async (x) => {
    let { db, job } = this.context
    let { ref, update } = database

    if (x.x === 'Tip') { x.new = parseInt(x.new) }

    if (x.x === 'Tip' && typeof(x.new) !== 'number') {
      alert('Please Enter a Number')
    } else {
      this.setState({ [x.busyName]: true, [x.errorName]: false })
      x.x === 'Completion Status' ?
        update(ref(db, 'jobs/' + job.key), { 'completed': true })
          .then(() => this.updateThen(x))
          .catch((e) => this.updateCatch(e, x)) :
        update(ref(db, 'jobs/' + job.key), { [x.y]: x.new })
          .then(() => this.updateThen(x))
          .catch((e) => this.updateCatch(e, x))
    }
  }

  delete = async (x) => {
    let { db, job } = this.context
    let { ref, update, remove } = database
    let emptyJob = { ID: '', address: '', completed: false, creationDate: new Date(), description: '', email: '', endDate: new Date(), geo: {}, key: '', name: '', phone: '', provider: '', tip: [], title: [], type: '' }

    this.setState({ [x.busyName]: true, [x.errorName]: false })

    remove(ref(db, 'jobs/' + job.key))
      .then(() => this.updateThen(x))
      .catch((e) => this.updateCatch(e, x))

    this.context.updateContext('job', emptyJob)
    this.context.navigation.navigate('Manage Jobs')
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
    let { job } = this.context
    let html = []
    let list = [
      { x: 'Title', y: 'title', show: mr.titleShow, showName: 'titleShow', new: mr.titleNew, newName: 'titleNew', busy: mr.titleBusy, busyName: 'titleBusy', error: mr.titleError, errorName: 'titleError' },
      { x: 'Tip', y: 'tip', show: mr.tipShow, showName: 'tipShow', new: mr.tipNew, newName: 'tipNew', busy: mr.tipBusy, busyName: 'tipBusy', error: mr.tipError, errorName: 'tipError' },
      { x: 'Description', y: 'description', show: mr.descShow, showName: 'descShow', new: mr.descNew, newName: 'descNew', busy: mr.descBusy, busyName: 'descBusy', error: mr.descError, errorName: 'descError' },
      { x: 'Phone', y: 'phone', show: mr.phoneShow, showName: 'phoneShow', new: mr.phoneNew, newName: 'phoneNew', busy: mr.phoneBusy, busyName: 'phoneBusy', error: mr.phoneError, errorName: 'phoneError' },
      { x: 'Completion Status', y: 'completed', show: mr.completionShow, showName: 'completionShow', new: 'true', newName: '', busy: mr.completionBusy, busyName: 'completionBusy', error: mr.completionError, errorName: 'completionError' },
      { x: 'Delete', y: 'delete', show: mr.deleteShow, showName: 'deleteShow', new: '', newName: '', busy: mr.deleteBusy, busyName: 'deleteBusy', error: mr.deleteError, errorName: 'deleteError' }
    ]

    list.map(x => {
      html.push(
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
                onPress={() => job.completed ? this.delete(x) : this.update(x)}
              >{!x.busy && job.completed ? 'Delete' : 'Save'}</Button>
            </Button.Group>
          </Modal.Content>
        </Modal>
      )
    })

    return html
  }

  renderInput = (x) => {
    if (x.x === 'Title') {
      return (
        <Input
          value={x.new}
          onChangeText={y => this.setState({ [x.newName]: y })}
        />
      )
    } else if (x.x === 'Tip') {
      return (
        <Input
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
    } else if (x.x === 'Phone') {
      return (
        <Input
          value={x.new}
          onChangeText={y => this.setState({ [x.newName]: y })}
        />
      )
    } else if (x.x === 'Completion Status') {
      return (
        <Text>Are you sure you want to mark this job as completed? This will remove it from the job search. You can undo this later if you change your mind. Press "Save" to continue with marking this job as completed, otherwise press "Cancel".</Text>
      )
    } else {
      return (
        <Text>This will delete the job forever, are you sure?</Text>
      )
    }
  }

  renderList = () => {
    let { job } = this.context
    let html = []
    let list = [
      { name: 'Type', value: job.type, show: '', busy: '', error: ''},
      { name: 'Creation Date', value: dFNS.format(new Date(job.creationDate), 'EEEE, PPP'), show: '', busy: '', error: ''},
      { name: 'Deadline', value: dFNS.format(new Date(job.endDate), 'EEEE PPP'), show: '', busy: '', error: ''},
      { name: 'Title', value: job.title, show: 'titleShow', busy: 'titleBusy', error: 'titleError'},
      { name: 'Address', value: job.address.replace(/([,][\s])/, `\n`), show: '', busy: '', error: ''},
      { name: 'Tip', value: `$ ${job.tip}`, show: 'tipShow', busy: 'tipBusy', error: 'tipError'},
      { name: 'Description', value: job.description, show: 'descShow', busy: 'descBusy', error: 'descError'},
      { name: 'Phone', value: job.phone, show: 'phoneShow', busy: 'phoneBusy', error: 'phoneError'},
      { name: 'Email', value: job.email, show: '', busy: '', error: ''},
      { name: 'Completion Status', value: job.completed ? 'Completed' : 'Not Completed', show: 'completionShow', busy: '', error: ''}
    ]

    list.map(x => {
      html.push(
        <Stack
          key={x.name}
          direction='row'
          w='100%'
          justifyContent='space-between'
          borderBottomWidth='1'
        >
          <Box
            w='23%'
            p={wp(1)}
          >
            <Text>{x.name}</Text>
          </Box>
          <Box
            w='63%'
            p={wp(1)}
          >
            <Text>{x.value}</Text>
          </Box>
          <Box
            w='14%'
            p={wp(1)}
            alignItems='center'
          >
            {(x.show && list[9].value !== 'Completed') ? <Text bold underline color='green.600' onPress={() => this.setState({ [x.show]: true })}>Edit</Text> : (x.show && x.value === 'Completed') ? <Text bold underline color='green.600' onPress={() => this.setState({ deleteShow: true })}>Delete</Text> : null}
          </Box>
        </Stack>
      )
    })

    return html
  }

  render() {
    return (
      <Center>

        {this.renderList()}

        {this.modals()}

        {this.context.job.completed && <Center p={wp(10)}><Text textAlign='center'>You have marked this job as completed. It will be automatically deleted in two weeks.</Text></Center>}

        {this.state.showDatePicker && (
          <DateTimePicker
            value={new Date()}
            onChange={(event, date) => this.setState({ deadlineNew: dFNS.format(date, 'yyyy-MM-dd'), showDatePicker: false })}
          />
        )}

      </Center>
    )
  }
}