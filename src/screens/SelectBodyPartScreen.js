import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, List, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
// We no longer need useQuery or Workout here
// import { useQuery } from '@realm/react';
// import { Workout } from '../models';

const BODY_PARTS = [
  'Chest', 'Back', 'Shoulders', 'Legs', 'Biceps', 'Triceps', 'Abs', 'Cardio', 'Other',
];

// 1. We now receive the 'route' prop
const SelectBodyPartScreen = ({ navigation, route }) => {
  const theme = useTheme();

  // 2. We get the workoutId from the route.
  //    If we came from 'Quick Start', this will be 'undefined'.
  //    If we came from 'Add Exercise', this will have the ID.
  const { workoutId } = route.params || {};

  const goBack = () => {
    navigation.goBack();
  };

  const onSelectBodyPart = (bodyPart) => {
    navigation.navigate('SelectExercise', {
      bodyPart: bodyPart,
      // 3. We pass the workoutId (or undefined) along
      workoutId: workoutId,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Select Body Part" />
      </Appbar.Header>

      <FlatList
        data={BODY_PARTS}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <List.Item
            title={item}
            onPress={() => onSelectBodyPart(item)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SelectBodyPartScreen;