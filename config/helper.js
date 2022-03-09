import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export function cp(x) {
  return (wp(x)+hp(x))/2
}