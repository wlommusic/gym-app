import { User } from './models';
import { Exercise } from './models';
import { Workout } from './models';
import { WorkoutExercise } from './models';
import { Set } from './models';

// --- NEW IMPORTS ---
// 1. Import our new seed data list
import { defaultExercises } from './data/seedExercises';
// --- END NEW IMPORTS ---

export const realmConfig = {
  schema: [User, Exercise, Workout, WorkoutExercise, Set],
  schemaVersion: 2,

  // --- THIS IS THE NEW LOGIC ---
  // 2. 'onFirstOpen' is a function that Realm will
  //    run only one time, when the .realm file is first created.
  onFirstOpen(realm) {
    // 3. We check if the Exercise table is already populated (it shouldn't be)
    const exercises = realm.objects('Exercise');
    if (exercises.length === 0) {
      // 4. We start a write transaction
      realm.write(() => {
        // 5. We loop through our defaultExercises array
        defaultExercises.forEach(exercise => {
          // 6. And create a new 'Exercise' object for each one
          realm.create('Exercise', exercise);
        });
      });
    }
  },
};