import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  //firestore database' teki chats verileri bu statete tutuluyor
  const [chats, setChats] = useState(null);

  const navigation = useNavigation();

  //anasayfada chats collectionuna ait belgeleri göstermek (yani oluşturulan chat grupları)
  useLayoutEffect(() => {
    //firestore da query kullanımı belirli şartları sağlayan belgeleri almak için kullanılır, filtreleme
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );
    //onSnapshot - Firestore'da bulunan bir belge veya sorgu sonuç kümesi üzerinde değişiklikler algılandığında tetiklenir.
    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  console.log(chats);

  return (
    <View className="flex-1">
      <SafeAreaView className="mt-6">
        {/* top section */}
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <Image
            source={{
              uri: "https://cdn3d.iconscout.com/3d/premium/thumb/leaves-4398589-3659294.png?f=webp",
            }}
            className="h-16 w-16"
            resizeMode="contain"
          />
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileScreen")}
              className="mt-4 w-12 h-12 rounded-full border border-primary flex items-center justify-center"
            >
              <Image
                source={{ uri: user?.profilePic }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Text className="text-primaryText">{user?.fullName}</Text>
          </View>
        </View>

        {/* message titles */}
        <View className="w-full flex-row items-center justify-between px-4 pt-2">
          <Text className="text-primaryText text-base font-extrabold pb-2">
            Messages
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddToChatScreen")}
          >
            <Ionicons name="chatbox" size={28} color="#555" />
          </TouchableOpacity>
        </View>

        {/* scrolling are */}
        <ScrollView className="w-full px-4 pt-2">
          <View className="w-full">
            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#43C651"} />
                </View>
              </>
            ) : (
              <>
                {chats && chats?.length > 0 ? (
                  <>
                    {chats?.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MessageCard = ({ room }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      //chat verisinin bilgilerini de navigate ile iç sayfaya push ediyoruz
      onPress={() => navigation.navigate("ChatScreen", { room: room })}
      className="w-full flex-row items-center justify-start py-2"
    >
      {/* image */}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary p-1 justify-center">
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* content */}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          {room.chatName}
        </Text>
        <Text className=" text-primaryText text-sm text-nowrap">
          Lorem Ipsum is simply dummy text of the
        </Text>
      </View>
      {/* time text */}
      <Text className="text-primary px-4 text-base font-semibold  ">27min</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
