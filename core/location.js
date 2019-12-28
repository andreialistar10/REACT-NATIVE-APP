import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const askLocationPermission = () => Permissions.askAsync(Permissions.LOCATION);

export const findCurrentLocation = () => {
  return askLocationPermission()
      .then(({ status }) => {
          console.log("STATUS: " + status);
          if (status !== 'granted') {
              return Promise.reject(null);
          }
          return Promise.resolve(null);
      })
      .then(() => Location.getCurrentPositionAsync({accuracy : Location.Accuracy.BestForNavigation}));
};
