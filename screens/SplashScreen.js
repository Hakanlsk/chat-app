import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useLayoutEffect } from "react";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { SET_USER } from "../context/actions/userActions";
import { useDispatch } from "react-redux";

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    checkLoggedUser();
  }, []);

  const checkLoggedUser = async () => {
    //onAuthStateChanged - kullanıcının oturum durumu değiştiğinde giriş-çıkşta çalıştırılır
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(firestoreDB, "users", userCred?.uid))
          .then((docSnap) => {
            //"exists" ile belgenin var olup olmadığı kontrol edilir
            if (docSnap.exists()) {
              //"data" ile belgenin verileri alınır
              console.log("User Data :", docSnap.data());
              dispatch(SET_USER(docSnap.data()));
            }
          })
          .then(() => {
            setTimeout(() => {
              navigation.replace("HomeScreen");
            }, 2000);
          });
      } else {
        navigation.replace("LoginScreen");
      }
    });
  };

  return (
    <View className="flex-1 items-center justify-center space-y-24">
      <Image
        source={{
          uri: "https://cdn3d.iconscout.com/3d/premium/thumb/leaves-4398589-3659294.png?f=webp",
        }}
        className="w-32 h-32"
        resizeMode="cover"
      />
      <ActivityIndicator size={"large"} color={"#43C651"} />
    </View>
  );
};

export default SplashScreen;
