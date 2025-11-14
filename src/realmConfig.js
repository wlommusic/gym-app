import { User } from './models';
import { Exercise } from './models';
import { Workout } from './models';
import { WorkoutExercise } from './models';
import { Set } from './models';
import { defaultExercises } from './data/seedExercises';

export const realmConfig = {
  schema: [User, Exercise, Workout, WorkoutExercise, Set],
  schemaVersion: 4,

  onFirstOpen(realm) {
    const exercises = realm.objects('Exercise');
    if (exercises.length === 0) {
      realm.write(() => {
        defaultExercises.forEach(exercise => {
          realm.create('Exercise', exercise);
        });
      });
    }
  },
};