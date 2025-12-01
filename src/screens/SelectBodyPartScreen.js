import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, List, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const BODY_PARTS = [
  'Chest', 'Back', 'Shoulders', 'Legs', 'Biceps', 'Triceps', 'Abs', 'Cardio', 'Other',
];

const SelectBodyPartScreen = ({ navigation, route }) => {
  const theme = useTheme();
  // CLEAN PARAMETERS
  const { workoutId } = route.params || {};

  const goBack = () => {
    navigation.goBack();
  };

  const onSelectBodyPart = (bodyPart) => {
    navigation.navigate('SelectExercise', {
      bodyPart: bodyPart,
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
  container: { flex: 1 },
});

export default SelectBodyPartScreen;