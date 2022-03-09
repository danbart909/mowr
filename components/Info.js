import React, { Component } from 'react'
import { Box, Button, Center, FormControl, Heading, Input, Modal, TextArea, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Context from '../context/Context.js'
import { LinearGradient } from 'expo-linear-gradient'
import { faItalic } from '@fortawesome/free-solid-svg-icons'

export default class Info extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static contextType = Context

  render() {

    return (
      <ScrollView bg='primary.1'>
        <Stack
          p={wp(4)}
          space={wp(4)}
        >
          <WText>Please report any errors, bugs, freezes, crashes, or any other malfunctions with the <Text bg='white' color='primary.1' onPress={() => this.context.navigation.navigate('Report a Bug')}>Report a Bug</Text> page. This would help me out a great deal, as I have limited materials to use when it comes to testing how the final result will look on both types of devices. You can use the form to also express any opinions you have or suggest improvements, not just strictly for reporting bugs.</WText>

          <WText
            italic
            fontSize={wp(8)}
            mt={wp(10)}
            lineHeight={wp(10)}
          >I can't get rid of my keyboard! What's the deal?</WText>

          <WText>Work on this issue is ongoing. If your keyboard won't close when you tap outside of it, hopefully pressing the Enter/Return button will help.</WText>

          <WText
            italic
            fontSize={wp(8)}
            mt={wp(10)}
            lineHeight={wp(10)}
          >So what's the whole procedure from start to finish?</WText>

          <WText><WText bold underline>Looking for a Job</WText> - no account creation is required. Go to the <Text bg='white' color='primary.1' onPress={() => this.context.navigation.navigate('Search Jobs')}>Search Jobs</Text> page in the menu, search with your zipcode, and you'll have a list of jobs appear to the left. When you find one that looks good to you, contact the job poster with the contact info provided with the job.</WText>

          <WText><WText bold underline>Posting a Job</WText> - You will need to create an account to post a job. The <Text bg='white' color='primary.1' onPress={() => this.context.navigation.navigate('Preface')}>Signup</Text> page will first require a Name, Email, and Password (you'll use your email to login). Then you'll be asked for your Phone Number and Address. They'll be included with your job information whenever you make one, and you can change them in your profile later.</WText>

          {/* <WText><WText underline>1. Name, Email, Password{`\n`}</WText>Your name will be one of the first things workers see, and it's probably how they will address you when they inquire about the job. Email is what you use to login to the app, and it will also be on the job description that workers see. If you prefer either email or phone, be sure to note that in your job description.</WText> */}

          {/* <WText><WText underline>1. Name, Email, Password{`\n`}</WText>Your email is for logging in, and will be included with your job information whenever you make one.</WText> */}

          {/* <WText><WText underline>2. Phone Number & 3. Address{`\n`}</WText>These also show on the jobs you create. You can change them in your profile.</WText> */}

          {/* <WText>After you've made your profile, go the "Create a Job" page. Enter the title, type (this field is to be expanded upon later), tip (go under not over... giving less than the amount you listed is to be avoided), description (if you have to specify parameters outside the ones provided, do it here. Examples include as "Tip TBD (to be determined)", "Estimated completion time", "", etc.), and deadline (set to 12:00pm noon for no time at all - will be changed at a later date).</WText> */}

          <WText>Go to "Create a Job" in the menu and enter the information, afterwards you will be able to see it listed in the Search Jobs page.</WText>

          <WText>You can have more than one job posted at a time.</WText>

          <WText>When a job is over (either somebody worked it or it expired), it's listing will not yet automatically delete. Please go to the job you've listed on the 'Manage Jobs' page and delete it manually after viewing the job, otherwise you may continue to receive inquiries.</WText>

          <WText
            italic
            fontSize={wp(8)}
            mt={wp(10)}
            lineHeight={wp(10)}
          >What are 'Tips'? Does that mean payment is optional?</WText>

          <WText>It is appropriate to pay the person who worked for you.</WText>

          <WText>Naming the payment 'Tips' is meant to imply the job poster would be paying the worker through graditude, rather than through obligation. This would also imply the worker shouldn't demand payment, but should instead focus on serving the person in need not out of self-gain, but out of a desire to help others. Payment is, of course, appropriate for when work is done for another, so the "tip" is meant to give job owners more freedom in setting a price they think the job is worth. When setting the price, try to go under, not over. Giving less than the amount you listed is to be avoided.</WText>

          <WText
            italic
            fontSize={wp(8)}
            mt={wp(10)}
            lineHeight={wp(10)}
          >How do I pay the worker once the job is done?</WText>

          <WText>When a worker contacts you about a job you've posted, you are free to arrange any payment method both parties can agree on. This app does not deal with any financial transactions in any way.</WText>

          {/* <WText>This app is open to be used by minors and therefore is subject to many restrictions by both Google and Apple. Technical hurdles to let minors accept payments from people on this app would delay it for many months. This isn't to say it isn't a possibility somewhere down the line.</WText> */}

        </Stack>

        {/* <Stack
          mt={wp(4)}
          p={wp(4)}
          bg='primary.1'
          borderRadius='40'
        >
          <WText textAlign='center' mt={wp(3)} bold>wrkr v1.3</WText>
          <WText textAlign='center' mt={wp(3)} underline mb={wp(4)}>Release Notes:</WText>
          <WText>- Fixed the keyboard for iOS so users can set their phone number on signup. Third time's a charm!</WText>
          <WText>- Fixed the date/time picker for iOS so users can create a job.</WText>
          <WText>- Fixed some spelling errors on the Report a Bug page. If you find any more spelling errors, please let me know!</WText>
          <WText>- Removed all but one of the placeholder jobs. I think if I remove them all, all power in a 5 mile radius will get knocked out so I'm just going to keep one in there for now.</WText>
          <WText>- I'm not sure if this is just a glitch on my emulator, but it appears the scrollbar on iOS is showing up near the left side of the homepage. Can someone let me know if it shows up like this on an actual iPhone?</WText>
          <WText>- Thanks for downloading! If you have any ideas or suggestions for me feel free to let me know!</WText>
        </Stack> */}
      </ScrollView>
    )
  }
}

let WText = (props) => {
  return <Text color='white' {...props}>{props.children}</Text>
}