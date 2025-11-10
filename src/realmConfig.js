// Import all 5 of our model blueprints from the models.js file
import { User } from './models';
import { Exercise } from './models';
import { Workout } from './models';
import { WorkoutExercise } from './models';
import { Set } from './models';

// This is the configuration object our app will use
export const realmConfig = {
  // The 'schema' property takes an array of all the model blueprints (classes)
  // that we want Realm to know about.
  schema: [User, Exercise, Workout, WorkoutExercise, Set],

  // The 'schemaVersion' is like a version number for your database structure.
  // We start at 1. If we ever change our tables (e.g., add a new property),
  // we will need to increase this number to 2, 3, etc., and provide a
  // "migration" plan.
  schemaVersion: 1,
};