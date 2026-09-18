import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drawer } from "react-native-drawer-layout";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { MyEvents } from "../api/EventService";

export const HomeScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [events, setEvents] = useState<any[]>([]);
  const navigation = useNavigation<any>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [eventId, setEventId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);

    const weekdayFormatter = new Intl.DateTimeFormat("sr-Latn-RS", {
      weekday: "short",
    });
    const weekdayRaw = weekdayFormatter.format(date); // "
    const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);

    const dayFormatter = new Intl.DateTimeFormat("sr-Latn-RS", {
      day: "numeric",
    });
    const day = dayFormatter.format(date) + ".";

    const monthFormatter = new Intl.DateTimeFormat("sr-Latn-RS", {
      month: "short",
    });
    const monthRaw = monthFormatter.format(date);
    const month =
      monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1).replace(".", "");

    const timeFormatter = new Intl.DateTimeFormat("sr-Latn-RS", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const time = timeFormatter.format(date);

    const timeFormat = `${weekday} - ${day} ${month} - ${time}`;
    return timeFormat;
  };
  const handleModals = async (eventId: string, showModal: any) => {
    setEventId(eventId);
    setModalVisible(showModal);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const result = await MyEvents();
        setEvents(result);
        setLoadingEvents(false);
      } catch (error) {
        console.error(error);
      }
    };

    loadEvents();
  }, []);

  if (loadingEvents)
    return (
      <SafeAreaView style={styles.loadEventsContainer}>
        <ActivityIndicator size="large" color="#E98400" />
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="#E98400" />
        ) : (
          <View />
        )}
      </SafeAreaView>
    );

  if (events.length == 0)
    return (
      <SafeAreaView style={styles.loadEventsContainer}>
        <Text style={styles.text}>Nemas pristup ni jednom eventu.</Text>
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="#E98400" />
        ) : (
          <Text
            style={styles.drawerText}
            onPress={handleSignOut}
            disabled={isLoggingOut}
          >
            Odjavi se
          </Text>
        )}
      </SafeAreaView>
    );

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => (
        <SafeAreaView style={styles.drawerInner}>
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#E98400" />
          ) : (
            <Text
              disabled={isLoggingOut}
              onPress={handleSignOut}
              style={styles.drawerText}
            >
              Odjavi se
            </Text>
          )}
        </SafeAreaView>
      )}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setOpen((prevOpen) => !prevOpen)}
          activeOpacity={0.7}
        >
          <Svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <Path
              d="M18 6.75C18 6.94891 17.921 7.13968 17.7803 7.28033C17.6397 7.42098 17.4489 7.5 17.25 7.5H0.75C0.551088 7.5 0.360322 7.42098 0.21967 7.28033C0.0790178 7.13968 0 6.94891 0 6.75C0 6.55109 0.0790178 6.36032 0.21967 6.21967C0.360322 6.07902 0.551088 6 0.75 6H17.25C17.4489 6 17.6397 6.07902 17.7803 6.21967C17.921 6.36032 18 6.55109 18 6.75ZM0.75 1.5H17.25C17.4489 1.5 17.6397 1.42098 17.7803 1.28033C17.921 1.13968 18 0.948912 18 0.75C18 0.551088 17.921 0.360322 17.7803 0.21967C17.6397 0.0790178 17.4489 0 17.25 0H0.75C0.551088 0 0.360322 0.0790178 0.21967 0.21967C0.0790178 0.360322 0 0.551088 0 0.75C0 0.948912 0.0790178 1.13968 0.21967 1.28033C0.360322 1.42098 0.551088 1.5 0.75 1.5ZM17.25 12H0.75C0.551088 12 0.360322 12.079 0.21967 12.2197C0.0790178 12.3603 0 12.5511 0 12.75C0 12.9489 0.0790178 13.1397 0.21967 13.2803C0.360322 13.421 0.551088 13.5 0.75 13.5H17.25C17.4489 13.5 17.6397 13.421 17.7803 13.2803C17.921 13.1397 18 12.9489 18 12.75C18 12.5511 17.921 12.3603 17.7803 12.2197C17.6397 12.079 17.4489 12 17.25 12Z"
              fill="white"
            />
          </Svg>

          <Svg width={34} height={27} viewBox="0 0 34 27" fill="none">
            <Path
              d="M31.9658 10.5654L34 13.5L31.9658 16.4346L31.9658 10.5654ZM29.0596 6.45605L30.5127 8.51074L30.5127 18.4893L29.0596 20.5439L29.0596 6.45605ZM26.1543 2.34766L27.6064 4.40234L27.6064 22.5977L26.1543 24.6523L26.1543 2.34766ZM9.29883 -4.10493e-07L19.1797 -8.4668e-07L11.624 9.97852L24.4102 -1.07758e-06L24.4102 27L11.624 17.0215L19.1797 27L9.29883 27L-5.84313e-07 13.5L9.29883 -4.10493e-07Z"
              fill="white"
            />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.header}>Moji dogadjaji</Text>
        <ScrollView style={styles.eventsScrollContainer}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventImages}>
              <View style={styles.eventItem}>
                <Text style={styles.activeEvent}>Aktivan dogadjaj</Text>
                <View style={styles.horizontalLine}></View>
                <Text style={styles.eventTitle}>{event.eventName}</Text>
                <Text
                  style={styles.eventText}
                >{`${formatTime(event.startTime)}`}</Text>
                <Text style={styles.eventText}>{event.locationName}</Text>
                <TouchableOpacity
                  style={[styles.button, styles.scanButton]}
                  onPress={() => handleModals(event.id, true)}
                >
                  <Text style={styles.text}>Skeniraj</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri: `${BASE_URL}/events/${event.id}/image`,
                }}
                style={{
                  width: 77,
                  height: 60,
                  borderRadius: 20,
                  alignSelf: "center",
                  right: 10,
                  top: 65,
                  margin: 10,
                  position: "absolute",
                }}
              />
            </View>
          ))}
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Otvori kameru za skeniranje QR koda
              </Text>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Otkaži</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("Scan", {
                      Id: eventId,
                    });
                  }}
                >
                  <Text style={styles.textStyle}>Otvori</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010101",
    paddingHorizontal: 15,
  },
  loadEventsContainer: {
    flex: 1,
    gap: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#010101",
    paddingHorizontal: 15,
  },
  icon: {
    alignItems: "center",
    flexDirection: "row",
    gap: "80%",
    padding: 10,
  },
  header: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  eventsScrollContainer: {
    paddingTop: 20,
    marginBottom: 20,
  },
  eventItem: {
    flex: 1,
    gap: 5,
    padding: 15,
    margin: 10,
    minWidth: 0,
  },
  eventImages: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#535353",
    marginBottom: 20,
    overflow: "hidden",
  },
  button: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    height: 50,
  },
  horizontalLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#696969",
    marginVertical: 10,
  },
  scanButton: {
    marginTop: 40,
    backgroundColor: "#E98400",
    borderColor: "#696969",
    borderWidth: 1,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  activeEvent: {
    textAlign: "center",
    fontSize: 14,
    color: "#696969",
  },
  eventText: {
    fontSize: 12,
    color: "#696969",
  },
  drawerText: {
    fontSize: 12,
    color: "#696969",
  },
  drawerInner: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#131111",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 248, 248, 0.6)",
    justifyContent: "flex-end",
  },
  modalView: {
    width: "100%",
    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingTop: 25,
    paddingBottom: 40,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    width: "100%",
  },
  buttonCancel: {
    width: 100,
    backgroundColor: "#555",
    borderColor: "#696969",
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonOpen: {
    width: 100,
    backgroundColor: "#E98400",
    borderColor: "#696969",
    borderWidth: 1,
    borderRadius: 20,
  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
