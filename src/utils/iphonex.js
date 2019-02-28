import { Dimensions, Platform } from 'react-native';

const iphoneX =
  Platform.OS === 'ios' && Dimensions.get('window').height === 812;

export { iphoneX };
