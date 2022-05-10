import React, { Component } from 'react'
import { Box, Button, Checkbox, Center, Heading, Factory, FlatList, Input, Modal, ScrollView, Spinner, Text, Select, Stack, Row, Switch, Image, KeyboardAvoidingView } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Keyboard, Animated, Platform } from 'react-native'
import { WText, turtleUp, turtleReset } from '../config/helper.js'

export default class TurtleRace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCash: 50,
      raceStarted: false,
      showResults: false,
      chosenTurtle: '',
      bet: '',
      winner: false,
      nameOrder: [
        {
          name: '',
          finalScore: ''
        },
        {
          name: '',
          finalScore: ''
        },
        {
          name: '',
          finalScore: ''
        },
        {
          name: '',
          finalScore: ''
        }
      ],
      raceResults: [
        {
          name: '',
          finalScore: ''
        },
        {
          name: '',
          finalScore: ''
        },
        {
          name: '',
          finalScore: ''
        },
        {
          name: '',
          finalScore: ''
        }
      ],
      // timeValue1: 0,
      // timeValue2: 0,
      // timeValue3: 0,
      // timeValue4: 0,
      inkyY: new Animated.Value(0),
      blinkyY: new Animated.Value(0),
      pinkyY: new Animated.Value(0),
      clydeY: new Animated.Value(0),
      animationFinished: false
    }
  }

  getNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  
  getLuckNum = () => {
    const min = 3
    const max = 6
    return (Math.random() * (max - min)) + min;
  }
  
  getManeuvering = () => {
    const min = 0.1
    const max = 1
    return (Math.random() * (max - min)) + min;
  }

  runTest = () => {
    let k = 0, t = 0, i = 0, b = 0, p = 0, c = 0
    console.log('start')
    while (k < 1000) {
      k++
      let result = this.raceTest()
      if (result === 'I') { t++; i++ }
      else if (result === 'B') { t++; b++ }
      else if (result === 'P') { t++, p++ }
      else if (result === 'C') { t++, c++ }
    }
    console.log('end', {total: t, inky: i, blinky: b, pinky: p, clyde: c})
  }

  raceTest = () => {
    const track = {
      length1: 90,
      length2: 100,
      length3: 110,
      // maneuvering: this.getManeuvering()
    }
    const turtle = [
      {
        name: 'Inky',
        maxSpeed: this.getNum(8, 10),
        acceleration: this.getNum(8, 10),
        luck: this.getLuckNum(),
        color: 'blue.500'
      },
      {
        name: 'Blinky',
        maxSpeed: this.getNum(7, 11),
        acceleration: this.getNum(7, 11),
        luck: this.getLuckNum(),
        color: 'yellow.500'
      },
      {
        name: 'Pinky',
        maxSpeed: this.getNum(6, 12),
        acceleration: this.getNum(6, 12),
        luck: this.getLuckNum(),
        color: 'red.500'
      },
      {
        name: 'Clyde',
        maxSpeed: this.getNum(5, 13),
        acceleration: this.getNum(5, 13),
        luck: this.getLuckNum(),
        color: 'green.500'
      }
    ]
    let racers = []
    let nameOrder = []
    let finishOrder = []
    let theTrack = {...track}

    turtle.forEach(x => {
      racers.push({...x, rawScore: x.maxSpeed + x.acceleration + x.luck})
    })
    racers.forEach(x => {
      nameOrder.push({...x, finalScore: (theTrack.length2 / x.rawScore).toFixed(3)})
    })
    racers.sort(function(a, b){return b.rawScore - a.rawScore})
    racers.forEach(x => {
      finishOrder.push({...x, finalScore: (theTrack.length2 / x.rawScore).toFixed(3)})
    })

    racers = [];
    let winner = ''
    finishOrder.sort(function(a, b){return b.rawScore - a.rawScore})
    
    if (finishOrder[0].name === 'Inky') winner = 'I'
    else if (finishOrder[0].name === 'Blinky') winner = 'B'
    else if (finishOrder[0].name === 'Pinky') winner = 'P'
    else if (finishOrder[0].name === 'Clyde') winner = 'C'

    return winner
  }

  race = () => {
    const track = {
      length1: 90,
      length2: 100,
      length3: 110,
      // maneuvering: this.getManeuvering()
    }
    const turtle = [
      {
        name: 'Inky',
        maxSpeed: this.getNum(8, 10),
        acceleration: this.getNum(8, 10),
        luck: this.getLuckNum(),
        color: 'blue.500'
      },
      {
        name: 'Blinky',
        maxSpeed: this.getNum(7, 11),
        acceleration: this.getNum(7, 11),
        luck: this.getLuckNum(),
        color: 'yellow.500'
      },
      {
        name: 'Pinky',
        maxSpeed: this.getNum(6, 12),
        acceleration: this.getNum(6, 12),
        luck: this.getLuckNum(),
        color: 'red.500'
      },
      {
        name: 'Clyde',
        maxSpeed: this.getNum(5, 13),
        acceleration: this.getNum(5, 13),
        luck: this.getLuckNum(),
        color: 'green.500'
      }
    ]
    let racers = []
    let nameOrder = []
    let finishOrder = []
    let theTrack = {...track}

    turtle.forEach(x => {
      racers.push({...x, rawScore: x.maxSpeed + x.acceleration + x.luck})
    })
    racers.forEach(x => {
      nameOrder.push({...x, finalScore: (theTrack.length2 / x.rawScore).toFixed(3)})
    })
    racers.sort(function(a, b){return b.rawScore - a.rawScore})
    racers.forEach(x => {
      finishOrder.push({...x, finalScore: (theTrack.length2 / x.rawScore).toFixed(3)})
    })

    racers = [];
    finishOrder.sort(function(a, b){return b.rawScore - a.rawScore})
    this.setState({ raceResults: finishOrder, nameOrder })

    return nameOrder;
  }

  startRace = () => {
    let results = this.race()
    let { chosenTurtle, raceStarted, totalCash, bet, inkyY, blinkyY, pinkyY, clydeY } = this.state

    // console.log('race started')
    if (parseInt(bet) > totalCash) { alert('You can only bet as much as you have!') }
    else {
      let ms1 = (parseFloat(results[0].finalScore) * 1000) / 2
      let ms2 = (parseFloat(results[1].finalScore) * 1000) / 2
      let ms3 = (parseFloat(results[2].finalScore) * 1000) / 2
      let ms4 = (parseFloat(results[3].finalScore) * 1000) / 2

      this.setState({ raceStarted: true, totalCash: totalCash - bet })

      // setTimeout(() => { this.setState({ showResults: true }) }, ms1)
      // setTimeout(() => { this.setState({ timeValue1: t1 }) }, ms1)
      // setTimeout(() => { this.setState({ timeValue2: t2 }) }, ms2)
      // setTimeout(() => { this.setState({ timeValue3: t3 }) }, ms3)
      // setTimeout(() => { this.setState({ timeValue4: t4 }) }, ms4)
      turtleUp(inkyY, ms1)
      turtleUp(blinkyY, ms2)
      turtleUp(pinkyY, ms3)
      turtleUp(clydeY, ms4)
      setTimeout(() => { this.moneyCalc() }, ms1)
      setTimeout(() => { this.setState({ showResults: true }) }, 2500)
    }
  }

  moneyCalc = () => {
    let final = 0
    let { totalCash, raceResults, chosenTurtle, bet, totalGames } = this.state

    if ((raceResults[0].name === chosenTurtle) && (raceResults[0].name === 'Inky')) {
      final = (totalCash + (bet * 2))
      this.setState({ winner: true, totalCash: final })
    } else if ((raceResults[0].name === chosenTurtle) && (raceResults[0].name === 'Blinky')) {
      final = (totalCash + (bet * 3))
      this.setState({ winner: true, totalCash: final })
    } else if ((raceResults[0].name === chosenTurtle) && (raceResults[0].name === 'Pinky')) {
      final = (totalCash + (bet * 4))
      this.setState({ winner: true, totalCash: final })
    } else if ((raceResults[0].name === chosenTurtle) && (raceResults[0].name === 'Clyde')) {
      final = (totalCash + (bet * 5))
      this.setState({ winner: true, totalCash: final })
    } else {
      this.setState({ winner: false })
    }
  }

  restartRace = () => {
    let { inkyY, blinkyY, pinkyY, clydeY, totalCash } = this.state

    this.setState({
      raceStarted: false,
      showResults: false,
      // timeValue1: 0,
      // timeValue2: 0,
      // timeValue3: 0,
      // timeValue4: 0,
    })

    turtleReset(inkyY)
    turtleReset(blinkyY)
    turtleReset(pinkyY)
    turtleReset(clydeY)

    if (totalCash <= 0 || totalCash === NaN) this.resetGame()
  }

  payout = () => {
    let { chosenTurtle, bet } = this.state
    let total = 0

    if (chosenTurtle === 'Inky') total = bet * 6
    else if (chosenTurtle === 'Blinky') total = bet * 5
    else if (chosenTurtle === 'Pinky') total = bet * 4
    else if (chosenTurtle === 'Clyde') total = bet * 3
    else null

    return total.toFixed(2)
  }

  results = () => {
    let { raceResults, showResults } = this.state

    if (showResults) {
      let html = []
      let idx = 0
      raceResults.map(x => {
        idx++
        html.push(
          <Row
            key={idx}
            justifyContent='space-between'
            bg={x.color}
            px={wp(1)}
          >
            <WText>{idx}</WText>
            <WText>{x.name}</WText>
            <WText>{parseFloat((x.finalScore/1.5).toFixed(3))}</WText>
          </Row>
        )
      })
      return html
    } else return null
  }

  resetGame = () => {
    this.setState({
      totalCash: 50,
      raceStarted: false,
      showResults: false,
      chosenTurtle: '',
      bet: '',
      winner: false,
      inkyY: new Animated.Value(0),
      blinkyY: new Animated.Value(0),
      pinkyY: new Animated.Value(0),
      clydeY: new Animated.Value(0),
      animationFinished: false
    })
  }

  render() {
    let { chosenTurtle, bet, totalCash, raceStarted, raceResults, inkyY, blinkyY, pinkyY, clydeY } = this.state
    let animEnd = Platform.OS === 'ios' ? hp(-74) : hp(-81)
    let turtles = [
      { name: 'Inky', odds: '17%', color: 'blue.500' },
      { name: 'Blinky', odds: '22%', color: 'yellow.500' },
      { name: 'Pinky', odds: '28%', color: 'red.500'},
      { name: 'Clyde', odds: '33%', color: 'green.500' }]
    let inkyPosition = inkyY.interpolate({ inputRange: [0, 1], outputRange: [0, animEnd] })
    let blinkyPosition = blinkyY.interpolate({ inputRange: [0, 1], outputRange: [0, animEnd] })
    let pinkyPosition = pinkyY.interpolate({ inputRange: [0, 1], outputRange: [0, animEnd] })
    let clydePosition = clydeY.interpolate({ inputRange: [0, 1], outputRange: [0, animEnd] })
    let startButton = () => {
      if (totalCash <= 0) { return 'Restart with $50' }
      if (raceStarted) { return 'Reset' } else { return 'Start' }
    }

    return (
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        flex='1'
        onStartShouldSetResponder={() => Keyboard.dismiss()}
      >
        <Box flex='1'>
          <Box
            flex='1'
            bg='blue.100'
          >
            {/* <Center>
              <Text>Turtle Racing</Text>
            </Center> */}
            <Row flex='1'>
              <Center
                flex='1'
                justifyContent='center'
                bg={chosenTurtle ? turtles.filter(x => x.name === chosenTurtle)[0].color : 'transparent'}
              >
                <Text
                  color={chosenTurtle ? 'white' : 'black'}
                >{chosenTurtle ? `Your Turtle is: ${chosenTurtle}` : 'No Turtle Selected'}</Text>
              </Center>
              <Center flex='1'>
                <Text>${totalCash.toFixed(2)}</Text>
              </Center>
            </Row>
          </Box>
  
          <Row flex='11'>
            <Row
              flex='3'
              bg='amber.100'
            >
              <Box
                flex='1'
                justifyContent='flex-end'
                alignItems='center'
                // bg={inkyActiveColor}
              >
                <Animated.View
                  // style={{ borderWidth: 1 }}
                  style={{ borderWidth: 1, transform: [{ translateY: inkyPosition }] }}
                >
                  <Image
                    source={require('../assets/blueturtle.png')}
                    alt='Alternate Text'
                  />
                </Animated.View>
              </Box>
              <Box
                flex='1'
                justifyContent='flex-end'
                alignItems='center'
                // bg={blinkyActiveColor}
              >
                <Animated.View
                  // style={{ borderWidth: 1 }}
                  style={{ borderWidth: 1, transform: [{ translateY: blinkyPosition }] }}
                >
                  <Image
                    source={require('../assets/yellowturtle.png')}
                    alt='Alternate Text'
                  />
                </Animated.View>
              </Box>
              <Box
                flex='1'
                justifyContent='flex-end'
                alignItems='center'
                // bg={pinkyActiveColor}
              >
                <Animated.View
                  // style={{ borderWidth: 1 }}
                  style={{ borderWidth: 1, transform: [{ translateY: pinkyPosition }] }}
                >
                  <Image
                    source={require('../assets/redturtle.png')}
                    alt='Alternate Text'
                  />
                </Animated.View>
              </Box>
              <Box
                flex='1'
                justifyContent='flex-end'
                alignItems='center'
                // bg={clydeActiveColor}
              >
                <Animated.View
                  // style={{ borderWidth: 1 }}
                  style={{ borderWidth: 1, transform: [{ translateY: clydePosition }] }}
                >
                  <Image
                    source={require('../assets/greenturtle.png')}
                    alt='Alternate Text'
                  />
                </Animated.View>
              </Box>
            </Row>
  
            <Box
              flex='2'
              bg='red.100'
            >

              <Box p={wp(1)}>
                <Text
                  textAlign='center'
                  fontSize={Platform.OS === 'iOS' ? wp(5) : wp(4)}
                >Press a name below to choose your turtle</Text>
              </Box>

              <Row
                justifyContent='space-between'
                my={hp(1)}
                px={wp(1)}
              >
                <Text underline>Name</Text>
                <Text underline>Odds</Text>
              </Row>

              {turtles.map(x => {
                let bgColor = chosenTurtle === x.name ? x.color : 'transparent'
                let txColor = chosenTurtle === x.name ? 'white' : 'black'
                return <Row
                  key={x.name+1}
                  justifyContent='space-between'
                  bg={bgColor}
                  onStartShouldSetResponder={() => this.setState({ chosenTurtle: x.name })}
                  px={wp(1)}
                  borderWidth='1'
                >
                  <Text
                    color={txColor}
                    // onPress={() => this.setState({ chosenTurtle: x.name })}
                  >{x.name}</Text>
                  <Text
                    color={txColor}
                  >{x.odds}</Text>
                </Row>
              })}

              <Row
                justifyContent='space-between'
                my={hp(2)}
                px={wp(1)}
              >
                <Text>Place Bet</Text>
                <Input
                  w={wp(15)}
                  py={wp(1)}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  bg='white'
                  keyboardType={Platform.OS === 'ios' ? 'phone-pad' : 'numeric'}
                  onChangeText={x => this.setState({ bet: x })}
                  maxLength={2}
                  value={bet}
                  onEndEditing={() => Keyboard.dismiss()}
                />
              </Row>

              <Row
                justifyContent='space-between'
                my={hp(.5)}
                px={wp(1)}
              >
                {/* <Text onPress={() => this.runTest()}>Payout</Text> */}
                <Text>Payout</Text>
                <Text>+ ${this.payout()}</Text>
              </Row>

              <Text
                color='white'
                bg='primary.1'
                textAlign='center'
                px={wp(1)}
                onPress={() => {
                  Keyboard.dismiss()
                  if (totalCash < 0) { this.resetGame() }
                  if (raceStarted) { this.restartRace() }
                  else {
                    if (chosenTurtle === '') alert('Please pick a turtle!')
                    else if (bet === '') alert('You must bet something!')
                    else this.startRace()
                  }
                }}
                borderRadius='25'
              >{startButton()}</Text>
              <Row>
              </Row>
              <Box
                // flex='2'
                mt={hp(1)}
                // px={wp(1)}
                bg='blue.100'
              >
                <Text textAlign='center'>Results</Text>
                {this.results()}
              </Box>
            </Box>
          </Row>
  
        </Box>
      </KeyboardAvoidingView>
    )
  }
}