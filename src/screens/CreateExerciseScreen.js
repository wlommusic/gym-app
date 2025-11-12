import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, Button, TextInput } from 'react-native-paper';

// --- NEW IMPORTS ---
import { useRealm } from '@realm/react';
import { Exercise } from '../models';
// --- END NEW IMPORTS ---

const CreateExerciseScreen = ({ navigation }) => {
  const realm = useRealm();

  // --- NEW STATE ---
  // 1. Create state variables to hold our form data
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  // --- END NEW STATE ---

  const goBack = () => {
    navigation.goBack();
  };

  // --- NEW FUNCTION ---
  // 2. This function saves the new exercise to the database
  const onSaveExercise = () => {
    if (!name || !muscleGroup) {
      // Simple validation
      alert('Please fill in at least Name and Muscle Group.');
      return;
    }

    realm.write(() => {
      realm.create('Exercise', {
        name: name,
        primary_muscle_group: muscleGroup,
        equipment: equipment,
        is_custom: true, // 3. Mark this as a custom exercise
      });
    });

    // 4. Go back to the previous screen (SelectExerciseScreen)
    navigation.goBack();
  };
  // --- END NEW FUNCTION ---

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Create New Exercise" />
      </Appbar.Header>

      {/* 5. Use ScrollView in case form gets long */}
      <ScrollView style={styles.content}>
        {/* --- NEW FORM UI --- */}
        <TextInput
          label="Exercise Name (Required)"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Primary Muscle Group (Required)"
          value={muscleGroup}
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
        {/* --- END NEW FORM UI --- */}
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