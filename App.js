import React, { Component } from "react"
// import 'react-native-gesture-handler'
import { LogBox } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer, useNavigation, useIsFocused, useFocusEffect, useScrollToTop } from '@react-navigation/native'
import { NativeBaseProvider, Text } from "native-base"
import firebase from './config/firebase'
import theme from './config/theme'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import GlobalState from './context/GlobalState'
import Preface from './preface/Preface'
import Home from './components/Home'
import Settings from './components/Settings'
import SearchJobs from './components/SearchJobs'
import CreateJob from './components/CreateJob'
import JobView from './components/JobView'
import About from './components/About'
import Profile from './user/Profile'
import ManageJobs from './user/ManageJobs'
import UserJobView from './user/UserJobView'
import Location from './user/Location'

// import TestJobView from './test/TestJobView'
// import TestProfile from './test/TestProfile'
// import TestSearchJobs from './test/TestSearchJobs'
// import TestCreateJob from './test/TestCreateJob'

let Stack = createNativeStackNavigator()
let Drawer = createDrawerNavigator()
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
      loggedIn: false
    }
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
          name='Settings'
          component={Settings}
        />
        <Drawer.Screen
          name='About'
          component={About}
        />
        <Drawer.Screen
          name='User Job View'
          component={UserJobView}
          options={{
            drawerItemStyle: { height: 0, width: 0 },
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
      </>
    )
  }
  
  loggedOutMenuItems = () => {
    return (
      <>
        <Drawer.Screen
          name='Settings'
          component={Settings}
        />
        <Drawer.Screen
          name='About'
          component={About}
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

  testMenuItems = () => {
    return (
      <>
        {/* <Drawer.Screen
          name='TestJobView'
          component={TestJobView}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='TestProfile'
          component={TestProfile}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='TestSearchJobs'
          component={TestSearchJobs}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='TestCreateJob'
          component={TestCreateJob}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        /> */}
      </>
    )
  }

  render() {
    return (
      <NavigationContainer>
        <ContextWithHooks
          setLoggedInStatus={x => this.setState({ loggedIn: x })}
        >
          <NativeBaseProvider theme={theme}>
            <Drawer.Navigator
              initialRouteName='Home'
              screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: '#16a800',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                swipeEnabled: false,
                // unmountOnBlur: true
                // drawerPosition: 'right'
              }
            }>
              <Drawer.Screen
                name='Home'
                component={Home}
              />
              {this.state.loggedIn ? this.userMenuItems() : this.loggedOutMenuItems()}
              <Drawer.Screen
                name='Search Jobs'
                component={SearchJobs}
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
              {this.testMenuItems()}
            </Drawer.Navigator>
          </NativeBaseProvider>
        </ContextWithHooks>
      </NavigationContainer>
    )
  }
}