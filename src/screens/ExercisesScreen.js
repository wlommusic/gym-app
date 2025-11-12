import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
// 1. Import useTheme
import { Appbar, List, Text, useTheme } from 'react-native-paper';
import { useRealm, useQuery } from '@realm/react';
import { Exercise } from '../models';
import { defaultExercises } from '../data/seedExercises';

const ExercisesScreen = () => {
  // 2. Get the theme
  const theme = useTheme();
  const realm = useRealm();

  const allExercises = useQuery(Exercise, exercises => {
    return exercises.sorted('name');
  });

  // Seeder logic
  if (allExercises.length === 0) {
    realm.write(() => {
      defaultExercises.forEach(exercise => {
        realm.create('Exercise', exercise);
      });
    });
  }

  return (
    // 3. Apply the theme's background color
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Exercise Database" />
      </Appbar.Header>

      <FlatList
        data={allExercises}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.primary_muscle_group} | ${item.equipment}`}
          />
        )}
        keyExtractor={item => item._id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ExercisesScreen;