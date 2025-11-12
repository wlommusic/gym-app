import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// 1. Import useTheme
import { Appbar, Text, Button, TextInput, useTheme } from 'react-native-paper';
import { useRealm } from '@realm/react';
import { Exercise } from '../models';

const CreateExerciseScreen = ({ navigation }) => {
  const realm = useRealm();
  // 2. Get the theme
  const theme = useTheme();

  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
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
    // 3. Apply the theme's background color
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