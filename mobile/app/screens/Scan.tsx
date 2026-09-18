import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../context/AuthContext";
import { useTicket } from "../api/TicketService";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Rect, G, ClipPath, Defs } from "react-native-svg";

type RootStackParamList = {
  Scan: {
    Id: string;
  };
};

type ScanRouteProp = RouteProp<RootStackParamList, "Scan">;

export const ScanScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ScanRouteProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const { Id } = route.params;
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { signOut } = useAuth();
  const [text, setText] = useState("Kamera je deaktivirana.");
  const [textColor, setTextColor] = useState("none");
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Greska za odjavu:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={!permission.granted}
          onRequestClose={() => {
            navigation.goBack();
            setModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Svg
                width="61"
                height="61"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Rect width="61" height="61" rx="12" fill="#555555" />
                <Path
                  d="M44.8462 19.1739H40.0485L37.6894 15.6191C37.563 15.4288 37.3919 15.2727 37.1911 15.1647C36.9904 15.0567 36.7662 15.0001 36.5385 15H25.4615C25.2338 15.0001 25.0096 15.0567 24.8089 15.1647C24.6081 15.2727 24.437 15.4288 24.3106 15.6191L21.9498 19.1739H17.1538C16.0522 19.1739 14.9956 19.6137 14.2166 20.3964C13.4376 21.1792 13 22.2408 13 23.3478V42.8261C13 43.9331 13.4376 44.9947 14.2166 45.7775C14.9956 46.5603 16.0522 47 17.1538 47H44.8462C45.9478 47 47.0044 46.5603 47.7834 45.7775C48.5624 44.9947 49 43.9331 49 42.8261V23.3478C49 22.2408 48.5624 21.1792 47.7834 20.3964C47.0044 19.6137 45.9478 19.1739 44.8462 19.1739ZM46.2308 42.8261C46.2308 43.1951 46.0849 43.549 45.8252 43.8099C45.5656 44.0708 45.2134 44.2174 44.8462 44.2174H17.1538C16.7866 44.2174 16.4344 44.0708 16.1748 43.8099C15.9151 43.549 15.7692 43.1951 15.7692 42.8261V23.3478C15.7692 22.9788 15.9151 22.6249 16.1748 22.364C16.4344 22.1031 16.7866 21.9565 17.1538 21.9565H22.6923C22.9203 21.9567 23.1448 21.9002 23.3459 21.7922C23.547 21.6842 23.7185 21.528 23.845 21.3374L26.2023 17.7826H35.796L38.155 21.3374C38.2816 21.528 38.453 21.6842 38.6541 21.7922C38.8552 21.9002 39.0797 21.9567 39.3077 21.9565H44.8462C45.2134 21.9565 45.5656 22.1031 45.8252 22.364C46.0849 22.6249 46.2308 22.9788 46.2308 23.3478V42.8261ZM31 24.7391C29.4938 24.7391 28.0215 25.1879 26.7691 26.0288C25.5168 26.8696 24.5407 28.0647 23.9643 29.4629C23.3879 30.8612 23.2371 32.3998 23.5309 33.8842C23.8248 35.3685 24.5501 36.732 25.6151 37.8022C26.6801 38.8724 28.0371 39.6012 29.5143 39.8964C30.9916 40.1917 32.5228 40.0402 33.9143 39.461C35.3058 38.8818 36.4952 37.901 37.332 36.6426C38.1688 35.3842 38.6154 33.9048 38.6154 32.3913C38.6131 30.3625 37.81 28.4175 36.3824 26.9829C34.9547 25.5484 33.019 24.7414 31 24.7391ZM31 37.2609C30.0415 37.2609 29.1046 36.9753 28.3076 36.4402C27.5107 35.9051 26.8895 35.1446 26.5227 34.2548C26.1559 33.365 26.06 32.3859 26.247 31.4413C26.434 30.4967 26.8955 29.629 27.5733 28.948C28.251 28.267 29.1145 27.8032 30.0546 27.6153C30.9946 27.4274 31.969 27.5238 32.8545 27.8924C33.7401 28.261 34.4969 28.8851 35.0294 29.6859C35.5619 30.4867 35.8462 31.4282 35.8462 32.3913C35.8462 33.6828 35.3356 34.9214 34.4268 35.8346C33.5179 36.7478 32.2853 37.2609 31 37.2609Z"
                  fill="#E98400"
                />
              </Svg>
              <Text style={styles.modalText}>{text}</Text>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={requestPermission}
                >
                  <Text style={styles.textStyle}>Dozvoli</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setText("");
    const result = await useTicket(data, Id);
    setTextColor(result?.color ?? "none");
    setText(result?.msg ?? "");
    setModalVisible(true);
  };

  if (scanned && text.length == 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E98400" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!scanned ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
      ) : (
        <View />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          navigation.goBack();
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {textColor === "green" ? (
              <Svg
                width="61"
                height="61"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Rect width="61" height="61" rx="12" fill="#555555" />
                <Path
                  d="M38.0246 25.4369C38.139 25.5512 38.2298 25.687 38.2918 25.8364C38.3537 25.9858 38.3856 26.1459 38.3856 26.3077C38.3856 26.4694 38.3537 26.6296 38.2918 26.779C38.2298 26.9284 38.139 27.0642 38.0246 27.1785L29.4092 35.7938C29.2949 35.9083 29.1592 35.9991 29.0098 36.061C28.8604 36.1229 28.7002 36.1548 28.5385 36.1548C28.3767 36.1548 28.2166 36.1229 28.0672 36.061C27.9177 35.9991 27.782 35.9083 27.6677 35.7938L23.9754 32.1015C23.7444 31.8706 23.6147 31.5574 23.6147 31.2308C23.6147 30.9042 23.7444 30.5909 23.9754 30.36C24.2063 30.1291 24.5196 29.9993 24.8462 29.9993C25.1728 29.9993 25.486 30.1291 25.7169 30.36L28.5385 33.1831L36.2831 25.4369C36.3974 25.3225 36.5331 25.2317 36.6825 25.1698C36.8319 25.1078 36.9921 25.076 37.1538 25.076C37.3156 25.076 37.4757 25.1078 37.6252 25.1698C37.7746 25.2317 37.9103 25.3225 38.0246 25.4369ZM47 30C47 33.1645 46.0616 36.2579 44.3035 38.8891C42.5454 41.5203 40.0466 43.5711 37.1229 44.7821C34.1993 45.9931 30.9823 46.3099 27.8786 45.6926C24.7749 45.0752 21.9239 43.5513 19.6863 41.3137C17.4487 39.0761 15.9248 36.2251 15.3074 33.1214C14.6901 30.0177 15.0069 26.8007 16.2179 23.8771C17.4289 20.9534 19.4797 18.4546 22.1109 16.6965C24.7421 14.9384 27.8355 14 31 14C35.2421 14.0045 39.3091 15.6916 42.3088 18.6912C45.3084 21.6908 46.9955 25.7579 47 30ZM44.5385 30C44.5385 27.3223 43.7444 24.7048 42.2568 22.4784C40.7692 20.252 38.6548 18.5168 36.1809 17.4921C33.7071 16.4674 30.985 16.1993 28.3588 16.7217C25.7326 17.2441 23.3203 18.5335 21.4269 20.4269C19.5335 22.3202 18.2441 24.7326 17.7217 27.3588C17.1993 29.985 17.4674 32.7071 18.4921 35.1809C19.5168 37.6548 21.2521 39.7692 23.4784 41.2568C25.7048 42.7444 28.3223 43.5385 31 43.5385C34.5894 43.5344 38.0306 42.1067 40.5686 39.5686C43.1067 37.0306 44.5344 33.5894 44.5385 30Z"
                  fill="#E98400"
                />
              </Svg>
            ) : textColor === "red" ? (
              <Svg
                width="61"
                height="61"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Rect width="61" height="61" rx="12" fill="#555555" />
                <G clip-path="url(#clip0_674_330)">
                  <Path
                    d="M36.7938 26.9477L32.74 31L36.7938 35.0523C36.9082 35.1667 36.9989 35.3024 37.0608 35.4518C37.1227 35.6012 37.1545 35.7614 37.1545 35.9231C37.1545 36.0848 37.1227 36.2449 37.0608 36.3943C36.9989 36.5437 36.9082 36.6795 36.7938 36.7938C36.6795 36.9082 36.5437 36.9989 36.3943 37.0608C36.2449 37.1227 36.0848 37.1545 35.9231 37.1545C35.7614 37.1545 35.6012 37.1227 35.4518 37.0608C35.3024 36.9989 35.1667 36.9082 35.0523 36.7938L31 32.74L26.9477 36.7938C26.8333 36.9082 26.6976 36.9989 26.5482 37.0608C26.3988 37.1227 26.2386 37.1545 26.0769 37.1545C25.9152 37.1545 25.7551 37.1227 25.6057 37.0608C25.4563 36.9989 25.3205 36.9082 25.2062 36.7938C25.0918 36.6795 25.0011 36.5437 24.9392 36.3943C24.8773 36.2449 24.8455 36.0848 24.8455 35.9231C24.8455 35.7614 24.8773 35.6012 24.9392 35.4518C25.0011 35.3024 25.0918 35.1667 25.2062 35.0523L29.26 31L25.2062 26.9477C24.9752 26.7167 24.8455 26.4035 24.8455 26.0769C24.8455 25.7503 24.9752 25.4371 25.2062 25.2062C25.4371 24.9752 25.7503 24.8455 26.0769 24.8455C26.4035 24.8455 26.7168 24.9752 26.9477 25.2062L31 29.26L35.0523 25.2062C35.1667 25.0918 35.3024 25.0011 35.4518 24.9392C35.6012 24.8773 35.7614 24.8455 35.9231 24.8455C36.0848 24.8455 36.2449 24.8773 36.3943 24.9392C36.5437 25.0011 36.6795 25.0918 36.7938 25.2062C36.9082 25.3205 36.9989 25.4563 37.0608 25.6057C37.1227 25.7551 37.1545 25.9152 37.1545 26.0769C37.1545 26.2386 37.1227 26.3988 37.0608 26.5482C36.9989 26.6976 36.9082 26.8333 36.7938 26.9477ZM47 31C47 34.1645 46.0616 37.2579 44.3035 39.8891C42.5454 42.5203 40.0466 44.5711 37.1229 45.7821C34.1993 46.9931 30.9823 47.3099 27.8786 46.6926C24.7749 46.0752 21.9239 44.5513 19.6863 42.3137C17.4487 40.0761 15.9248 37.2251 15.3074 34.1214C14.6901 31.0177 15.0069 27.8007 16.2179 24.8771C17.4289 21.9534 19.4797 19.4546 22.1109 17.6965C24.7421 15.9384 27.8355 15 31 15C35.2421 15.0045 39.3092 16.6916 42.3088 19.6912C45.3084 22.6908 46.9955 26.7579 47 31ZM44.5385 31C44.5385 28.3223 43.7444 25.7048 42.2568 23.4784C40.7692 21.252 38.6548 19.5168 36.1809 18.4921C33.7071 17.4674 30.985 17.1993 28.3588 17.7217C25.7326 18.2441 23.3203 19.5335 21.4269 21.4269C19.5335 23.3202 18.2441 25.7326 17.7217 28.3588C17.1993 30.985 17.4674 33.7071 18.4921 36.1809C19.5168 38.6548 21.2521 40.7692 23.4784 42.2568C25.7048 43.7444 28.3223 44.5385 31 44.5385C34.5894 44.5344 38.0306 43.1067 40.5686 40.5686C43.1067 38.0306 44.5344 34.5894 44.5385 31Z"
                    fill="#E98400"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_674_330">
                    <Rect
                      width="32"
                      height="32"
                      fill="white"
                      transform="translate(15 15)"
                    />
                  </ClipPath>
                </Defs>
              </Svg>
            ) : (
              <Svg
                width="61"
                height="61"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Rect width="61" height="61" rx="12" fill="#555555" />
                <Path
                  d="M44.8462 19.1739H40.0485L37.6894 15.6191C37.563 15.4288 37.3919 15.2727 37.1911 15.1647C36.9904 15.0567 36.7662 15.0001 36.5385 15H25.4615C25.2338 15.0001 25.0096 15.0567 24.8089 15.1647C24.6081 15.2727 24.437 15.4288 24.3106 15.6191L21.9498 19.1739H17.1538C16.0522 19.1739 14.9956 19.6137 14.2166 20.3964C13.4376 21.1792 13 22.2408 13 23.3478V42.8261C13 43.9331 13.4376 44.9947 14.2166 45.7775C14.9956 46.5603 16.0522 47 17.1538 47H44.8462C45.9478 47 47.0044 46.5603 47.7834 45.7775C48.5624 44.9947 49 43.9331 49 42.8261V23.3478C49 22.2408 48.5624 21.1792 47.7834 20.3964C47.0044 19.6137 45.9478 19.1739 44.8462 19.1739ZM46.2308 42.8261C46.2308 43.1951 46.0849 43.549 45.8252 43.8099C45.5656 44.0708 45.2134 44.2174 44.8462 44.2174H17.1538C16.7866 44.2174 16.4344 44.0708 16.1748 43.8099C15.9151 43.549 15.7692 43.1951 15.7692 42.8261V23.3478C15.7692 22.9788 15.9151 22.6249 16.1748 22.364C16.4344 22.1031 16.7866 21.9565 17.1538 21.9565H22.6923C22.9203 21.9567 23.1448 21.9002 23.3459 21.7922C23.547 21.6842 23.7185 21.528 23.845 21.3374L26.2023 17.7826H35.796L38.155 21.3374C38.2816 21.528 38.453 21.6842 38.6541 21.7922C38.8552 21.9002 39.0797 21.9567 39.3077 21.9565H44.8462C45.2134 21.9565 45.5656 22.1031 45.8252 22.364C46.0849 22.6249 46.2308 22.9788 46.2308 23.3478V42.8261ZM31 24.7391C29.4938 24.7391 28.0215 25.1879 26.7691 26.0288C25.5168 26.8696 24.5407 28.0647 23.9643 29.4629C23.3879 30.8612 23.2371 32.3998 23.5309 33.8842C23.8248 35.3685 24.5501 36.732 25.6151 37.8022C26.6801 38.8724 28.0371 39.6012 29.5143 39.8964C30.9916 40.1917 32.5228 40.0402 33.9143 39.461C35.3058 38.8818 36.4952 37.901 37.332 36.6426C38.1688 35.3842 38.6154 33.9048 38.6154 32.3913C38.6131 30.3625 37.81 28.4175 36.3824 26.9829C34.9547 25.5484 33.019 24.7414 31 24.7391ZM31 37.2609C30.0415 37.2609 29.1046 36.9753 28.3076 36.4402C27.5107 35.9051 26.8895 35.1446 26.5227 34.2548C26.1559 33.365 26.06 32.3859 26.247 31.4413C26.434 30.4967 26.8955 29.629 27.5733 28.948C28.251 28.267 29.1145 27.8032 30.0546 27.6153C30.9946 27.4274 31.969 27.5238 32.8545 27.8924C33.7401 28.261 34.4969 28.8851 35.0294 29.6859C35.5619 30.4867 35.8462 31.4282 35.8462 32.3913C35.8462 33.6828 35.3356 34.9214 34.4268 35.8346C33.5179 36.7478 32.2853 37.2609 31 37.2609Z"
                  fill="#E98400"
                />
              </Svg>
            )}
            <Text style={styles.modalText}>{text}</Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  navigation.goBack();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Zatvori skener</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setModalVisible(false);
                  setScanned(false);
                }}
              >
                <Text style={styles.textStyle}>Skeniraj ponovo</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {!scanned && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Obrni kameru</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              (setScanned(true), navigation.goBack());
            }}
          >
            <Text style={styles.text}>Ugasi kameru</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "start",
  },
  icon: {
    alignsItems: "center",
    flexDirection: "row",
    gap: 20,
    padding: 10,
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: "#fff",
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  inactiveContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  greenInactiveText: {
    color: "#00ff00",
  },
  redInactiveText: {
    color: "#ff0000",
  },
  blackInactiveText: {
    color: "#fff",
  },
  scanAgainButton: {
    backgroundColor: "#0000FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: "#E98400",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: "#696969",
    borderWidth: 1,
  },
  buttonContainer: {
    gap: 15,
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 32,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    height: 50,
  },
  signOutButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
    height: "100%",
    width: "100%",
  },
  buttonClose: {
    width: 100,
    backgroundColor: "#2196F3",
  },

  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  modalView: {
    width: "93%",
    borderColor: "#696969",
    borderWidth: 1,
    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingTop: 25,
    paddingBottom: 40,
    alignItems: "center",
    borderRadius: 20,
  },

  modalText: {
    marginTop: 20,
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

  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonCancel: {
    width: 150,
    backgroundColor: "#555",
    borderWidth: 1,
    borderColor: "#535353",
  },

  buttonOpen: {
    width: 150,
    backgroundColor: "#E98400",
    borderWidth: 1,
    borderColor: "#535353",
  },
});
