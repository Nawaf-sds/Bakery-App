// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import { styles } from '@/app/signup';
// import { Colors } from "@/constants/Colors";


// type Props ={};



// const InputField = (props: React.ComponentProps<typeof TextInput>) => {
//     return (
//      <TextInput 
//     style={styles.inputField}
//    {...props}
//       />
//     );
// };


// export default InputField

// const style = StyleSheet.create({
//      inputField:{
//     backgroundColor: Colors.white,
//     paddingVertical:15,
//     paddingHorizontal:19,
//     alignSelf:'stretch',
//     borderRadius:5,
//     fontSize:16,
//     color:Colors.black,
//     marginBottom:50,
//   },
// })




// components/InputField.tsx

import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps
} from 'react-native';
import { Colors } from '@/constants/Colors';

export interface InputFieldProps extends TextInputProps {
  // you can add any custom props here if you need
}

const InputField: React.FC<InputFieldProps> = ({
  style,
  ...restProps
}) => {
  return (
    <TextInput
      style={[styles.inputField, style]}
      placeholderTextColor={Colors.gray}
      {...restProps}
    />
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputField: {
    backgroundColor: Colors.white,
    paddingVertical: 15,
    paddingHorizontal: 19,
    alignSelf: 'stretch',
    borderRadius: 5,
    fontSize: 16,
    color: Colors.black,
    marginBottom: 20,        // tweak spacing as you like
  },
});