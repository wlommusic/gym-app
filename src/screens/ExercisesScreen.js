import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, List, Text } from 'react-native-paper'; // Note: No 'Button'
import { useRealm, useQuery } from '@realm/react';
import { Exercise } from '../models';

// 1. Import our seed data
import { defaultExercises } from '../data/seedExercises';

const ExercisesScreen = () => {
  const realm = useRealm();

  // 2. This hook gets a "live" list of ALL exercises
  const allExercises = useQuery(Exercise, exercises => {
    return exercises.sorted('name');
  });

  // 3. This is our "fallback" seeder, in case this
  //    screen is the first one to ever ask for exercises.
  if (allExercises.length === 0) {
    realm.write(() => {
      defaultExercises.forEach(exercise => {
        realm.create('Exercise', exercise);
      });
    });
  }

  return (
    <View style={styles.container}>
      {/* 4. We add a simple header */}
      <Appbar.Header>
        <Appbar.Content title="Exercise Database" />
      </Appbar.Header>

      {/* 5. We use the same FlatList to show the data */}
      <FlatList
        data={allExercises}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.primary_muscle_group} | ${item.equipment}`}
            // 6. No onPress handler. This is just a list.
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