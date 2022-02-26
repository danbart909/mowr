import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, Factory, FlatList, Input, Modal, Spinner, Text, Select, Stack, Row, Switch } from 'native-base'
import { ScrollView } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Constants from 'expo-constants'
import Geocoder from 'react-native-geocoding'
import MapView, { Marker } from 'react-native-maps'
import { getDistance } from 'geolib'
import { format } from 'date-fns'
import { collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore'
import Gradient from '../config/gradient'

const { civicAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

export default class SearchJobs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortBy: 'distance',
      sortDirection: 'asc',
      sortType: 'Any',
      sortByForSidebar: 'distance',
      busy: false,
      error: false,
      inputZip: '',
      showPageSelectModal: false,
    }
  }

  static contextType = Context

  search = async () => {
    let { zip } = this.context
    let { inputZip } = this.state

    if (zip === '') {
      alert('Please Enter a Zip Code')
    } else {
      this.setState({ busy: true, error: false })

      inputZip !== '' && await this.geocode()

      this.queryToFirebase()
    }
  }

  geocode = async () => {
    await Geocoder.from(this.context.zip)
    .then(async x => {
      let lat = x.results[0].geometry.location.lat
      let lng = x.results[0].geometry.location.lng
      this.context.updateContext('geo', { latitude: lat, longitude: lng })
      console.log('GPS coordinates for calculating distances retrieved', x.results[0].geometry.location)
    })
    .catch(e => console.log('error', e))
  }

  queryToFirebase = async () => {
    let { fire, geo } = this.context
    let { sortBy, sortDirection, sortType } = this.state
    let jobs = []
    let rawJobs = []
    let newJobs = []
    let pages = []
    let lat = []
    let lng = []
    // , where('type', '==', sortType)

    if (sortBy !== 'distance') {
      if (sortType === 'Any') {
        rawJobs = await getDocs(query(collection(fire, 'jobs'), orderBy(sortBy, sortDirection)))
        rawJobs.forEach((x) => {
          let data = x.data()
          data.id = x.id
          jobs.push(data)
        })
        newJobs = jobs.filter(value => Object.keys(value).length > 1)
      } else {
        rawJobs = await getDocs(query(collection(fire, 'jobs'), orderBy(sortBy, sortDirection), where('type', '==', sortType)))
        rawJobs.forEach((x) => {
          let data = x.data()
          data.id = x.id
          jobs.push(data)
        })
        newJobs = jobs.filter(value => Object.keys(value).length > 1)
      }
      
    } else {
      if (sortType === 'Any') {
        rawJobs = await getDocs(collection(fire, 'jobs'))
        rawJobs.forEach((x) => {
          let data = x.data()
          data.id = x.id
          jobs.push(data)
        })
        newJobs = jobs.filter(value => Object.keys(value).length > 1)
      } else {
        rawJobs = await getDocs(collection(fire, 'jobs'), where('type', '==', sortType))
        rawJobs.forEach((x) => {
          let data = x.data()
          data.id = x.id
          jobs.push(data)
        })
        newJobs = jobs.filter(value => Object.keys(value).length > 1)
      }
         
      if (sortDirection === 'asc') {
        console.log(1.2)
        newJobs.sort((a, b) =>
          (getDistance({ latitude: geo.latitude, longitude: geo.longitude },
          { latitude: a.latitude, longitude: a.longitude }) >
          getDistance({ latitude: geo.latitude, longitude: geo.longitude },
          { latitude: b.latitude, longitude: b.longitude})) ? 1 : -1)
        console.log(1.3)
      } else {
        newJobs.sort((a, b) =>
          (getDistance({ latitude: geo.latitude, longitude: geo.longitude },
          { latitude: a.latitude, longitude: a.longitude }) >
          getDistance({ latitude: geo.latitude, longitude: geo.longitude },
          { latitude: b.latitude, longitude: b.longitude})) ? -1 : 1)
      }
    }

    console.log(2, newJobs)

    newJobs.map(x => {
      lat.push(x.latitude)
      lng.push(x.longitude)
    })

    console.log(3)

    let jobsCopy = [...newJobs]
    while (jobsCopy.length > 0) {
      pages.push(jobsCopy.splice(0, 5))
    }

    console.log(4)

    this.context.updateContext('jobSearchResults', newJobs)
    console.log(4.1)
    this.context.updateContext('jobWindow', newJobs[0])
    console.log(4.2)
    this.context.updateContext('results', { lat: lat, lng: lng })
    console.log(4.3)
    this.context.updateContext('pagination', { current: 0, visibleJobs: pages[0], pages: pages })

    console.log(5)

    this.setState({ sortByForSidebar: sortBy, inputZip: '', busy: false, error: false })

    console.log(newJobs)
  }

  switchOrder = () => {
    let { sortDirection } = this.state

    sortDirection === 'desc' ? this.setState({ sortDirection: 'asc' }) :
    sortDirection === 'asc' ? this.setState({ sortDirection: 'desc' }) : null
  }

  calcDistance = (lat, lng) => {
    let { geo } = this.context
    let geo1 = { lat: geo.latitude, lng: geo.longitude }
    let geo2 = { lat: lat, lng: lng }
    let meters = getDistance(geo1, geo2)
    let feetBig = meters*3.2808
    let feetRounded = Math.round(feetBig*100)/100
    let milesBig = feetBig/5280
    let milesRounded = Math.round(milesBig*100)/100
    let str = ``

    feetRounded < 2000 ?
    str = `${feetRounded} feet away` :
    str = `${milesRounded} miles away`

    return str
  }

  renderMarkers = () => {
    let { lat, lng } = this.context.results
    let html = []

    if (lat.length !== 0) {
      for (let i = 0; i < lat.length; i++) {
        html.push(
          <Marker
            key={i}
            coordinate={{ latitude: lat[i], longitude: lng[i] }}
            onPress={() => this.context.updateContext('jobWindow', this.context.jobSearchResults[i])}
          />
        )
      }
    }

    return html
  }

  resultsView = () => {
    let { jobSearchResults, jobWindow } = this.context
    let { error } = this.state

    if (error) {
      return (
        <Center
          flex='1'
          justifyContent='center'
        >
          <Center
            alignItems='center'
            w='95%'
            h='95%'
            bg='white'
            borderRadius='40'
          >
            <Text>An error occurred, please try again.</Text>
          </Center>
        </Center>
      )
    }

    if (jobWindow.title) {
      return (
        <Center
          flex='1'
          justifyContent='center'
          // borderWidth='1'
        >
          <Gradient
            h='95%'
            w='95%'
            p={wp(1.5)}
            justifyContent='space-between'
            alignItems='stretch'
            // borderWidth='1'
          >
            <Row
              alignItems='flex-start'
              my={wp(1)}
              // borderWidth='1'
              // borderBottomWidth='1'
            >
              <Box
                flex='8'
                // p={wp(1)}
                // borderWidth='1'
              >
                <Text fontSize={wp(4)}>{jobWindow.title}</Text>
              </Box>
              <Box
                flex='3'
                // p={wp(1)}
                // borderWidth='1'
              >
                <Text fontSize={wp(4)} textAlign='right'>${jobWindow.tip}</Text>
              </Box>
            </Row>
  
            <Row
              // px={wp(2)}
              justifyContent='space-between'
              // borderWidth='1'
            >
              <Box
                alignItems='flex-start'
                // borderWidth='1'
              >
                <Text>{`${this.calcDistance(jobWindow.latitude, jobWindow.longitude)}`}</Text>
              </Box>
              <Box
                alignItems='flex-end'
                // borderWidth='1'
              >
                <Text borderBottomWidth='1' textAlign='right'>Job Poster</Text>
                <Text>{jobWindow.userName}</Text>
              </Box>
            </Row>
  
            <Row
              justifyContent='space-between'
              // px={wp(2)}
              mb={wp(2)}
              // borderWidth='1'
            >
              <Box
                alignItems='flex-start'
                // borderWidth='1'
              >
                <Text borderBottomWidth='1'>Type</Text>
                <Text>{jobWindow.type}</Text>
              </Box>
              <Box
                alignItems='flex-end'
                // borderWidth='1'
              >
                <Text textAlign='right' lineHeight={wp(4)} maxWidth={wp(40)}>{jobWindow.address.replace(/([,][\s])/, `\n`)}</Text>
              </Box>
            </Row>
  
            <Row
              justifyContent='space-between'
              // px={wp(2)}
              // borderWidth='1'
            >
              <Box
                flex='1'
                alignItems='flex-start'
                // borderWidth='1'
              >
                <Text borderBottomWidth='1' pb={wp(.5)}>Creation Date</Text>
                <Text lineHeight={wp(3.2)} pt={wp(.5)}>{format(new Date(jobWindow.creationDate.seconds*1000), 'E, PP')}</Text>
              </Box>
              <Box
                flex='1'
                alignItems='flex-end'
                // borderWidth='1'
              >
                <Text borderBottomWidth='1' pb={wp(.5)}>Deadline</Text>
                <Text textAlign='right' pt={wp(.5)} lineHeight={wp(4)}>{format(new Date(jobWindow.endDate.seconds*1000), 'E, PPp')}</Text>
              </Box>
            </Row>
  
            <Center
              // borderWidth='1'
            >
              <Button
                my={wp(1.5)}
                onPress={async () => {
                  this.context.updateContext('job', jobWindow)
                  this.context.navigation.navigate('Job View')
                }}
                >VIEW JOB</Button>
            </Center>
          
          </Gradient>
        </Center>
      )
    } else if (jobWindow.title === '' && jobSearchResults.length !== 0) {
      return (
        <Center
          flex='1'
          justifyContent='center'
        >
          <Center
            alignItems='center'
            w='95%'
            h='95%'
            px='15%'
            bg='white'
            borderRadius='40'
          >
            <Text textAlign='center'>Select a job to the left to see more about it here.</Text>
          </Center>
        </Center>
      )
    } else {
      return (
        <Center
          flex='1'
          justifyContent='center'
        >
          <Gradient
            flex='1'
            justifyContent='center'
            w='90%'
            my={wp(2)}
            p={wp(2)}
          >
            <Text textAlign='center'>No job to display.</Text>
          </Gradient>
        </Center>
      )
    }
  }

  renderResultsSidebar = () => {
    let { jobWindow, pagination } = this.context
    let { sortByForSidebar, busy } = this.state
    let selectedJob = (x) => { return x.title === jobWindow.title ? true : false }
    let excerpt = (x) => {
      if (sortByForSidebar === 'distance') {
        return this.calcDistance(x.latitude, x.longitude)
      } else if (sortByForSidebar === 'tip') {
        return `$${x.tip}`
      } else if (sortByForSidebar === 'creationDate') {
        return format(new Date(x.creationDate.seconds*1000), 'E, PP')
      } else {
        return format(new Date(x.endDate.seconds*1000), 'E, PPp')
      }
    }

    if (busy) {
      return (
        <Center
          flex='1'
          justifyContent='center'
          bg='primary.1'
        >
          {/* <Center
            alignItems='center'
            w='95%'
            h='95%'
            bg='white'
            borderRadius='40'
          > */}
            <Spinner size={wp(20)} color='white' />
          {/* </Center> */}
        </Center>
      )
    }
    
    if (pagination.visibleJobs.length) {
      return (
        <FlatList
          data={pagination.visibleJobs}
          keyExtractor={item => item.title}
          ref={x => this.sideList = x}
          renderItem={({item, index}) => (
            <Stack
              borderBottomWidth='1'
              bg={selectedJob(item) ? 'primary.101' : 'white'}
            >
              <Text
                flex='5'
                p={wp(1)}
                // pl={wp(2)}
                numberOfLines={1}
                color={selectedJob(item) ? 'white' : 'black'}
                onPress={() => this.context.updateContext('jobWindow', item)}
                // borderWidth='1'
              >#{(pagination.current*5)+(index+1)}: {item.title}</Text>
              <Text
                flex='1'
                p={wp(1)}
                textAlign='right'
                numberOfLines={1}
                color={selectedJob(item) ? 'white' : 'black'}
                onPress={() => this.context.updateContext('jobWindow', item)}
                // borderWidth='1'
              >{excerpt(item)}</Text>
            </Stack>
          )}
        />
      )
    } else {
      return (
        <Center
          flex='1'
          px={wp(10)}
          bg='primary.1'
          justifyContent='center'
        >
          <Text
            textAlign='center'
            color='white'
          >Search for jobs to see a list of them here.</Text>
        </Center>
      )
    }
  }

  renderPagination = () => {
    let { pagination } = this.context
    let { current, pages } = pagination
    let leftPress = () => {
      if (current > 0) {
      let newPagination = { current: current-1, visibleJobs: pages[current-1], pages }
      this.context.updateContext('pagination', newPagination)
      }
    }
    let rightPress = () => {
      if (current+1 < pages.length) {
        let newPagination = { current: current+1, visibleJobs: pages[current+1], pages }
        this.context.updateContext('pagination', newPagination)
      }
    }
    // let selectOptions = () => {
    //   let html = []
    //   for (let i = 0; i < pages.length; i++) {
    //     html.push(<Select.Item p={wp(3)} key={`${i+1}`} label={`${i+1}`} value={`${i+1}`}/>)
    //   }
    //   return html
    // }

    return (
      <>
        <Row
          flex='1'
          alignItems='stretch'
          // borderWidth='1'
        >
          <Center
            flex='1'
            bg='primary.101'
            borderRightWidth='1'
            onStartShouldSetResponder={() => leftPress()}
          >
            <Text color='white'>{`<`}</Text>
          </Center>
          <Center flex='2'>
            <Text
              w='100%'
              h='100%'
              pt='10%'
              textAlign='center'
              onPress={() => pages.length > 0 && this.setState({ showPageSelectModal: true })}
            >{current+1} / {pages.length}</Text>
          </Center>
          <Center
            flex='1'
            bg='primary.101'
            borderLeftWidth='1'
            onStartShouldSetResponder={() => rightPress()}
          >
            <Text color='white'>{`>`}</Text>
          </Center>
        </Row>
      </>
    )
  }

  renderModal = () => {
    let { pagination } = this.context
    let { current, visibleJobs, pages } = pagination
    let modalBody = () => {
      let html = []
      for (let i = 0; i < pages.length; i++) {
        html.push(
          <Button
            w='50%'
            my={wp(3)}
            key={`${i}`}
            onPress={async () => {
              this.context.updateContext('pagination', { current: i, visibleJobs: pages[i], pages })
              this.setState({ showPageSelectModal: false })
            }}
          >{i+1}</Button>
        )
      }
      return html
    }

    return (
      <Modal
        isOpen={this.state.showPageSelectModal}
        onClose={() => this.setState({ showPageSelectModal: false })}
      >
        <Modal.Content
          maxWidth={wp(50)}
          maxHeight={wp(75)}
        >
          <Modal.CloseButton />
          <Modal.Header>Select a Page</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <Center>
                {modalBody()}
              </Center>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                onPress={() => this.setState({ showPageSelectModal: false })}
              >Cancel</Button>
          </Button.Group>
        </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
  }

  render() {
    
    let { zip, geo, job } = this.context
    let { sortBy, sortType } = this.state

    return (
      <>
        <Stack
          bg='coolGray.300'
          py={wp(2)}
          space={wp(2)}
          alignItems='center'
        >
          <Row
            justifyContent='space-evenly'
            w='90%'
            alignItems='center'
          >
            <Box
              flex='1'
              alignItems='center'
              // borderWidth='1'
            >
              <Text pb={wp(1)}>Zip Code:</Text>
              <Input
                placeholder='e.g. 30102'
                w='75%'
                // my={wp(2)}
                bg='white'
                // borderWidth='1'
                onChangeText={(x) => {
                  this.setState({ inputZip: x })
                  this.context.updateContext('zip', x)
                }}
                value={zip}
              />
            </Box>
            <Box
              flex='1'
              alignItems='center'
              // borderWidth='1'
            >
              <Text pb={wp(1)}>Sort By:</Text>
              <Select
                selectedValue={sortBy}
                accessibilityLabel='Sort By'
                onValueChange={x => this.setState({ sortBy: x })}
                w='90%'
                // variant='underlined'
                // borderColor='black'
                bg='white'
                // borderWidth='1'
              >
                <Select.Item p={wp(3)} label='Distance' value='distance'/>
                <Select.Item p={wp(3)} label='Tip' value='tip'/>
                <Select.Item p={wp(3)} label='Created Date' value='creationDate'/>
                <Select.Item p={wp(3)} label='Ending Date' value='endDate'/>
              </Select>
            </Box>
            <Box
              flex='1'
              alignItems='center'
              // borderWidth='1'
            >
              <Text>Order By:</Text>
              <Row
                justifyContent='space-evenly'
                px={wp(5)}
                // borderWidth='1'
              >
                <Text alignSelf='center' pr={wp(6)}>asc</Text>
                <Switch
                  // size='sm'
                  marginLeft='0'
                  offTrackColor='green.700'
                  offThumbColor='green.300'
                  onChange={() => this.switchOrder()}
                />
                <Text alignSelf='center' pl={wp(5)}>desc</Text>
              </Row>
            </Box>
            <Box
              flex='1'
              alignItems='center'
              // borderWidth='1'
            >
              <Text pb={wp(1)}>Type:</Text>
              <Select
                selectedValue={sortType}
                accessibilityLabel='Sort Type'
                onValueChange={x => this.setState({ sortType: x })}
                w='90%'
                // borderColor='black'
                bg='white'
                // borderWidth='1'
              >
                <Select.Item p={wp(3)} label='Any' value='Any'/>
                <Select.Item p={wp(3)} label='Yardwork' value='Yardwork'/>
                <Select.Item p={wp(3)} label='Child Care' value='Child Care'/>
                <Select.Item p={wp(3)} label='Other' value='Other'/>
              </Select>
            </Box>
          </Row>
  
          <Button
            onPress={() => this.search()}
            // my={wp(2)}
          >SEARCH</Button>
  
        </Stack>

        <Stack
          flex='1'
          borderTopWidth='1'
        >
          <Row
            flex='5'
          >
            <Stack flex='2'>
              <Box
                flex='8'
                bg='primary.1'
              >
                {this.renderResultsSidebar()}
              </Box>
              <Center
                flex='1'
                borderTopWidth='1'
                borderBottomWidth='1'
              >
                {this.renderPagination()}
              </Center>
            </Stack>
            <Box
              flex='3'
              bg='primary.1'
            >
              {this.resultsView()}
            </Box>
          </Row>
          <Box
            flex='4'
          >
            <MapView
              style={{ height: '100%', width: '100%' }}
              // scrollEnabled
              region={{
                latitude: job.latitude === 0 ? geo.latitude : job.latitude,
                longitude: job.longitude === 0 ? geo.longitude : job.longitude,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
              }}
            >
              { this.renderMarkers() }
            </MapView>
          </Box>
        </Stack>

        {this.renderModal()}

        {/* { this.context.jobSearchResults.length >= 3 && <Button
          position='absolute'
          justifyContent='center'
          alignItems='center'
          right={wp(5)}
          bottom={wp(5)}
          boxSize={wp(10)}
          bg='white'
          borderRadius='50'
          borderColor='primary.1'
          borderWidth='1'
          // onPress={() => console.log(this.list.getScrollResponder())}
          onPress={() => this.list.scrollToIndex({ index: 0 })}
        >
          <FontAwesomeIcon icon={faArrowUp} size={wp(4)}/>
        </Button> } */}
      </>
    )
  }
}