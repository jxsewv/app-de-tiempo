import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { db } from '../firebase';
import { colors } from '../theme/colors';

export default function HistoryScreen() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const q = query(ref(db, 'readings'), orderByChild('timestamp'), limitToLast(100));
    const unsubscribe = onValue(q, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data).sort((a, b) => b.timestamp - a.timestamp); // más reciente primero
        setReadings(list);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <FlatList
      style={styles.container}
      data={readings}
      keyExtractor={(item, i) => `${item.timestamp}-${i}`}
      ListEmptyComponent={<Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 20 }}>Sin lecturas aún</Text>}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Content style={styles.row}>
            <View>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>{item.temperature}°C</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>Humedad: {item.humidity}%</Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              {item.timestamp ? new Date(item.timestamp).toLocaleString('es-MX') : 'Sin fecha'}
            </Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  card: { backgroundColor: colors.surface, marginBottom: 8, borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});