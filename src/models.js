import Realm from 'realm';

// 1. USER Table
export class User extends Realm.Object {
  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      name: 'string',
      email: 'string',
      unit_preference: {type: 'string', default: 'kg'}, // 'kg' | 'lbs'
      created_at: {type: 'date', default: () => new Date()},
      updated_at: {type: 'date', default: () => new Date()},

      // Relationships (Inverse)
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

// 2. EXERCISE Table
export class Exercise extends Realm.Object {
  static schema = {
    name: 'Exercise',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      name: 'string',
      exercise_type: 'string?', // "Strength / Cardio / Mobility"
      primary_muscle_group: 'string?',
      secondary_muscle_group: 'string?',
      equipment: 'string?',
      description: 'string?',
      is_custom: {type: 'bool', default: false},
      created_at: {type: 'date', default: () => new Date()},
      updated_at: {type: 'date', default: () => new Date()},

      // Relationship (Forward)
      user: 'User?',
    },
  };
}

// 3. WORKOUT Table
export class Workout extends Realm.Object {
  static schema = {
    name: 'Workout',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      date: {type: 'date', default: () => new Date()},
      name: 'string?', // e.g., "Push Day"

      // --- THIS IS THE NEW LINE ---
      status: {type: 'string', default: 'pending'}, // "pending" | "completed"
      // --- END NEW LINE ---

      notes: 'string?',
      duration_minutes: 'float?',
      total_volume_kg: 'float?',
      total_exercises: 'int?',
      total_sets: 'int?',
      feeling_rating: 'int?', // 1-5
      created_at: {type: 'date', default: () => new Date()},
      updated_at: {type: 'date', default: () => new Date()},
      deleted_at: 'date?', // For soft deletes

      // Relationship (Forward)
      user: 'User?', // <-- Also changed this to 'User?' so it can be created without a user first
      workoutExercises: 'WorkoutExercise[]',
    },
  };
}

// 4. WORKOUT_EXERCISE Table
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

      // Relationship (Forward)
      exercise: 'Exercise?', // <-- Changed this to 'Exercise?' for safety
      sets: 'Set[]',

      // Relationship (Inverse)
      workout: {
        type: 'linkingObjects',
        objectType: 'Workout',
        property: 'workoutExercises',
      },
    },
  };
}

// 5. SET Table
export class Set extends Realm.Object {
  static schema = {
    name: 'Set',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      set_number: 'int',
      weight_kg: 'float',
      reps: 'int',
      duration_seconds: 'int?', // For cardio/timed sets
      distance_meters: 'float?', // For cardio
      rpe: 'int?', // 1-10
      rest_time_seconds: 'int?',
      is_warmup: {type: 'bool', default: false},
      is_failure: {type: 'bool', default: false},
      notes: 'string?',
      created_at: {type: 'date', default: () => new Date()},

      // Relationship (Inverse)
      workoutExercise: {
        type: 'linkingObjects',
        objectType: 'WorkoutExercise',
        property: 'sets',
      },
    },
  };
}