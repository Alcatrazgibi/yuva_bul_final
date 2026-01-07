import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Details({ route, navigation }: any) {
  const { petId } = route.params;
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPetDetails = async () => {
      try {
        const documentSnapshot = await firestore()
          .collection('hayvanlar')
          .doc(petId)
          .get();

        if (documentSnapshot.exists()) { // Parantez eklendi, syntax hatası giderildi
          setPet({ ...documentSnapshot.data(), id: documentSnapshot.id });
        } else {
          Alert.alert("Hata", "İlan bulunamadı.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Detay getirme hatası: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (petId) getPetDetails();
  }, [petId]);

  const handleAdoptRequest = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert("Uyarı", "İstek göndermek için giriş yapmalısınız.");
      return;
    }

    if (currentUser.uid === pet?.ownerId) {
      Alert.alert("Hata", "Kendi ilanınıza başvuru yapamazsınız.");
      return;
    }

    try {
      await firestore().collection('mesajlar').add({
        ilanId: petId,
        ilanBasligi: pet.name,
        gonderenMail: currentUser.email,
        aliciId: pet.ownerId,
        mesaj: `${pet.name} isimli dostumuzu sahiplenmek istiyorum.`,
        tarih: firestore.FieldValue.serverTimestamp(),
        okundu: false
      });
      Alert.alert("Başarılı", "Sahiplenme isteğiniz ilan sahibine iletildi.");
    } catch (error) {
      Alert.alert("Hata", "İstek gönderilirken bir sorun oluştu.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fed839" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Görsel Alanı */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: pet.imageUrl }} style={styles.image} />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* İçerik Alanı */}
        <View style={styles.contentCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.name}>{pet.name}</Text>
              <Text style={styles.location}>{pet.location}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{pet.type}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.description}>
            {pet.description || "Bu dostumuz için bir açıklama girilmemiş."}
          </Text>

          {/* Alt Bilgiler */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Cins</Text>
              <Text style={styles.infoValue}>{pet.breed || "-"}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Cinsiyet</Text>
              <Text style={styles.infoValue}>{pet.gender || "-"}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.adoptButton} onPress={handleAdoptRequest}>
            <Text style={styles.adoptButtonText}>Sahiplenmek İstiyorum</Text>
          </TouchableOpacity>
          
          {/* Boşluk bırakmak için */}
          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#30554f' },
  imageContainer: { width: '100%', height: 350, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  backButton: { 
    position: 'absolute', top: 20, left: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, 
    borderRadius: 20, justifyContent: 'center', alignItems: 'center' 
  },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  contentCard: { 
    flex: 1, backgroundColor: '#fff', 
    borderTopLeftRadius: 30, borderTopRightRadius: 30, 
    marginTop: -30, padding: 25 
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 30, fontWeight: 'bold', color: '#30554f' },
  location: { fontSize: 16, color: '#777', marginTop: 5 },
  typeBadge: { backgroundColor: '#fed839', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  typeText: { fontWeight: 'bold', color: '#30554f' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#30554f', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', lineHeight: 24 },
  infoRow: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  infoBox: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 15, width: '48%' },
  infoLabel: { fontSize: 12, color: '#aaa', marginBottom: 5 },
  infoValue: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  adoptButton: { 
    backgroundColor: '#30554f', padding: 18, 
    borderRadius: 20, marginTop: 30, alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8
  },
  adoptButtonText: { color: '#fed839', fontSize: 18, fontWeight: 'bold' }
});