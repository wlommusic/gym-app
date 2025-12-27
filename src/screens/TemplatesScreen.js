import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, useTheme, IconButton, Chip, FAB, Divider } from 'react-native-paper';
import { useQuery, useRealm } from '@realm/react';
import { WorkoutTemplate } from '../models';
import { SafeAreaView } from 'react-native-safe-area-context';

const TemplatesScreen = ({ navigation }) => {
  const theme = useTheme();
  const realm = useRealm();

  const templates = useQuery(WorkoutTemplate);
  const customTemplates = templates.filter(t => t.is_custom === true);
  const standardTemplates = templates.filter(t => !t.is_custom);

  // --- ACTIONS ---
  const handleActivate = (template) => {
    realm.write(() => {
      templates.forEach(t => t.is_active = false);
      template.is_active = true;
    });
  };

  const handleEdit = (template) => {
    navigation.navigate('CreateWorkoutSplitScreen', {
      templateId: template._id.toString()
    });
  };

  const handleDelete = (template) => {
    Alert.alert(
      "Delete Split",
      `Are you sure you want to delete "${template.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            realm.write(() => {
              if (template.dailyWorkouts) {
                realm.delete(template.dailyWorkouts);
              }
              realm.delete(template);
            });
          }
        }
      ]
    );
  };

  const TemplateCard = ({ template, isCustom }) => {
    const isActive = template.is_active;

    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }, isActive && { borderColor: theme.colors.primary, borderWidth: 2 }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                {template.name}
              </Text>
              {template.description ? (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {template.description}
                </Text>
              ) : null}
            </View>
            {isActive && (
              <Chip
                icon="check"
                style={{ backgroundColor: theme.colors.primaryContainer }}
                textStyle={{ fontSize: 12, color: theme.colors.onPrimaryContainer }}
              >
                Active
              </Chip>
            )}
          </View>

          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.cardActions}>
            {!isActive ? (
              <Button mode="contained" onPress={() => handleActivate(template)} style={{ flex: 1, marginRight: 8 }}>
                Activate
              </Button>
            ) : (
               <Button mode="outlined" disabled style={{ flex: 1, marginRight: 8 }}>
                Current Plan
              </Button>
            )}

            {isCustom && (
              <View style={{ flexDirection: 'row' }}>
                <IconButton
                  icon="pencil"
                  mode="contained-tonal"
                  size={20}
                  onPress={() => handleEdit(template)}
                />
                <IconButton
                  icon="delete"
                  mode="contained-tonal"
                  iconColor={theme.colors.error}
                  size={20}
                  onPress={() => handleDelete(template)}
                />
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Header Block - Matches CreateWorkoutSplitScreen exactly */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>Workout Plans</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.onPrimary, opacity: 0.8 }]}>Choose a premade plan or create your own!</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Section 1: Custom Splits */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurfaceVariant }}>
            MY CUSTOM SPLITS
          </Text>
        </View>

        {customTemplates.length === 0 ? (
          <Card style={[styles.emptyCard, { borderColor: theme.colors.outlineVariant, backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                You haven't created any custom splits yet.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          customTemplates.map(t => (
            <TemplateCard key={t._id.toString()} template={t} isCustom={true} />
          ))
        )}

        {/* Section 2: Standard Splits */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurfaceVariant }}>
            STANDARD TEMPLATES
          </Text>
        </View>

        {standardTemplates.map(t => (
          <TemplateCard key={t._id.toString()} template={t} isCustom={false} />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB
        icon="plus"
        label="Create New Split"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('CreateWorkoutSplitScreen')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
    marginBottom: 10
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    marginBottom: 12,
    elevation: 1,
  },
  emptyCard: {
    marginBottom: 12,
    elevation: 0,
    borderWidth: 1,
    borderStyle: 'dashed'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TemplatesScreen;