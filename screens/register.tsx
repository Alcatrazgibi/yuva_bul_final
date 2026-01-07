import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function Register({ navigation }: Props) {
    // State tanımlamaları
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Firebase için gerekli
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // Form Kontrolleri
        if (!email || !password) {
            Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Hata", "Şifreler birbiriyle eşleşmiyor.");
            return;
        }

        setLoading(true);

        try {
            // 1. Firebase Auth ile kullanıcı oluşturma
            const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
            const uid = userCredential.user.uid;

            // 2. Firestore 'kullanicilar' koleksiyonuna ek bilgileri yazma
            await firestore()
                .collection('kullanicilar')
                .doc(uid)
                .set({
                    kullanici_mail: email.toLowerCase().trim(),
                    kayit_tarihi: firestore.FieldValue.serverTimestamp(),
                    id: uid
                });

            Alert.alert("Başarılı", "Hesabınız oluşturuldu!", [
                { text: "Tamam", onPress: () => navigation.navigate("Login") }
            ]);

        } catch (error: any) {
            let errorMessage = "Kayıt başarısız.";
            if (error.code === 'auth/email-already-in-use') errorMessage = "Bu e-posta zaten kullanımda.";
            if (error.code === 'auth/invalid-email') errorMessage = "Geçersiz e-posta adresi.";
            if (error.code === 'auth/weak-password') errorMessage = "Şifre çok zayıf (en az 6 karakter).";
            
            Alert.alert("Hata", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image style={styles.mainImage} source={require("../images/login_page_image.png")} />

                {/* E-posta (Firebase için eklendi) */}
                <TextInput 
                    placeholder='E-posta..' 
                    placeholderTextColor={"#fff"} 
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Şifre */}
                <TextInput 
                    secureTextEntry={true} 
                    placeholder='Şifre..' 
                    placeholderTextColor={"#fff"} 
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Şifre Tekrar */}
                <TextInput 
                    secureTextEntry={true} 
                    placeholder='Şifre(Yeniden)..' 
                    placeholderTextColor={"#fff"} 
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#30554f" />
                    ) : (
                        <Text style={styles.buttonText}>Kayıt Ol</Text>
                    )}
                </TouchableOpacity>

                <View style={{ width: "75%", display: "flex", flexDirection: "row", marginTop: 10 }}>
                    <Text style={{ marginLeft: 7, color: "#bbb" }}>Hesabınız varsa </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate("Login") }}>
                        <Text style={{ color: "#fff" }}>giriş yap</Text>
                    </TouchableOpacity>
                    <Text style={{ color: "#bbb" }}>abilirsiniz.</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#30554f",
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainImage: {
        width: 300,
        height: 210,
        marginBottom: 30 // Daha fazla input geldiği için biraz daraltıldı
    },
    content: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: 'center',
    },
    input: {
        width: "75%",
        borderWidth: 2,
        borderColor: "#fff",
        fontSize: 20, // Daha fazla alan olduğu için font boyutu 25'ten 20'ye çekildi
        marginBottom: 10,
        borderRadius: 20,
        padding: 12,
        color: "#fff",
        fontWeight: "400"
    },
    button: {
        backgroundColor: "#fed839",
        padding: 15,
        width: "75%",
        borderRadius: 20,
        marginTop: 10
    },
    buttonText: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: 'center',
    }
});