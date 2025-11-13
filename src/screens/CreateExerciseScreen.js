import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, Button, TextInput, useTheme } from 'react-native-paper';
import { useRealm } from '@realm/react';
import { Exercise } from '../models';

// 1. Receive 'route' prop
const CreateExerciseScreen = ({ navigation, route }) => {
  const realm = useRealm();
  const theme = useTheme();

  // 2. Get the prefilled muscle group
  const { prefilledMuscleGroup } = route.params || {};

  // 3. Set the initial state of muscleGroup
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(prefilledMuscleGroup || '');
  const [equipment, setEquipment] = useState('');

  const goBack = () => {
    navigation.goBack();
  };

  const onSaveExercise = () => {
    if (!name || !muscleGroup) {
      alert('Please fill in at least Name and Muscle Group.');
      return;
    }

    realm.write(() => {
      realm.create('Exercise', {
        name: name,
        primary_muscle_group: muscleGroup,
        equipment: equipment,
        is_custom: true,
      });
    });

    navigation.goBack();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Create New Exercise" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <TextInput
          label="Exercise Name (Required)"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Primary Muscle Group (Required)"
          value={muscleGroup} // 4. This will now show the prefilled value
          onChangeText={setMuscleGroup}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Equipment (Optional)"
          value={equipment}
          onChangeText={setEquipment}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={onSaveExercise}
          style={styles.saveButton}>
          Save Exercise
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});

export default CreateExerciseScreen;