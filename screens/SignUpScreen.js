import {
  View,
  Text,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import UserTextInput from "../components/UserTextInput";
import { useNavigation } from "@react-navigation/native";
import { avatars } from "../utils/support";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(avatars[0].image.asset.url);
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const navigation = useNavigation();

  const handleAvatar = (item) => {
    setAvatar(item?.image.asset.url);
    setIsAvatarMenu(false);
  };

  const handleSignUp = async () => {
    if (getEmailValidationStatus && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: name,
            profilePic: avatar,
            providerData: userCred.user.providerData[0], //kimlik bilgilerinin dizisi
          };

          setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
            () => {
              navigation.navigate("HomeScreen");
            }
          );
        }
      );
    }
  };

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={{
          uri: "https://img.freepik.com/premium-photo/background-3d-leaves-generative-ai_170984-4522.jpg",
        }}
        resizeMode="cover"
        className={isKeyboardOpen ? `h-52` : `h-80`}
        style={{ width: screenWidth }}
      />

      {isAvatarMenu && (
        <>
          {/* list of avatars */}
          <View
            className="absolute inset-0 z-10"
            style={{ width: screenWidth, height: screenHeight }}
          >
            <ScrollView>
              <BlurView
                className="w-full h-full px-4 py-16 flex-row flex-wrap items-center justify-evenly"
                tint="light"
                intensity={100}
                style={{ width: screenWidth, height: screenHeight }}
              >
                {avatars.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleAvatar(item)}
                    key={item._id}
                    className="w-20 m-3 h-20 rounded-full border-2 border-primary relative"
                  >
                    <Image
                      source={{ uri: item?.image.asset.url }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </ScrollView>
          </View>
        </>
      )}

      {/* main view */}
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-48 items-center justify-start py-6 px-6 space-y-6">
        <Image
          source={{
            uri: "https://cdn3d.iconscout.com/3d/premium/thumb/leaves-4398589-3659294.png?f=webp",
          }}
          className="h-16 w-24"
          resizeMode="contain"
        />
        <Text className=" text-primaryText text-xl font-semibold">
          Join With Us!
        </Text>

        {/* avatar section */}
        <View className="w-full flex items-center justify-center relative -my-4">
          <TouchableOpacity
            onPress={() => setIsAvatarMenu(true)}
            className="w-20 h-20 p-1 rounded-full border-2 border-primary relative -mt-2"
          >
            <Image
              className="w-full h-full"
              resizeMode="contain"
              source={{ uri: avatar }}
            />
            <View className="w-6 h-6 bg-primary rounded-full absolute top-0 right-0 flex items-center justify-center">
              <MaterialIcons name="edit" size={18} color={"#fff"} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="w-full flex items-center justify-center">
          {/* alert */}

          {/* full name */}
          <UserTextInput
            placeholder="Full Name"
            isPass={false}
            setStateValue={setName}
          />

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
            onPress={handleSignUp}
            className="w-full px-4 py-2 rounded-xl bg-primary my-3 flex items-center justify-center"
          >
            <Text className="text-white text-xl py-2 font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>

          <View className="w-full flex-row items-center py-8 justify-center space-x-2">
            <Text className="text-base text-primaryText">
              Have an account !
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text className="text-base font-semibold text-primaryBold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
