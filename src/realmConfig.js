import { User, Exercise, Workout, WorkoutExercise, Set, WorkoutTemplate, DailyWorkout, TemplateExercise } from './models';
import { defaultExercises } from './data/seedExercises';
import { premadeSplits } from './data/seedTemplates';
import { BSON } from 'realm';

export const realmConfig = {
  schema: [User, Exercise, Workout, WorkoutExercise, Set, WorkoutTemplate, DailyWorkout, TemplateExercise],
  schemaVersion: 10, // Incremented to apply the fix and force data reset

  deleteRealmIfMigrationNeeded: true,

  onFirstOpen(realm) {
    try {
      // Seed default exercises
      realm.write(() => {
        defaultExercises.forEach(exercise => {
          realm.create('Exercise', exercise);
        });
      });

      // Seed pre-made workout templates
      realm.write(() => {
        premadeSplits.forEach(split => {
          const newTemplate = realm.create('WorkoutTemplate', {
            _id: new BSON.ObjectId(),
            name: split.name,
            description: split.description,
            is_custom: false,
          });

          newTemplate.dailyWorkouts = split.dailyWorkouts.map(dw => {
            return realm.create('DailyWorkout', {
              _id: new BSON.ObjectId(),
              day_of_week: dw.day_of_week,
              workout_title: dw.workout_title || '',
              is_rest_day: dw.is_rest_day || false,
              exercises: dw.exercises.map(ex => {
                return realm.create('TemplateExercise', {
                  _id: new BSON.ObjectId(),
                  exercise_name: ex.exercise_name,
                  sets: ex.sets,
                  reps_or_time: ex.reps_or_time,
                  order: ex.order || 0,
                });
              }),
            });
          });
        });
      });
    } catch (error) {
      console.error("A fatal error occurred during database seeding:", error);
    }
  },
};