import React from 'react';
import {View, TextInput, Button} from 'react-native';
import {getLogger, navService} from "../core";
import { ProductContext } from "./ProductContext";

const log = getLogger('ItemEdit');

export const ProductEdit = ({ name = '', price = '', navigation}) => {
  const [nameValue, onChangedName] = React.useState(name);
  const [priceValue, onChangedPrice] = React.useState(price);
  return(
      <ProductContext.Consumer>
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
                    onPress = {() => {
                        onSubmit(nameValue, priceValue)
                            .then(() => navigation.goBack())
                  }}
                  />
              </View>
          )}
      </ProductContext.Consumer>
  )
};

ProductEdit.navigationOptions = () => ({
   headerTitle: 'Product edit',
});
