import React, {Component} from 'react';
import {View, TextInput, Button} from 'react-native';
import {getLogger} from "../core";

const log = getLogger('ItemEdit');

export const ProductEdit = ({ name = '', price = '', navigation}) => {
  const [nameValue, onChangedName] = React.useState(name);
  const [priceValue, onChangedPrice] = React.useState(price);
  return(
      <Consumer>
          {({onSubmit}) => (
              <View>
                  <TextInput
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                      onChangeText={name => onChangedName(name)}
                      placeholder="Name"
                      value={nameValue}
                  />
                  <TextInput
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                      keyboardType='numeric'
                      onChangeText={price => onChangedPrice(price)}
                      placeholder="Price"
                      value={priceValue}
                  />
                  <Button
                    title = "Add item"
                    onPress{() => {
                        onSubmit(nameValue, priceValue)
                  }}
                  />
              </View>
          )}
      </Consumer>
  )
};
