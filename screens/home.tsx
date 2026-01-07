import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

interface PetAd {
  id: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  location: string;
  age: string;
  imageUrl: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allPets, setAllPets] = useState<PetAd[]>([]);
  const [filteredData, setFilteredData] = useState<PetAd[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();

  useEffect(() => {
    // KOLEKSİYON İSMİ 'hayvanlar' OLARAK GÜNCELLENDİ
    const subscriber = firestore()
      .collection('hayvanlar')
      .onSnapshot(querySnapshot => {
        const pets: PetAd[] = [];

        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          pets.push({
            id: documentSnapshot.id,
            name: data.name || '',
            type: data.type || '',
            breed: data.breed || '',
            gender: data.gender || '',
            location: data.location || '',
            age: data.age || '',
            imageUrl: data.imageUrl || '',
          });
        });

        setAllPets(pets);
        setFilteredData(pets);
        setLoading(false);
      }, error => {
        console.error("Firestore Hatası: ", error);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = allPets.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.type.toLowerCase().includes(text.toLowerCase()) ||
      item.breed.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderItem = ({ item }: { item: PetAd }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      // Stack Navigator'da 'Details' sayfası tanımlı olmalıdır
      onPress={() => navigation.navigate('Details', { petId: item.id })}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: '#aaa', fontSize: 10 }}>Görsel Yok</Text>
          </View>
        )}
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
        </View>

        <Text style={styles.itemBreed}>{item.breed} • {item.gender}</Text>
        <Text style={styles.itemDetail}>{item.location} • {item.age} Yaşında</Text>

        <View style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>İncele</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => { navigation.navigate("Login") }}>
          <Text style={styles.welcomeText}>Merhaba,</Text>
        </TouchableOpacity>

        <Text style={styles.subWelcomeText}>Yeni dostunu keşfet!</Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="İlanlarda ara..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <TouchableOpacity onPress={()=>{navigation.navigate("Adopt")}} style={{ width: 60, height: 60, display: "flex", alignItems: 'center', justifyContent: "center", backgroundColor: "#fed839", borderRadius: 30, position: "absolute", right: 10, bottom: 10, zIndex: 999}}>
        <Text style={{ color: "#333", fontSize: 30 }}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{navigation.navigate("Inbox")}} style={{ width: 60, height: 60, display: "flex", alignItems: 'center', justifyContent: "center", backgroundColor: "#fed839", borderRadius: 30, position: "absolute", right: 10, bottom: 80, zIndex: 999}}>
        <Text style={{ color: "#333", fontSize: 30 }}>M</Text>
      </TouchableOpacity>


      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#fed839" size="large" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Veriler Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>Henüz ilan bulunmuyor.</Text>}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#30554f' },
  headerSection: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 10 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subWelcomeText: { fontSize: 16, color: '#ccc', marginTop: 5 },
  searchSection: { paddingHorizontal: 20, marginVertical: 15 },
  searchInput: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16 },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 25, flexDirection: 'row', marginBottom: 20, padding: 12, alignItems: 'center' },
  imageContainer: { width: 90, height: 90, borderRadius: 20, overflow: 'hidden' },
  petImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: { width: 90, height: 90, backgroundColor: '#f0f0f0', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemBreed: { color: '#555', fontSize: 14, fontWeight: '600', marginTop: 2 },
  typeBadge: { backgroundColor: '#fed839', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  typeBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#30554f' },
  itemDetail: { color: '#777', fontSize: 13, marginTop: 2 },
  adoptButton: { marginTop: 8 },
  adoptButtonText: { color: '#30554f', fontWeight: '700', textDecorationLine: 'underline' },
  emptyText: { color: '#fff', textAlign: 'center', marginTop: 50 }
});