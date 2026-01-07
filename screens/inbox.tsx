import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function Inbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth().currentUser;

  useEffect(() => {
    if (!user) return;

    // Syntax ve Tip hataları düzeltildi
    const unsubscribe = firestore()
      .collection('mesajlar')
      .where('aliciId', '==', user.uid)
      .orderBy('tarih', 'desc')
      .onSnapshot(querySnapshot => {
        const list: any[] = []; // TypeScript tip hatası düzeltildi
        
        if (querySnapshot) {
          querySnapshot.forEach(doc => {
            list.push({ ...doc.data(), id: doc.id });
          });
        }
        
        setMessages(list);
        setLoading(false);
      }, error => {
        console.error("Mesaj çekme hatası: ", error);
        setLoading(false);
        // Önemli: Eğer burada hata alıyorsan konsoldaki Index linkine tıklamalısın.
      });

    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.ilanBaslik}>{item.ilanBasligi} Hakkında</Text>
      <Text style={styles.gonderen}>Gönderen: {item.gonderenMail}</Text>
      <Text style={styles.mesaj}>{item.mesaj}</Text>
      <Text style={styles.tarih}>{item.tarih?.toDate().toLocaleString('tr-TR')}</Text>
    </View>
  );

  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={()=>{navigation.navigate("Home")}} style={{width: 50, height: 50, borderRadius: 25, backgroundColor: "#999", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center'}}>✕</Text>
        </TouchableOpacity>
      <Text style={styles.header}>Gelen Kutusu</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fed839" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Henüz bir mesajınız yok.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#30554f', padding: 20 },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 3 },
  ilanBaslik: { fontWeight: 'bold', color: '#30554f', fontSize: 16 },
  gonderen: { color: '#666', fontSize: 13, marginVertical: 4 },
  mesaj: { color: '#333', fontSize: 14, marginTop: 5 },
  tarih: { color: '#aaa', fontSize: 11, textAlign: 'right', marginTop: 10 },
  empty: { color: '#ccc', textAlign: 'center', marginTop: 50, fontSize: 16 }
});