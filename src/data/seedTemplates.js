import { BSON } from 'realm';

export const seedTemplates = (realm) => {
  console.log('Running smart seed check...');

  realm.write(() => {

    // --- 1. Check & Create PUSH PULL LEGS ---
    const pplExists = realm.objects('WorkoutTemplate').filtered('name == "Push Pull Legs"').length > 0;

    if (!pplExists) {
      console.log('Seeding Push Pull Legs...');
      const ppl = realm.create('WorkoutTemplate', {
        _id: new BSON.ObjectId(),
        name: 'Push Pull Legs',
        description: 'Classic 3-day split. Best for beginners & intermediates.',
        is_active: false,
        is_custom: false,
        created_at: new Date(),
        dailyWorkouts: []
      });

      // Day 1: Push
      const push = realm.create('DailyWorkout', { _id: new BSON.ObjectId(), day_of_week: 'Monday', workout_title: 'Push A', is_rest_day: false, exercises: [] });
      push.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Bench Press', sets: '3', reps_or_time: '8-12', order: 1 }));
      push.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Overhead Press', sets: '3', reps_or_time: '10', order: 2 }));
      push.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Tricep Pushdown', sets: '3', reps_or_time: '12-15', order: 3 }));
      ppl.dailyWorkouts.push(push);

      // Day 2: Pull
      const pull = realm.create('DailyWorkout', { _id: new BSON.ObjectId(), day_of_week: 'Wednesday', workout_title: 'Pull A', is_rest_day: false, exercises: [] });
      pull.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Lat Pulldown', sets: '3', reps_or_time: '10-12', order: 1 }));
      pull.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Barbell Row', sets: '3', reps_or_time: '8-10', order: 2 }));
      pull.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Bicep Curl', sets: '3', reps_or_time: '12', order: 3 }));
      ppl.dailyWorkouts.push(pull);

      // Day 3: Legs
      const legs = realm.create('DailyWorkout', { _id: new BSON.ObjectId(), day_of_week: 'Friday', workout_title: 'Legs A', is_rest_day: false, exercises: [] });
      legs.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Squat', sets: '3', reps_or_time: '6-10', order: 1 }));
      legs.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Leg Extension', sets: '3', reps_or_time: '12-15', order: 2 }));
      legs.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: 'Calf Raise', sets: '4', reps_or_time: '15', order: 3 }));
      ppl.dailyWorkouts.push(legs);
    }

    // --- 2. Check & Create BRO SPLIT ---
    const broExists = realm.objects('WorkoutTemplate').filtered('name == "Bro Split"').length > 0;

    if (!broExists) {
      console.log('Seeding Bro Split...');
      const broSplit = realm.create('WorkoutTemplate', {
        _id: new BSON.ObjectId(),
        name: 'Bro Split',
        description: 'One muscle group per day. High volume.',
        is_active: false,
        is_custom: false,
        created_at: new Date(),
        dailyWorkouts: []
      });

      const days = [
        { day: 'Monday', title: 'Chest Day', ex: 'Bench Press' },
        { day: 'Tuesday', title: 'Back Day', ex: 'Deadlift' },
        { day: 'Wednesday', title: 'Shoulder Day', ex: 'Military Press' },
        { day: 'Thursday', title: 'Leg Day', ex: 'Squat' },
        { day: 'Friday', title: 'Arm Day', ex: 'Barbell Curl' },
      ];

      days.forEach(d => {
        const dayObj = realm.create('DailyWorkout', { _id: new BSON.ObjectId(), day_of_week: d.day, workout_title: d.title, is_rest_day: false, exercises: [] });
        dayObj.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: d.ex, sets: '4', reps_or_time: '8-12', order: 1 }));
        broSplit.dailyWorkouts.push(dayObj);
      });
    }

    // --- 3. Check & Create UPPER / LOWER ---
    const ulExists = realm.objects('WorkoutTemplate').filtered('name == "Upper / Lower"').length > 0;

    if (!ulExists) {
      console.log('Seeding Upper/Lower...');
      const ulSplit = realm.create('WorkoutTemplate', {
        _id: new BSON.ObjectId(),
        name: 'Upper / Lower',
        description: 'Balanced frequency. 4 days per week.',
        is_active: false,
        is_custom: false,
        created_at: new Date(),
        dailyWorkouts: []
      });

      const ulDays = ['Monday', 'Tuesday', 'Thursday', 'Friday'];
      ulDays.forEach((d, i) => {
        const type = i % 2 === 0 ? 'Upper' : 'Lower';
        const dayObj = realm.create('DailyWorkout', { _id: new BSON.ObjectId(), day_of_week: d, workout_title: `${type} Body`, is_rest_day: false, exercises: [] });
        dayObj.exercises.push(realm.create('TemplateExercise', { _id: new BSON.ObjectId(), exercise_name: type === 'Upper' ? 'Bench Press' : 'Squat', sets: '3', reps_or_time: '10', order: 1 }));
        ulSplit.dailyWorkouts.push(dayObj);
      });
    }

    console.log('Seed check complete.');
  });
};