import React, {useState} from 'react';
import {Image, View} from 'react-native';
import * as Progress from 'react-native-progress';

function ImageComponent({src, style}) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setHasError] = useState(false);

  const onLoadStart = () => {
    setIsLoading(true);
  };

  const onLoadEnd = () => {
    setIsLoading(false);
  };
  const onError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  return (
    <View
      style={{
        height: 110,
        display: 'flex',
        alignItems: 'center',
      }}>
      {isLoading && <Progress.Circle size={30} indeterminate={true} />}
      <Image
        onLoadEnd={onLoadEnd}
        onError={onError}
        onLoadStart={onLoadStart}
        style={style}
        source={{uri: src}}
      />
    </View>
  );
}

export default ImageComponent;
