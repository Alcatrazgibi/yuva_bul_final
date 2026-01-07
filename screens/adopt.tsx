import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function Adopt() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  // Form Verileri
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handlePublish = async () => {
    // Temel alanların doluluk kontrolü
    if (!name || !type || !location || !imageUrl) {
      Alert.alert("Eksik Bilgi", "Lütfen isim, tür, konum ve görsel alanlarını doldurun.");
      return;
    }

    setLoading(true);
    const currentUser = auth().currentUser; // Giriş yapmış kullanıcı bilgisi

    try {
      // 'hayvanlar' koleksiyonuna ilanı ekliyoruz
      await firestore().collection('hayvanlar').add({
        name,
        type,
        breed,
        age,
        location,
        gender,
        imageUrl,
        description,
        ownerId: currentUser?.uid,      // İlanı verenin benzersiz ID'si
        ownerEmail: currentUser?.email, // İlanı verenin mail adresi (YENİ EKLENDİ)
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert("Başarılı", "İlanınız başarıyla eklendi!", [
        { text: "Tamam", onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "İlan yayınlanırken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />
      
      <Text style={styles.headerTitle}>Yeni Yuva İlanı</Text>
      <Text style={styles.subTitle}>Dostumuzun bilgilerini girerek ona yeni bir yuva bulabilirsin.</Text>

      <View style={styles.form}>
        <TextInput placeholder="Dostumuzun Adı" placeholderTextColor="#aaa" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Türü (Örn: Kedi)" placeholderTextColor="#aaa" style={styles.input} value={type} onChangeText={setType} />
        <TextInput placeholder="Cinsi (Örn: Tekir)" placeholderTextColor="#aaa" style={styles.input} value={breed} onChangeText={setBreed} />
        
        <View style={styles.row}>
          <TextInput placeholder="Yaş" placeholderTextColor="#aaa" style={[styles.input, { flex: 1, marginRight: 10 }]} value={age} onChangeText={setAge} />
          <TextInput placeholder="Cinsiyet" placeholderTextColor="#aaa" style={[styles.input, { flex: 1 }]} value={gender} onChangeText={setGender} />
        </View>

        <TextInput placeholder="Şehir / İlçe" placeholderTextColor="#aaa" style={styles.input} value={location} onChangeText={setLocation} />
        <TextInput placeholder="Görsel Bağlantısı (URL)" placeholderTextColor="#aaa" style={styles.input} value={imageUrl} onChangeText={setImageUrl} />
        
        <TextInput 
          placeholder="Hakkında eklemek istediklerin..." 
          placeholderTextColor="#aaa" 
          style={[styles.input, styles.textArea]} 
          multiline 
          numberOfLines={4} 
          value={description} 
          onChangeText={setDescription} 
        />

        <TouchableOpacity style={styles.publishButton} onPress={handlePublish} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#30554f" />
          ) : (
            <Text style={styles.publishButtonText}>İlanı Yayınla</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={()=>{navigation.navigate("Home")}} style={{width: 50, height: 50, backgroundColor: "#999", borderRadius: 25, position: 'absolute', left: 10, top: 20, zIndex: 999}}>
        <Text style={{fontSize: 30, textAlign: 'center'}}>←</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#30554f', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subTitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 30, marginTop: 5 },
  form: { width: '100%' },
  input: { backgroundColor: '#fff', borderRadius: 15, padding: 15, fontSize: 16, color: '#333', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  textArea: { height: 100, textAlignVertical: 'top' },
  publishButton: { backgroundColor: '#fed839', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  publishButtonText: { color: '#30554f', fontSize: 18, fontWeight: 'bold' },
});