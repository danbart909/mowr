import React, { Component } from "react"
// import 'react-native-gesture-handler'
import { LogBox, Keyboard } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer, useNavigation, useIsFocused, useFocusEffect, useScrollToTop } from '@react-navigation/native'
import { NativeBaseProvider, Text } from "native-base"
import { fromBottom } from 'react-navigation-transitions'
// import { Font } from 'expo'
import firebase from './config/firebase'
import theme from './config/theme'
import * as SplashScreen from 'expo-splash-screen'
import { getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import GlobalState from './context/GlobalState'
import Preface from './preface/Preface'
import Home from './components/Home'
// import Settings from './components/Settings'
import SearchJobs from './components/SearchJobs'
import CreateJob from './components/CreateJob'
import JobView from './components/JobView'
import About from './components/About'
import ReportBug from './components/ReportBug'
import Profile from './user/Profile'
import ManageJobs from './user/ManageJobs'
import UserJobView from './user/UserJobView'
import Location from './user/Location'
import Test from './components/Test'
import Info from './components/Info'

let Stack = createNativeStackNavigator()
let Drawer = createDrawerNavigator()
let app = getApp()
let auth = getAuth()
let db = getDatabase()
let fire = getFirestore()

LogBox.ignoreLogs([
  'Setting a timer',
  'If you want to use Reanimated',
  'AsyncStorage has been extracted',
  'NativeBase: The contrast ratio of'
])

const BackButton = (props) => {
  let navigation = useNavigation()
  return (
    <Text
      onPress={() => navigation.navigate(props.screen)}
      color='white'
      fontSize='24'
      paddingLeft='20'
    >{`<-`}</Text>
  )
}

const ContextWithHooks = (props) => {
  let navigation = useNavigation()
  let isFocused = useIsFocused()
  return (
    <GlobalState
      {...props}
      app={app}
      auth={auth}
      db={db}
      fire={fire}
      navigation={navigation}
      isFocused={isFocused}
    />
  )
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      fontsLoaded: false,
    }
  }

  // componentDidMount() {
    // SplashScreen.preventAutoHideAsync();
    // setTimeout(SplashScreen.hideAsync, 10000);
  // }

  loadFonts = async () => {
    await Font.loadAsync({
      'Karla': require('./assets/fonts/Karla.ttf'),
      'Mukta': require('./assets/fonts/Mukta.ttf'),
      'CabinSketch': require('./assets/fonts/CabinSketch.ttf'),
      // 'TimesNewRoman': require('./assets/fonts/TimesNewRoman.ttf'),
      // 'TimesNewRomanItalic': require('./assets/fonts/TimesNewRomanItalic.ttf'),
      // 'SourceSansPro': require('./assets/fonts/SourceSansPro.ttf'),
      // 'NotoSans': require('./assets/fonts/NotoSans.ttf'),
      // 'Lato': require('./assets/fonts/Lato.ttf'),
    })
    .catch(e => console.log('error loading fonts\n', e, e.message))
  }

  userMenuItems = () => {
    return (
      <>
        <Drawer.Screen
          name='Profile'
          component={Profile}
        />
        <Drawer.Screen
          name='Create Job'
          component={CreateJob}
        />
        <Drawer.Screen
          name='Manage Jobs'
          component={ManageJobs}
        />
        <Drawer.Screen
          name='Info'
          component={Info}
        />
        <Drawer.Screen
          name='About'
          component={About}
        />
        <Drawer.Screen
          name='Report a Bug'
          component={ReportBug}
        />
        <Drawer.Screen
          name='User Job View'
          component={UserJobView}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Manage Jobs'} />
          }}
        />
        <Drawer.Screen
          name='Location'
          component={Location}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Profile'} />
          }}
        />
        <Drawer.Screen
          name='Preface'
          component={Preface}
          options={{
            headerTitle: 'Login/Signup',
            // headerShown: false,
            drawerItemStyle: { height: 0 },
            // headerLeft: () => <></>
          }}
        />
      </>
    )
  }
  
  loggedOutMenuItems = () => {
    return (
      <>
        <Drawer.Screen
          name='Info'
          component={Info}
        />
        <Drawer.Screen
          name='About'
          component={About}
        />
        <Drawer.Screen
          name='Report a Bug'
          component={ReportBug}
        />
        <Drawer.Screen
          name='Preface'
          component={Preface}
          options={{
            title: 'Looking To Post a Job?',
            headerTitle: 'Login/Signup',
            // headerShown: false,
            // drawerItemStyle: { height: 0, width: 0 }
          }}
        />
      </>
    )
  }

  render() {

    if (!this.state.fontsLoaded) {
      return (
        <AppLoading
          startAsync={() => this.loadFonts()}
          onFinish={() => this.setState({ fontsLoaded: true })}
          onError={e => console.log('AppLoading error', e, e.message)}
        />
      )
    }
    
    return (
      <NavigationContainer>
        <ContextWithHooks
          setLoggedInStatus={x => this.setState({ loggedIn: x })}
          appState={this.state}
        >
          <NativeBaseProvider theme={theme}>
            <Drawer.Navigator
              // initialRouteName='Home'
              screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: '#289d15',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                swipeEnabled: false,
                transitionConfig: () => fromBottom(),
                // unmountOnBlur: true,
                // drawerPosition: 'right',
                drawerActiveBackgroundColor: 'darkgreen',
                drawerActiveTintColor: 'white',
                // keyboardDismissMode: 'none'
              }
            }>
              <Drawer.Screen
                name='Home'
                component={Home}
              />
              <Drawer.Screen
                name='Search Jobs'
                component={SearchJobs}
                // options={{
                  // drawerItemStyle: { height: 0, width: 0 },
                  // headerLeft: () => <BackButton screen={'SearchJobs'} />
                // }}
              />
              {this.state.loggedIn ? this.userMenuItems() : this.loggedOutMenuItems()}
              <Drawer.Screen
                name='Test'
                component={Test}
                options={{
                  drawerItemStyle: { height: 0, width: 0 },
                  // headerLeft: () => <BackButton screen={'SearchJobs'} />
                }}
              />
              <Drawer.Screen
                name='Job View'
                component={JobView}
                options={{
                  drawerItemStyle: { height: 0, width: 0 },
                  headerLeft: () => <BackButton screen={'Search Jobs'} />
                }}
              />
            </Drawer.Navigator>
          </NativeBaseProvider>
        </ContextWithHooks>
      </NavigationContainer>
    )
  }
}