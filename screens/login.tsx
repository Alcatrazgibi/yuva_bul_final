import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

function Login() {
  const navigation = useNavigation<any>();
  
  // Inputlar için state tanımlamaları
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Giriş yapma fonksiyonu
  const handleLogin = async () => {
    // Boş alan kontrolü
    if (!email || !password) {
      Alert.alert("Uyarı", "Lütfen e-posta ve şifre alanlarını doldurun.");
      return;
    }

    setLoading(true); // Yükleniyor simgesini başlat

    try {
      // Firebase ile giriş işlemi
      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
      
      console.log('Giriş Başarılı:', userCredential.user.email);
      // Başarılı girişte Alert gösterip Home'a yönlendir (App.tsx'te otomatik yönlendirme yoksa)
      Alert.alert("Başarılı", "Giriş yapıldı!", [
        { text: "Tamam", onPress: () => navigation.navigate('Home') }
      ]);

    } catch (error: any) {
      console.log('Firebase Hata Kodu:', error.code);
      
      // Hata mesajlarını Türkçeleştirme
      let errorMessage = "Bir hata oluştu.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "E-posta veya şifre hatalı.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Geçersiz e-posta formatı.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Çok fazla hatalı deneme. Lütfen biraz bekleyin.";
      }

      Alert.alert("Giriş Başarısız", errorMessage);
    } finally {
      setLoading(false); // İşlem bitince yükleniyor simgesini kapat
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Resim yolu: screens klasöründe olduğun için bir üst klasöre çıkıp images'a girer */}
        <Image 
          style={styles.mainImage} 
          source={require("../images/login_page_image.png")} 
        />
        
        <TextInput 
          placeholder='E-posta..' 
          placeholderTextColor={"#fff"} 
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput 
          secureTextEntry={true} 
          placeholder='Şifre..' 
          placeholderTextColor={"#fff"} 
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Hesabınız yoksa </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>kayıt ol</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>abilirsiniz.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#30554f",
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: 'center',
    paddingBottom: 30,
  },
  mainImage: {
    width: 300,
    height: 210,
    marginBottom: 50,
    resizeMode: 'contain'
  },
  input: {
    width: "80%",
    borderWidth: 2,
    borderColor: "#fff",
    fontSize: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 12,
    color: "#fff",
  },
  button: {
    backgroundColor: "#fed839",
    padding: 15,
    width: "80%",
    borderRadius: 15,
    marginTop: 10
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center',
    color: "#000"
  },
  footerContainer: {
    width: "80%", 
    flexDirection: "row", 
    marginTop: 20,
    justifyContent: 'center'
  },
  footerText: {
    color: "#bbb",
    fontSize: 14
  },
  linkText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});

export default Login;