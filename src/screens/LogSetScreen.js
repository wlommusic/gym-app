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

  const activeWorkoutExercise = useObject(
    WorkoutExercise,
    new BSON.ObjectId(workoutExerciseId),
  );

  const [displayedSets, setDisplayedSets] = useState([]);
  const [editingSetId, setEditingSetId] = useState(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  useEffect(() => {
    if (activeWorkoutExercise) {
      setDisplayedSets(
        Array.from(activeWorkoutExercise.sets.map(set => set.toJSON())),
      );
    }
  }, [activeWorkoutExercise]);

  const goBack = () => {
    navigation.goBack();
  };

  const onLogOrUpdateSet = () => {
    const weightRegex = /^\d*\.?\d+$/;
    const repsRegex = /^\d+$/;

    if (!weight || !reps) { Alert.alert('Error', 'Please fill in both Weight and Reps.'); return; }
    if (!weightRegex.test(weight)) { Alert.alert('Invalid Weight', 'Please enter a valid number.'); return; }
    if (!repsRegex.test(reps)) { Alert.alert('Invalid Reps', 'Please enter a whole number.'); return; }
    if (!activeWorkoutExercise) { Alert.alert('Error', 'Could not find active workout.'); return; }

    let updatedSet;

    realm.write(() => {
      if (editingSetId) {
        const setToUpdate = realm.objectForPrimaryKey(Set, editingSetId);
        if (setToUpdate) {
          setToUpdate.weight_kg = parseFloat(weight);
          setToUpdate.reps = parseInt(reps);
          updatedSet = setToUpdate.toJSON();
        }
      } else {
        const newSet = realm.create('Set', {
          set_number: displayedSets.length + 1,
          weight_kg: parseFloat(weight),
          reps: parseInt(reps),
        });
        activeWorkoutExercise.sets.push(newSet);
        updatedSet = newSet.toJSON();
      }
    });

    if (editingSetId) {
      setDisplayedSets(currentSets =>
        currentSets.map(s => (s._id.equals(editingSetId) ? updatedSet : s)),
      );
    } else {
      setDisplayedSets(currentSets => [...currentSets, updatedSet]);
    }

    setWeight('');
    setReps('');
    setEditingSetId(null);
  };

  const onDeleteSet = (setIdToDelete) => {
    setDisplayedSets(currentSets =>
      currentSets.filter(s => !s._id.equals(setIdToDelete)),
    );

    realm.write(() => {
      const setToDelete = realm.objectForPrimaryKey(Set, setIdToDelete);
      if (setToDelete) {
        realm.delete(setToDelete);
      }
    });

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

      <View style={styles.formContainer}>
        <TextInput label="Weight (kg)" value={weight} onChangeText={setWeight} style={styles.input} keyboardType="numeric" mode="outlined" />
        <TextInput label="Reps" value={reps} onChangeText={setReps} style={styles.input} keyboardType="numeric" mode="outlined" />
        <Button icon={editingSetId ? 'check' : 'plus'} mode="contained" onPress={onLogOrUpdateSet} style={styles.logButton}>
          {editingSetId ? 'Update Set' : 'Log Set'}
        </Button>
        {editingSetId && (
          <Button mode="outlined" onPress={onCancelEdit} style={styles.cancelButton}>Cancel Edit</Button>
        )}
      </View>

      <FlatList
        data={displayedSets}
        keyExtractor={item => item._id.toString()}
        ListHeaderComponent={<Text variant="titleMedium" style={styles.listHeader}>Logged Sets</Text>}
        renderItem={({ item, index }) => (
          <List.Item
            title={`Set ${index + 1}: ${item.weight_kg} kg x ${item.reps} reps`}
            right={() => (
              <View style={{ flexDirection: 'row' }}>
                <IconButton icon="pencil" size={20} onPress={() => onStartEditSet(item)} />
                <IconButton icon="delete" size={20} onPress={() => onDeleteSet(item._id)} />
              </View>
            )}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No sets logged yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  input: { width: '48%', marginBottom: 12 },
  logButton: { width: '100%' },
  cancelButton: { width: '100%', marginTop: 8 },
  listHeader: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  emptyText: { paddingHorizontal: 16, fontStyle: 'italic' },
});

export default LogSetScreen;