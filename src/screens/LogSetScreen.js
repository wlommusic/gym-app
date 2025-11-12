import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import {
  Appbar,
  Text,
  Button,
  TextInput,
  List,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { useRealm, useObject } from '@realm/react';
import { WorkoutExercise, Set } from '../models';
import { BSON } from 'realm';

const LogSetScreen = ({ navigation, route }) => {
  const { workoutExerciseId } = route.params || {};
  const realm = useRealm();
  const theme = useTheme();

  // This hook gets the "live" object from Realm
  const activeWorkoutExercise = useObject(
    WorkoutExercise,
    new BSON.ObjectId(workoutExerciseId),
  );

  // This "useState" array is our "static" copy for the UI
  // This is the key to fixing all the bugs
  const [displayedSets, setDisplayedSets] = useState([]);

  const [editingSetId, setEditingSetId] = useState(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  // This 'useEffect' syncs the live Realm data (activeWorkoutExercise.sets)
  // into our static state (displayedSets) ONCE when the screen loads.
  useEffect(() => {
    if (activeWorkoutExercise) {
      // .toJSON() makes them plain, safe objects.
      setDisplayedSets(
        Array.from(activeWorkoutExercise.sets.map(set => set.toJSON())),
      );
    }
  }, [activeWorkoutExercise]); // Only re-sync when the object itself loads

  const goBack = () => {
    navigation.goBack();
  };

  const onLogOrUpdateSet = () => {
    // Validation
    const weightRegex = /^\d*\.?\d+$/;
    const repsRegex = /^\d+$/;

    if (!weight || !reps) {
      Alert.alert('Error', 'Please fill in both Weight and Reps.');
      return;
    }
    if (!weightRegex.test(weight)) {
      Alert.alert('Invalid Weight', 'Please enter a valid number (e.g., 60 or 60.5).');
      return;
    }
    if (!repsRegex.test(reps)) {
      Alert.alert('Invalid Reps', 'Please enter a whole number (e.g., 10).');
      return;
    }
    if (!activeWorkoutExercise) {
      Alert.alert('Error', 'Could not find active workout. Please go back and try again.');
      return;
    }

    let updatedSet; // We'll hold the new/updated set data here

    // 1. Write to the database
    realm.write(() => {
      if (editingSetId) {
        // --- EDIT LOGIC ---
        const setToUpdate = realm.objectForPrimaryKey(Set, editingSetId);
        if (setToUpdate) {
          setToUpdate.weight_kg = parseFloat(weight);
          setToUpdate.reps = parseInt(reps);
          updatedSet = setToUpdate.toJSON(); // Get a plain copy
        }
      } else {
        // --- CREATE LOGIC ---
        const newSet = realm.create('Set', {
          set_number: displayedSets.length + 1, // Base set_number on our static list
          weight_kg: parseFloat(weight),
          reps: parseInt(reps),
        });
        activeWorkoutExercise.sets.push(newSet);
        updatedSet = newSet.toJSON(); // Get a plain copy
      }
    });

    // 2. Manually update our UI state (this is instant)
    if (editingSetId) {
      setDisplayedSets(currentSets =>
        currentSets.map(s => (s._id.equals(editingSetId) ? updatedSet : s)),
      );
    } else {
      setDisplayedSets(currentSets => [...currentSets, updatedSet]);
    }

    // 3. Clear the form
    setWeight('');
    setReps('');
    setEditingSetId(null);
  };

  const onDeleteSet = (setIdToDelete) => {
    // 1. Update our UI state *IMMEDIATELY*
    //    This wins the race condition and fixes the crash
    setDisplayedSets(currentSets =>
      currentSets.filter(s => !s._id.equals(setIdToDelete)),
    );

    // 2. Now, update the database in the background
    realm.write(() => {
      const setToDelete = realm.objectForPrimaryKey(Set, setIdToDelete);
      if (setToDelete) {
        realm.delete(setToDelete);
      }
    });

    // 3. Clear form if we were editing the deleted set
    if (editingSetId && editingSetId.equals(setIdToDelete)) {
      onCancelEdit();
    }
  };

  const onStartEditSet = (set) => {
    setEditingSetId(set._id);
    setWeight(set.weight_kg.toString());
    setReps(set.reps.toString());
  };

  const onCancelEdit = () => {
    setEditingSetId(null);
    setWeight('');
    setReps('');
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title={activeWorkoutExercise?.exercise?.name || 'Log Sets'}
        />
      </Appbar.Header>

      {/* Form (Unchanged) */}
      <View style={styles.formContainer}>
        <TextInput
          label="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
        />
        <TextInput
          label="Reps"
          value={reps}
          onChangeText={setReps}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
        />
        <Button
          icon={editingSetId ? 'check' : 'plus'}
          mode="contained"
          onPress={onLogOrUpdateSet}
          style={styles.logButton}>
          {editingSetId ? 'Update Set' : 'Log Set'}
        </Button>

        {editingSetId && (
          <Button
            mode="outlined"
            onPress={onCancelEdit}
            style={styles.cancelButton}>
            Cancel Edit
          </Button>
        )}
      </View>

      <FlatList
        // Use our "static" state array for the data
        data={displayedSets}
        keyExtractor={item => item._id.toString()}
        ListHeaderComponent={
          <Text variant="titleMedium" style={styles.listHeader}>
            Logged Sets
          </Text>
        }
        renderItem={({ item, index }) => (
          <List.Item
            title={`Set ${index + 1}: ${item.weight_kg} kg x ${item.reps} reps`}
            right={() => (
              <View style={{ flexDirection: 'row' }}>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => onStartEditSet(item)}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => onDeleteSet(item._id)}
                />
              </View>
            )}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No sets logged yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  input: {
    width: '48%',
    marginBottom: 12,
  },
  logButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
    marginTop: 8,
  },
  listHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },
});

export default LogSetScreen;