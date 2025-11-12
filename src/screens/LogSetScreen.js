import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Appbar,
  Text,
  Button,
  TextInput,
  List,
  IconButton, // 1. Import IconButton
} from 'react-native-paper';
import { useRealm, useObject } from '@realm/react';
import { WorkoutExercise, Set } from '../models';
import { BSON } from 'realm';

const LogSetScreen = ({ navigation, route }) => {
  const { workoutExerciseId } = route.params || {};
  const realm = useRealm();

  const activeWorkoutExercise = useObject(
    WorkoutExercise,
    new BSON.ObjectId(workoutExerciseId),
  );

  // --- NEW STATE ---
  // 2. We add state to track which set (if any) we are editing
  const [editingSetId, setEditingSetId] = useState(null);
  // --- END NEW STATE ---

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const goBack = () => {
    navigation.goBack();
  };

  // --- UPDATED FUNCTION ---
  // 3. This function now handles BOTH creating and updating
  const onLogOrUpdateSet = () => {
    if (!weight || !reps || !activeWorkoutExercise) {
      return;
    }

    realm.write(() => {
      if (editingSetId) {
        // --- EDIT LOGIC ---
        // 4. We're in "edit mode," so find the set and update it
        const setToUpdate = realm.objectForPrimaryKey(Set, editingSetId);
        if (setToUpdate) {
          setToUpdate.weight_kg = parseFloat(weight);
          setToUpdate.reps = parseInt(reps);
        }
      } else {
        // --- CREATE LOGIC ---
        // 5. We're in "create mode," so create a new set
        const newSet = realm.create('Set', {
          set_number: activeWorkoutExercise.sets.length + 1,
          weight_kg: parseFloat(weight),
          reps: parseInt(reps),
        });
        activeWorkoutExercise.sets.push(newSet);
      }
    });

    // 6. Clear inputs and exit edit mode
    setWeight('');
    setReps('');
    setEditingSetId(null);
  };
  // --- END UPDATED FUNCTION ---

  // --- NEW FUNCTION ---
  // 7. This runs when the "delete" icon is pressed
  const onDeleteSet = (setIdToDelete) => {
    realm.write(() => {
      const setToDelete = realm.objectForPrimaryKey(Set, setIdToDelete);
      if (setToDelete) {
        // This command removes the object from the database
        realm.delete(setToDelete);
      }
    });
  };
  // --- END NEW FUNCTION ---

  // --- NEW FUNCTION ---
  // 8. This runs when the "edit" icon is pressed
  const onStartEditSet = (set) => {
    setEditingSetId(set._id);
    setWeight(set.weight_kg.toString());
    setReps(set.reps.toString());
  };
  // --- END NEW FUNCTION ---

  // --- NEW FUNCTION ---
  // 9. This runs if you're editing and want to cancel
  const onCancelEdit = () => {
    setEditingSetId(null);
    setWeight('');
    setReps('');
  };
  // --- END NEW FUNCTION ---

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title={activeWorkoutExercise?.exercise?.name || 'Log Sets'}
        />
      </Appbar.Header>

      {/* --- UPDATED FORM --- */}
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
          icon={editingSetId ? 'check' : 'plus'} // 10. Change icon
          mode="contained"
          onPress={onLogOrUpdateSet}
          style={styles.logButton}>
          {/* 11. Change button text */}
          {editingSetId ? 'Update Set' : 'Log Set'}
        </Button>

        {/* 12. Show a "Cancel" button only when editing */}
        {editingSetId && (
          <Button
            mode="outlined"
            onPress={onCancelEdit}
            style={styles.cancelButton}>
            Cancel Edit
          </Button>
        )}
      </View>
      {/* --- END UPDATED FORM --- */}

      {/* --- UPDATED SET LIST --- */}
      <FlatList
        data={activeWorkoutExercise?.sets}
        keyExtractor={item => item._id.toString()}
        ListHeaderComponent={
          <Text variant="titleMedium" style={styles.listHeader}>
            Logged Sets
          </Text>
        }
        renderItem={({ item, index }) => (
          <List.Item
            title={`Set ${index + 1}: ${item.weight_kg} kg x ${item.reps} reps`}
            // 13. Add icons to the right of the list item
            right={() => (
              <View style={{flexDirection: 'row'}}>
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
      {/* --- END UPDATED SET LIST --- */}
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