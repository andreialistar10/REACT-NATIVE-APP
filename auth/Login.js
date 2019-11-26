import React from 'react';
import { Button, View, ActivityIndicator, Text, TextInput } from 'react-native';

import { getLogger } from '../core';
import { Consumer } from './AuthContext';

const log = getLogger('Login');

export const Login = ({ navigation }) => {

    log ('render');
    const [ username, onChangeUsername ] = React.useState('');
    const [ password, onChangePassword ] = React.useState('');
    return(
      <Consumer>
          {({onLogin, loginError, loginInProgress}) => (
             <View>
                 <ActivityIndicator animating = {loginInProgress} size = "large"/>
                 {loginError && <Text>{loginError.message || 'Login error'}</Text>}
                 <TextInput
                    style = {styles.textInput}
                    placeholder="Please type your username"
                    onChangeText={username => onChangeUsername(username)}
                    value = {username}
                 />
                 <TextInput
                    style = {styles.textInput}
                    placeholder="Please type your password"
                    onChangeText={password => onChangePassword(password)}
                    secureTextEntry={true}
                    value={password}
                 />
                 <Button title="Login"
                    onPress = {() => {
                        onLogin(username,password)
                            .then(() => navigation.navigate('Products'))
                    }}
                 />
             </View>
          )};
      </Consumer>
    );
};

Login.navigationOptions = () => ({
   headerTitle: 'Please login',
});

const styles = StyleSheet.create({
   textInput: {
       height:40,
       borderColor: 'gray',
       borderWidth: 1,
   }
});
