import { createTheme, MantineColorsTuple } from '@mantine/core'

export const blue: MantineColorsTuple = [
  '#eef2ff',
  '#dbe4ff',
  '#b8c7ff',
  '#8ea7ff',
  '#6b8cff',
  '#4c6ef5', // primary
  '#3b5bdb',
  '#364fc7',
  '#2f44b3',
  '#283a9e',
]

export const gray: MantineColorsTuple = [
  '#f8f9fa',
  '#f1f3f5',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#868e96',
  '#495057',
  '#343a40',
  '#212529',
]

export const green: MantineColorsTuple = [
  '#ebfbee',
  '#d3f9d8',
  '#b2f2bb',
  '#8ce99a',
  '#69db7c',
  '#51cf66',
  '#40c057',
  '#37b24d',
  '#2f9e44',
  '#2b8a3e',
]

export const red: MantineColorsTuple = [
  '#fff5f5',
  '#ffe3e3',
  '#ffc9c9',
  '#ffa8a8',
  '#ff8787',
  '#ff6b6b',
  '#fa5252',
  '#f03e3e',
  '#e03131',
  '#c92a2a',
]

export const yellow: MantineColorsTuple = [
  '#fff9db',
  '#fff3bf',
  '#ffec99',
  '#ffe066',
  '#ffd43b',
  '#fcc419',
  '#fab005',
  '#f59f00',
  '#f08c00',
  '#e67700',
]

export const theme = createTheme({
  primaryColor: 'green',
  colors: {
    blue,
    gray,
    green,
    red,
    yellow,
  },
  primaryShade: 9,

  fontFamily: 'Inter, sans-serif',

  components: {
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        withBorder: true,
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
})
