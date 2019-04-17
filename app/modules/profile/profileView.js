import React from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native';

const getErrorMessage = () => (
  <Text>
    An Error occured when fetching data
  </Text>
);

const ProfileView = (props: Props) => {
  const {
    isLoading,
    error,
    data,
  } = props;

  return (
    <View>
      {isLoading ? <ActivityIndicator /> : null}
      {error ? getErrorMessage() : null}
      <Text>This is Profile</Text>
      <Button
        title='Load my Data'
      />
    </View>
  );
};

export default ProfileView;
