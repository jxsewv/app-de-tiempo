import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../firebase';
import { colors } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

function condicion(temp) {
  if (temp >= 30) return 'Caluroso';
  if (temp >= 20) return 'Templado';
  if (temp >= 10) return 'Fresco';
  return 'Frío';
}

export default function HomeScreen({ navigation }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // <-- 1. Estado de error agregado

  useEffect(() => {
    const q = query(ref(db, 'readings'), orderByChild('timestamp'), limitToLast(20));
    const unsubscribe = onValue(q, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setReadings(list);
      }
      setLoading(false);
    }, (err) => {
      // <-- 2. Tercer argumento para capturar el error
      setError(err.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // <-- 3. Validar y mostrar el error en pantalla si ocurre
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.danger, textAlign: 'center' }}>Error al cargar datos: {error}</Text>
      </View>
    );
  }

  if (loading) {
    return <View style={styles.container}><ActivityIndicator color={colors.primary} /></View>;
  }

  if (readings.length === 0) {
    return <View style={styles.container}><Text style={{ color: colors.textMuted }}>Aún no hay lecturas</Text></View>;
  }

  const last = readings[readings.length - 1];
  const temps = readings.map(r => r.temperature);
  const maxTemp = Math.max(...temps).toFixed(0);
  const minTemp = Math.min(...temps).toFixed(0);
  const hoy = new Date(last.timestamp).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const hora = new Date(last.timestamp).toLocaleTimeString('es-MX');

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.location}>{last.location || 'Temperatura de Cuautla'}</Text>
      <Text style={styles.date}>{hoy}</Text>

      <View style={styles.tempRow}>
        <Text style={styles.temp}>{last.temperature.toFixed(1)}</Text>
        <Text style={styles.unit}>°C</Text>
      </View>
      <Text style={styles.condition}>{condicion(last.temperature)}</Text>

      <View style={styles.chipsRow}>
        <View style={styles.chip}>
          <Text style={styles.chipValue}>{last.humidity}%</Text>
          <Text style={styles.chipLabel}>Humedad</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipValue}>{maxTemp}°</Text>
          <Text style={styles.chipLabel}>Máx. reciente</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipValue}>{minTemp}°</Text>
          <Text style={styles.chipLabel}>Mín. reciente</Text>
        </View>
      </View>

      {readings.length > 1 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Últimas horas</Text>
          <LineChart
            data={{ datasets: [{ data: temps }] }}
            width={screenWidth - 72}
            height={160}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={true}
            withVerticalLabels={false}
            chartConfig={{
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              color: () => colors.primary,
              labelColor: () => colors.textMuted,
              decimalPlaces: 1,
              propsForBackgroundLines: { stroke: 'transparent' },
            }}
            bezier
            style={{ borderRadius: 12, marginLeft: -16 }}
          />
        </View>
      )}

      <Button 
        mode="text" 
        onPress={() => navigation.navigate('Historial')} 
        textColor={colors.primary}
        style={{ marginTop: 20 }}
      >
        Ver historial completo
      </Button>

      <Text style={styles.updated}>Actualizado: {hora}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40, paddingBottom: 40, paddingHorizontal: 20 },
  location: { color: colors.text, fontSize: 18, fontWeight: '600' },
  date: { color: colors.textMuted, fontSize: 13, marginTop: 2, marginBottom: 20, textTransform: 'capitalize' },
  tempRow: { flexDirection: 'row', alignItems: 'flex-start' },
  temp: { color: colors.text, fontSize: 72, fontWeight: '200' },
  unit: { color: colors.text, fontSize: 26, fontWeight: '300', marginTop: 10 },
  condition: { color: colors.textMuted, fontSize: 15, marginTop: 4, marginBottom: 24 },
  chipsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  chip: { backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', minWidth: 92 },
  chipValue: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  chipLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  chartCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, width: '100%' },
  chartTitle: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
  updated: { color: colors.textMuted, fontSize: 12, marginTop: 20 },
});