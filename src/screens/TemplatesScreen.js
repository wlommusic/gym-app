import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, List, Text, FAB, useTheme } from 'react-native-paper';
import { useRealm, useQuery } from '@realm/react';
import { Template } from '../models';

const TemplatesScreen = ({ navigation }) => {
  const theme = useTheme();
  const realm = useRealm();

  // 1. Query all templates, sorted by name
  const templates = useQuery(Template, t => t.sorted('name'));

  const goBack = () => navigation.goBack();

  // 2. Function to create a NEW template
  const onCreateTemplate = () => {
    let newTemplate;
    realm.write(() => {
      newTemplate = realm.create('Template', {
        name: 'New Routine', // Default name
        // id is auto-generated
      });
    });

    // 3. Navigate to our REUSED screen in 'template' mode!
    navigation.navigate('WorkoutLogging', {
      id: newTemplate._id.toString(),
      mode: 'template',
    });
  };

  const onSelectTemplate = (templateId) => {
    // Open for editing
    navigation.navigate('WorkoutLogging', {
      id: templateId.toString(),
      mode: 'template',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="My Templates" />
      </Appbar.Header>

      <FlatList
        data={templates}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.templateExercises.length} exercises`}
            onPress={() => onSelectTemplate(item._id)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No templates yet. Create one to get started!
            </Text>
          </View>
        }
      />

      {/* Floating Action Button to create new */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onCreateTemplate}
        label="Create Template"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { padding: 32, alignItems: 'center', marginTop: 32 },
  emptyText: { textAlign: 'center', color: 'gray' },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TemplatesScreen;