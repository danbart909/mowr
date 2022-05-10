import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Checkbox, Center, Heading, Factory, FlatList, Input, Modal, ScrollView, Spinner, Text, Select, Stack, Row, Switch } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowUp, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Constants from 'expo-constants'
import Geocoder from 'react-native-geocoding'
import MapView, { Marker } from 'react-native-maps'
import { getDistance } from 'geolib'
import { format } from 'date-fns'
import { collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore'
import { LinearGradient } from 'expo-linear-gradient'
import { Animated, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { WText, SText, animHideAndSlideUp, animSlideDownAndShow, heightTo1, heightTo0, fadeInText, fadeOutText } from '../config/helper.js'

const { civicAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

export default class SearchJobs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortBy: 'distance',
      sortDirection: 'asc',
      sortType: 'Any',
      maxRadius: '10',
      sortByForSidebar: 'distance',
      busy: false,
      error: false,
      inputZip: '',
      showPageSelectModal: false,
      keyboard: false,
      hideSearch: false,
      hideMap: false,
      animBarHeight: new Animated.Value(0),
      animRotate: new Animated.Value(0),
      animMapHeight: new Animated.Value(0),
      animTextOpacity: new Animated.Value(0),
    }
  }

  static contextType = Context

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.setState({ keyboard: true })
    )
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({ keyboard: false }
    ))
  }
    
  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  

  search = async () => {
    let { zip } = this.context
    let { inputZip } = this.state

    if (zip === '') {
      alert('Please Enter a Zip Code')
    } else {
      Keyboard.dismiss()
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
    let { sortBy, sortDirection, sortType, maxRadius } = this.state
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
        newJobs.sort((a, b) =>
          (getDistance({ latitude: geo.latitude, longitude: geo.longitude },
          { latitude: a.latitude, longitude: a.longitude }) >
          getDistance({ latitude: geo.latitude, longitude: geo.longitude },
          { latitude: b.latitude, longitude: b.longitude})) ? 1 : -1)
      } else {
        newJobs.sort((a, b) =>
          (getDistance({ latitude: geo.latitude, longitude: geo.longitude },
          { latitude: a.latitude, longitude: a.longitude }) >
          getDistance({ latitude: geo.latitude, longitude: geo.longitude },
          { latitude: b.latitude, longitude: b.longitude})) ? -1 : 1)
      }
    }

    newJobs.map(x => {
      lat.push(x.latitude)
      lng.push(x.longitude)
    })
    
    console.log(newJobs)

    let distancedJobs = newJobs.filter(x => parseInt(maxRadius) > this.calcDistanceForFilter(x.latitude, x.longitude))

    console.log(distancedJobs)

    console.log(maxRadius, parseInt(maxRadius))

    console.log(this.calcDistanceForFilter(distancedJobs[0].latitude, distancedJobs[0].longitude))

    let jobsCopy = [...distancedJobs]
    while (jobsCopy.length > 0) {
      pages.push(jobsCopy.splice(0, 10))
    }

    this.context.updateContext('jobSearchResults', distancedJobs)
    this.context.updateContext('jobWindow', distancedJobs[0])
    this.context.updateContext('results', { lat: lat, lng: lng })
    this.context.updateContext('pagination', { current: 0, visibleJobs: pages[0], pages: pages })

    // let jobsCopy = [...newJobs]
    // while (jobsCopy.length > 0) {
    //   pages.push(jobsCopy.splice(0, 10))
    // }


    // this.context.updateContext('jobSearchResults', newJobs)
    // this.context.updateContext('jobWindow', newJobs[0])
    // this.context.updateContext('results', { lat: lat, lng: lng })
    // this.context.updateContext('pagination', { current: 0, visibleJobs: pages[0], pages: pages })

    this.setState({ sortByForSidebar: sortBy, inputZip: '', busy: false, error: false })

    // console.log(newJobs)
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

  calcDistanceForFilter = (lat, lng) => {
    let { maxRadius } = this.state
    let { geo } = this.context
    let geo1 = { lat: geo.latitude, lng: geo.longitude }
    let geo2 = { lat: lat, lng: lng }
    let meters = getDistance(geo1, geo2)
    let feetBig = meters*3.2808
    let feetRounded = Math.round(feetBig*100)/100
    let milesBig = feetBig/5280
    let milesRounded = Math.round(milesBig*100)/100
    let str = ``

    return milesRounded
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
            onPress={() => {
              this.changePageOnMarkerPress(this.context.jobSearchResults[i].id)
              this.context.updateContext('jobWindow', this.context.jobSearchResults[i])
            }}
          />
        )
      }
    }

    return html
  }

  changePageOnMarkerPress = (id) => {
    let { pagination } = this.context
    let html = []
    let i = 0

    pagination.pages.map(x => {
      if (x.find(y => y.id === id)) {
        pagination.current = i
        pagination.visibleJobs = pagination.pages[i]
        this.context.updateContext('pagination', pagination )
      }
      i++
    })
  }

  resultsView = () => {
    let { jobSearchResults, jobWindow } = this.context
    let { error, hideMap, hideSearch, animTextOpacity } = this.state
    let opacityValue = animTextOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })

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
            <SText>An error occurred, please try again.</SText>
          </Center>
        </Center>
      )
    }

    if (jobWindow.title) {
      return (
        <Box flex='1'>
          <Box
            flex='1'
          >
            <LinearGradient
              colors={['#289d15', '#ffffff']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={{ flex: 1, padding: wp(2) }}
            >
              <Row
                flex={1.5}
                alignItems='center'
                // borderWidth='1'
              >
                <Box flex='8'>
                  <SText noOfLines={2}>{jobWindow.title}</SText>
                </Box>
                <Box flex='3'>
                  <SText textAlign='right'>${jobWindow.tip}</SText>
                </Box>
              </Row>
    
              <Row
                flex={2}
                justifyContent='space-between'
                // borderWidth='1'
              >
                <Box
                  alignItems='flex-start'
                  justifyContent='center'
                  flex='1'
                >
                  <SText>{`${this.calcDistance(jobWindow.latitude, jobWindow.longitude)}`}</SText>
                </Box>
                <Box
                  alignItems='flex-end'
                  justifyContent='center'
                  flex='1'
                >
                  <SText textAlign='right'>Job Poster:</SText>
                  <SText textAlign='right'>{jobWindow.userName}</SText>
                </Box>
              </Row>
    
              <Row
                flex={2}
                justifyContent='space-between'
                // borderWidth='1'
                // mb={wp(1)}
              >
                <Box
                  alignItems='flex-start'
                  justifyContent='center'
                >
                  <SText>Type:</SText>
                  <SText>{jobWindow.type}</SText>
                </Box>
                <Box
                  alignItems='flex-end'
                  justifyContent='center'
                >
                  <SText textAlign='right' maxWidth={wp(40)} noOfLines={3}>{jobWindow.address.replace(/([,][\s])/, `\n`)}</SText>
                </Box>
              </Row>

              {(hideSearch || hideMap) &&
              <Animated.View
                flex={2.5}
                // mb={wp(2)}
                justifyContent='center'
                // borderWidth='1'
                // opacity={animTextOpacity}
              >
                <SText noOfLines={(hideSearch && hideMap) ? 8 : 4}>{jobWindow.description}</SText>
              </Animated.View>}
    
              <Row
                flex={2}
                justifyContent='space-between'
                // mt={wp(2)}
                // borderWidth='1'
              >
                <Box
                  flex='1'
                  alignItems='flex-start'
                  justifyContent='center'
                >
                  <SText pb={wp(.5)}>Created:</SText>
                  <SText>{format(new Date(jobWindow.creationDate.seconds*1000), 'E, PP')}</SText>
                </Box>
                <Box
                  flex='1'
                  alignItems='flex-end'
                  justifyContent='center'
                >
                  <SText pb={wp(.5)}>Deadline:</SText>
                  <SText textAlign='right'>{format(new Date(jobWindow.endDate.seconds*1000), 'E, PPp')}</SText>
                </Box>
              </Row>
    
              <Center
                flex={1.4}
                // borderWidth='1'
              >
                <Button
                  onPress={async () => {
                    this.context.updateContext('job', jobWindow)
                    this.context.navigation.navigate('Job View')
                  }}
                  >View Job</Button>
              </Center>
            
            </LinearGradient>
          </Box>
        </Box>
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
            <SText textAlign='center' color='white'>Select a job to the left to see more about it here.</SText>
          </Center>
        </Center>
      )
    } else {
      return (
        <Center
          flex='1'
          justifyContent='center'
        >
          <Box
            flex='1'
            justifyContent='center'
            w='90%'
            my={wp(2)}
            p={wp(2)}
          >
            <SText textAlign='center' color='white'>No job to display.</SText>
          </Box>
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
          <Spinner size={wp(20)} color='white' />
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
              <SText
                flex='5'
                p={wp(1)}
                // pl={wp(2)}
                numberOfLines={1}
                color={selectedJob(item) ? 'white' : 'black'}
                onPress={() => this.context.updateContext('jobWindow', item)}
                // borderWidth='1'
              >#{(pagination.current*10)+(index+1)}: {item.title}</SText>
              <SText
                flex='1'
                p={wp(1)}
                textAlign='right'
                numberOfLines={1}
                color={selectedJob(item) ? 'white' : 'black'}
                onPress={() => this.context.updateContext('jobWindow', item)}
                // borderWidth='1'
              >{excerpt(item)}</SText>
            </Stack>
          )}
        />
      )
    } else {
      return (
        <Center
          flex='1'
          px={wp(2)}
          bg='primary.1'
          justifyContent='center'
        >
          <SText
            textAlign='center'
            color='white'
          >Search for jobs to see a list of them here.</SText>
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
            <SText color='white'>{`<`}</SText>
          </Center>
          <Center
            flex='2'
            justifyContent='center'
            onStartShouldSetResponder={() => pages.length > 0 && this.setState({ showPageSelectModal: true })}
          >
            <SText
              // w='100%'
              // h='100%'
              // pt='10%'
              // justifyContent='center'
              // alignItems='center'
              textAlign='center'
              // onPress={() => pages.length > 0 && this.setState({ showPageSelectModal: true })}
            >{current+1} / {pages.length}</SText>
          </Center>
          <Center
            flex='1'
            bg='primary.101'
            borderLeftWidth='1'
            onStartShouldSetResponder={() => rightPress()}
          >
            <SText color='white'>{`>`}</SText>
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
          maxHeight={hp(75)}
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
    
    let { zip, geo, jobWindow } = this.context
    let { sortBy, sortType, maxRadius, hideSearch, hideMap, animBarHeight, animRotate, animMapHeight, animTextOpacity } = this.state
    let barHeightValue = animBarHeight.interpolate({ inputRange: [0, 1], outputRange: [wp(40), 0] })
    let arrowRotateValue = animRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
    let mapHeightValue = animMapHeight.interpolate({ inputRange: [0, 1], outputRange: [wp(42), 0] })
    
    return (
      <>
        <Animated.View
          style={{ maxHeight: barHeightValue }}
        >
          <Stack
            bg='coolGray.300'
            py={wp(2)}
            space={wp(2)}
            alignItems='center'
            // borderWidth='2'
          >
            <Row
              justifyContent='space-evenly'
              w='98%'
              alignItems='center'
              // borderWidth='2'
            >
              <Box
                flex='1'
                alignItems='center'
                // borderWidth='1'
              >
                <SText pb={wp(1)} fontSize={wp(4)}>Zip Code</SText>
                <Input
                  // autoFocus
                  // placeholder='e.g. 30102'
                  w='90%'
                  py={wp(1)}
                  // my={wp(2)}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  bg='white'
                  // borderWidth='1'
                  onEndEditing={() => Keyboard.dismiss()}
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
                <SText pb={wp(1)} fontSize={wp(4)}>Radius</SText>
                <Select
                  selectedValue={maxRadius}
                  accessibilityLabel='Max Radius'
                  p={wp(1)}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  onValueChange={x => this.setState({ maxRadius: x })}
                  w='90%'
                  // variant='underlined'
                  // borderColor='black'
                  _item={{ backgroundColor: 'white' }}
                  bg='white'
                  // borderWidth='1'
                >
                  <Select.Item p={wp(3)} label='1 Mile' value='1'/>
                  <Select.Item p={wp(3)} label='3 Miles' value='3'/>
                  <Select.Item p={wp(3)} label='5 Miles' value='5'/>
                  <Select.Item p={wp(3)} label='10 Miles' value='10'/>
                  <Select.Item p={wp(3)} label='25 Miles' value='25'/>
                  <Select.Item p={wp(3)} label='All Jobs' value='9000'/>
                </Select>
              </Box>

              <Box
                flex='1'
                alignItems='center'
                // borderWidth='1'
              >
                <SText pb={wp(1)} fontSize={wp(4)}>Sort By</SText>
                <Select
                  selectedValue={sortBy}
                  accessibilityLabel='Sort By'
                  p={wp(1)}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  onValueChange={x => {
                    x === 'distance' ? this.setState({ sortBy: x, sortDirection: 'asc' }) :
                    x === 'tip' ? this.setState({ sortBy: x, sortDirection: 'desc' }) :
                    x === 'creationDate' ? this.setState({ sortBy: x, sortDirection: 'desc' }) :
                    x === 'endDate' ? this.setState({ sortBy: x, sortDirection: 'asc' }) : null
                  }}
                  w='90%'
                  // variant='underlined'
                  // borderColor='black'
                  _item={{ backgroundColor: 'white' }}
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
                <SText pb={wp(1)} fontSize={wp(4)}>Order By</SText>
                <Select
                  selectedValue={this.state.sortDirection}
                  accessibilityLabel='Sort Direction'
                  onValueChange={x => this.setState({ sortDirection: x })}
                  w='90%'
                  p={wp(1)}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  // borderColor='black'
                  bg='white'
                  // borderWidth='1'
                  _item={{ backgroundColor: 'white' }}
                >
                  <Select.Item p={wp(3)} label='Ascending' value='asc'/>
                  <Select.Item p={wp(3)} label='Decending' value='desc'/>
                </Select>
              </Box>
  
              <Box
                flex='1'
                alignItems='center'
                // borderWidth='1'
              >
                <SText pb={wp(1)} fontSize={wp(4)}>Type</SText>
                <Select
                  selectedValue={sortType}
                  accessibilityLabel='Sort Type'
                  onValueChange={x => this.setState({ sortType: x })}
                  w='90%'
                  p={wp(1)}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  _item={{ backgroundColor: 'white' }}
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

          </Stack>

          <Box
            bg='coolGray.300'
            alignItems='center'
          >
            <Box
              w='30%'
              bg='darkgreen'
              borderRadius='35'
            >
              <WText
                pt={wp(1)}
                textAlign='center'
                onPress={() => this.search()}
                // mx={wp(10)}
              >Search</WText>
            </Box>
          </Box>

        </Animated.View>

        <Row
          bg='coolGray.300'
          justifyContent='space-evenly'
          py={wp(1)}
        >
          <Center
            // flex='1'
            h={wp(6)}
            w={wp(10)}
            bg={hideSearch ? 'primary.101' : 'darkgreen'}
            alignItems='center'
            borderRadius='25'
            onStartShouldSetResponder={() => {
              if (hideSearch) {
                animSlideDownAndShow(animBarHeight, animRotate)
                if (!hideMap) { fadeOutText(animTextOpacity) }
              } else {
                animHideAndSlideUp(animBarHeight, animRotate)
                if (!hideMap) { fadeInText(animTextOpacity) }
              }
              this.setState({ hideSearch: !hideSearch })
            }}
          >
            <Animated.View style={{ transform: [{ rotate: arrowRotateValue }] }}>
              <FontAwesomeIcon
                icon={faAngleDoubleUp}
                color='white'
              />
            </Animated.View>
          </Center>
          { Platform.OS === 'ios' ? null : <Center w={wp(25)}>
            <Box
              pt={wp(.5)}
              px={wp(2)}
              bg={hideMap ? 'primary.101' : 'darkgreen'}
              borderRadius='35'
            >
              <WText
                fontSize={wp(4)}
                onPress={() => {
                  if (hideMap) {
                    heightTo0(animMapHeight)
                    // if (!hideSearch) { fadeOutText(animTextOpacity) }
                  } else {
                    heightTo1(animMapHeight)
                    // if (!hideSearch) { fadeInText(animTextOpacity) }
                  }
                  this.setState({ hideMap: !hideMap })
                }}
              >{hideMap ? 'Show Map' : 'Hide Map'}</WText>
            </Box>
          </Center> }
        </Row>
        
        <Stack
          flex='1'
          borderTopWidth='1'
        >
          <Row
            flex='5'
          >
            <Stack flex='2' borderRightWidth='1'>
              <Box
                flex='8'
                bg='primary.1'
              >
                {this.renderResultsSidebar()}
              </Box>
              <Center
                // flex='1'
                h={wp(10)}
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
          <Animated.View
            style={{ maxHeight: mapHeightValue }}
          >
            <MapView
              style={{ height: '100%', width: '100%' }}
              // scrollEnabled
              region={{
                latitude: jobWindow.latitude === 0 ? geo.latitude : jobWindow.latitude,
                longitude: jobWindow.longitude === 0 ? geo.longitude : jobWindow.longitude,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
              }}
            >
              { this.renderMarkers() }
            </MapView>
          </Animated.View>
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