import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const ChatScreen = ({ route }) => {
  const { room } = route.params;

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const user = useSelector((state) => state.user.user);

  const textInputRef = useRef(null);

  const handleEmojiKeyboardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const sendMessage = async () => {
    if (!message) {
      // Eğer message alanı boş ise işlemi gerçekleştirme
      return;
    }

    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };
    console.log(_doc);
    // setMessage("");
    try {
      await addDoc(
        collection(doc(firestoreDB, "chats", room._id), "messages"),
        _doc
      );
    } catch (err) {
      alert(err);
    }
    setMessage("");
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

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
    <View className="flex-1">
      <View
        className={
          isKeyboardOpen
            ? `w-full bg-primary px-4 py-10 flex-[0.45]`
            : `w-full bg-primary px-4 py-10 flex-[0.2]`
        }
      >
        <View className="flex-row items-center justify-between w-full py-12">
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          {/* middle */}

          <View className="flex-row items-center justify-center space-x-3">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize">
                {room.chatName.length > 12
                  ? `${room.chatName.slice(0, 12)}..`
                  : room.chatName}
              </Text>
              <Text className="text-gray-100 text-sm font-semibold capitalize">
                online
              </Text>
            </View>
          </View>
          {/* last section */}
          <View className="flex-row items-center justify-center space-x-3">
            <TouchableOpacity>
              <FontAwesome5 name="video" size={21} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="phone" size={21} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={21} color="#fbfbfb" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* bottom section  */}
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView>
              {isLoading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#43C651"} />
                  </View>
                </>
              ) : (
                <>
                  {/* mesaja ait email o an giriş yapmış kullanıcın emaili ile aynıysa mesaj sağ tarafta yeşil renkli gözükecek */}
                  {messages?.map((msg, i) =>
                    msg.user.providerData.email === user.providerData.email ? (
                      <View
                        style={{ alignSelf: "flex-end" }}
                        className="m-1"
                        key={i}
                      >
                        <View className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-primary w-auto relative">
                          <Text className="text-base font-semibold text-white">
                            {msg.message}
                          </Text>
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                          {msg?.timeStamp?.seconds && (
                            <Text className="text-[12px] text-black font-semibold">
                              {new Date(
                                parseInt(msg?.timeStamp.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      <>
                        <View
                          key={i}
                          style={{ alignSelf: "flex-start" }}
                          className="flex items-center justify-start space-x-2"
                        >
                          <View className="flex-row items-center justify-center space-x-2">
                            {/* image */}
                            <Image
                              className="w-12 h-12 rounded-full"
                              resizeMode="cover"
                              source={{ uri: msg?.user?.profilePic }}
                            />
                            {/* text */}
                            <View className="m-1">
                              <View className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-gray-200 w-auto relative">
                                <Text className="text-base font-semibold text-black">
                                  {msg.message}
                                </Text>
                              </View>
                              <View style={{ alignSelf: "flex-start" }}>
                                {msg?.timeStamp?.seconds && (
                                  <Text className="text-[12px] text-black font-semibold">
                                    {new Date(
                                      parseInt(msg?.timeStamp.seconds) * 1000
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    })}
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </>
                    )
                  )}
                </>
              )}
            </ScrollView>

            {/* message input container  */}
            <View className="w-full flex-row items-center justify-center px-8 space-x-3">
              <View className="bg-gray-200 rounded-2xl px-4 py-2 space-x-4 flex-row items-center justify-center">
                {/* emojis */}
                <TouchableOpacity onPress={handleEmojiKeyboardOpen}>
                  <Entypo name="emoji-happy" size={24} color="#555" />
                </TouchableOpacity>
                {/* input */}
                <TextInput
                  className=" flex-1 text-base text-primaryText font-semibold"
                  placeholder="Type here..."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
                {/* mic icon */}
                <TouchableOpacity>
                  <Entypo name="mic" size={24} color="#43C651" />
                </TouchableOpacity>
              </View>
              {/* send */}
              <TouchableOpacity>
                <FontAwesome
                  name="send"
                  size={24}
                  color="#555"
                  onPress={sendMessage}
                />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
