import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';

const AnimatingComponent = () => {
  const start = useSharedValue({x: 0, y: 0});
  const offset = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const savedScale = useSharedValue(1);

  const ref = useRef(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
        {scale: scale.value},
        {rotateZ: `${rotation.value}rad`},
      ],
      width: 100,
      height: 100,
      backgroundColor: 'red',
      position: 'absolute',
      alignSelf: 'center',
    };
  });

  // useAnimatedReaction(
  //   () => ({ rotation: rotation.value, offset: offset.value, scale: scale.value }),
  //   ({ rotation, scale, offset }) => {
  //     console.log(ref?.current, '123');
  //   },
  //   [scale, offset, rotation],
  // );

  const zoomGesture = Gesture.Pinch()
    .hitSlop({horizontal: 400})
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotateGesture = Gesture.Rotation()
    .hitSlop({horizontal: 400})
    .onUpdate(event => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const onEndDrag = () => {
    start.value = {
      x: offset.value.x,
      y: offset.value.y,
    };
  };

  const onUpdateDrag = e => {
    offset.value = {
      x: e.translationX + start.value.x,
      y: e.translationY + start.value.y,
    };
  };

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .minPointers(1)
    .runOnJS(true)
    .onUpdate(onUpdateDrag)
    .onEnd(onEndDrag);

  const composed = Gesture.Simultaneous(
    dragGesture,
    zoomGesture,
    rotateGesture,
  );

  return (
    <GestureDetector gesture={composed}>
      <Animated.View ref={ref} style={animatedStyle} />
    </GestureDetector>
  );
};

const Component = () => (
  <View style={[styles.container]}>
    <AnimatingComponent />
  </View>
);

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Component />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
});

export default App;
