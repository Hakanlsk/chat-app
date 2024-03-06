import {
  View,
  Text,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import UserTextInput from "../components/UserTextInput";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { SET_USER } from "../context/actions/userActions";

const LoginScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const navigation = useNavigation();

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (getEmailValidationStatus && email !== "") {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log("User Id: ", userCred?.user.uid);
            navigation.replace("SplashScreen");
            getDoc(doc(firestoreDB, "users", userCred?.user.uid)).then(
              (docSnap) => {
                //"exists" ile belgenin var olup olmadığı kontrol edilir
                if (docSnap.exists()) {
                  //"data" ile belgenin verileri alınır
                  console.log("User Data :", docSnap.data());
                  dispatch(SET_USER(docSnap.data()));
                }
              }
            );
          }
        })
        .catch((err) => {
          console.log("Error : ", err.message);
          if (err.message.includes("invalid-credential")) {
            setAlert(true);
            setAlertMessage("Password Mismatch");
          } else if (err.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMessage("User Not Found");
          } else {
            setAlert(true);
            setAlertMessage("Invalid Email Address");
          }
          setInterval(() => {
            setAlert(false);
          }, 4000);
        });
    }
  };

  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={{
          uri: "https://img.freepik.com/premium-photo/background-3d-leaves-generative-ai_170984-4522.jpg",
        }}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />

      {/* main view */}
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-56 items-center justify-start py-6 px-6 space-y-6">
        <Image
          source={{
            uri: "https://cdn3d.iconscout.com/3d/premium/thumb/leaves-4398589-3659294.png?f=webp",
          }}
          className="h-16 w-24"
          resizeMode="contain"
        />
        <Text className="  text-primaryText text-xl font-semibold">
          Welcome Back!
        </Text>

        <View className="w-full flex items-center justify-center">
          {/* alert */}
          {alert && <Text className="text-red-600">{alertMessage}</Text>}
          {/* email */}
          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStateValue={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />

          {/* password */}
          <UserTextInput
            placeholder="Password"
            isPass={true}
            setStateValue={setPassword}
          />

          {/* login */}
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full px-4 py-2 rounded-xl bg-primary my-3 flex items-center justify-center"
          >
            <Text className="text-white text-xl py-2 font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>

          <View className="w-full flex-row items-center py-8 justify-center space-x-2">
            <Text className="text-base text-primaryText">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text className="text-base font-semibold text-primaryBold">
                Create Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
