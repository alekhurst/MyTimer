import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const vw = x => screenWidth * (x / 100);
export const vh = x => screenHeight * (x / 100);
