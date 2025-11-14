import Realm from 'realm';

// 1. USER Table
export class User extends Realm.Object {
  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      name: 'string',

      // --- THIS IS THE FIX ---
      // We add a '?' to make the email field optional
      email: 'string?',
      // --- END FIX ---

      unit_preference: {type: 'string', default: 'kg'},
      created_at: {type: 'date', default: () => new Date()},
      updated_at: {type: 'date', default: () => new Date()},

      exercises: {
        type: 'linkingObjects',
        objectType: 'Exercise',
        property: 'user',
      },
      workouts: {
        type: 'linkingObjects',
        objectType: 'Workout',
        property: 'user',
      },
    },
  };
}

// ... (Rest of the file is unchanged) ...
export class Exercise extends Realm.Object {
  static schema = {
    name: 'Exercise',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      name: 'string',
      exercise_type: 'string?',
      primary_muscle_group: 'string?',
      secondary_muscle_group: 'string?',
      equipment: 'string?',
      description: 'string?',
      is_custom: {type: 'bool', default: false},
      created_at: {type: 'date', default: () => new Date()},
      updated_at: {type: 'date', default: () => new Date()},
      user: 'User?',
    },
  };
}

export class Workout extends Realm.Object {
  static schema = {
    name: 'Workout',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      date: {type: 'date', default: () => new Date()},
      name: 'string?',
      status: {type: 'string', default: 'pending'},
      primary_muscle_group: 'string?',
      notes: 'string?',
      duration_minutes: 'float?',
      total_volume_kg: 'float?',
      total_exercises: 'int?',
      total_sets: 'int?',
      feeling_rating: 'int?',
      created_at: {type: 'date', default: () => new Date()},
      updated_at: {type: 'date', default: () => new Date()},
      deleted_at: 'date?',
      user: 'User?',
      workoutExercises: 'WorkoutExercise[]',
    },
  };
}

export class WorkoutExercise extends Realm.Object {
  static schema = {
    name: 'WorkoutExercise',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      exercise_order: 'int?',
      notes: 'string?',
      sets_completed: 'int?',
      highest_weight_kg: 'float?',
      total_volume_exercise_kg: 'float?',
      one_rep_max_estimate_kg: 'float?',
      rest_time_avg_seconds: 'int?',
      created_at: {type: 'date', default: () => new Date()},
      updated_at: {type: 'date', default: () => new Date()},
      exercise: 'Exercise?',
      sets: 'Set[]',
      workout: {
        type: 'linkingObjects',
        objectType: 'Workout',
        property: 'workoutExercises',
      },
    },
  };
}

export class Set extends Realm.Object {
  static schema = {
    name: 'Set',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      set_number: 'int',
      weight_kg: 'float',
      reps: 'int',
      duration_seconds: 'int?',
      distance_meters: 'float?',
      rpe: 'int?',
      rest_time_seconds: 'int?',
      is_warmup: {type: 'bool', default: false},
      is_failure: {type: 'bool', default: false},
      notes: 'string?',
      created_at: {type: 'date', default: () => new Date()},
      workoutExercise: {
        type: 'linkingObjects',
        objectType: 'WorkoutExercise',
        property: 'sets',
      },
    },
  };
}