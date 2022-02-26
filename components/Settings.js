import React from 'react'
import { Box, Text, Link, Stack, Switch, Center, Heading, Code, useColorMode } from "native-base"
import Gradient from '../config/gradient'

function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Stack space={2} direction='row' alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light" ? true : false}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </Stack>
  )
}

export default function Settings() {
  return (
    <Center
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
      px={4}
      flex={1}
    >
      {/* <VStack space={5} alignItems="center">
        <Heading size="lg">Welcome to NativeBase</Heading>
        <HStack space={2} alignItems="center">
          <Text>Edit</Text>
          <Code>App.js</Code>
          <Text>and save to reload.</Text>
        </HStack>
        <Link href="https://docs.nativebase.io" isExternal>
          <Text color="primary.500" underline fontSize={"xl"}>Learn NativeBase</Text>
        </Link> */}
        <ToggleDarkMode />
      {/* </VStack> */}
    </Center>
  )
}