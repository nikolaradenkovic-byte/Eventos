import { useState } from "react";
import Svg, { Path, Rect, G, ClipPath, Defs } from "react-native-svg";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { login } from "../api/AuthService";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { setUserToken } = useAuth();
  const [text, setText] = useState("Greska u prijavi.");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setText("Unesite mejl i sifru.");
      setModalVisible(true);
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      const token = await SecureStore.getItemAsync("accessToken");

      if (token) {
        setUserToken(token);
      } else {
        setText("Prijava neuspesna.");
        setModalVisible(true);
      }
    } catch (error: any) {
      setText("Prijava neuspesna.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Svg width="61" height="61" viewBox="0 0 61 61" fill="none">
              <Rect width="61" height="61" rx="12" fill="#555555" />
              <G clip-path="url(#clip0_674_358)">
                <Path
                  d="M46.5428 41.7929L34.0506 19.772C33.7384 19.2325 33.2927 18.7851 32.7578 18.4743C32.2228 18.1635 31.6171 18 31.0007 18C30.3843 18 29.7786 18.1635 29.2436 18.4743C28.7087 18.7851 28.263 19.2325 27.9509 19.772L15.4587 41.7929C15.1583 42.3147 15 42.9082 15 43.5126C15 44.117 15.1583 44.7105 15.4587 45.2323C15.7668 45.775 16.2117 46.2248 16.7477 46.5354C17.2836 46.846 17.8914 47.0063 18.5085 46.9998H43.4929C44.1096 47.0058 44.7167 46.8453 45.2521 46.5347C45.7875 46.2241 46.232 45.7746 46.5399 45.2323C46.8407 44.7107 46.9995 44.1173 47 43.513C47.0005 42.9086 46.8427 42.315 46.5428 41.7929ZM44.5614 44.0708C44.4525 44.2594 44.2962 44.4152 44.1084 44.5222C43.9207 44.6292 43.7082 44.6836 43.4929 44.6798H18.5085C18.2932 44.6836 18.0808 44.6292 17.893 44.5222C17.7052 44.4152 17.5489 44.2594 17.44 44.0708C17.3413 43.9013 17.2893 43.708 17.2893 43.5111C17.2893 43.3143 17.3413 43.121 17.44 42.9515L29.9322 20.9305C30.0433 20.7428 30.2004 20.5876 30.3881 20.4797C30.5758 20.3719 30.7879 20.3153 31.0036 20.3153C31.2193 20.3153 31.4313 20.3719 31.619 20.4797C31.8068 20.5876 31.9638 20.7428 32.0749 20.9305L44.5672 42.9515C44.6649 43.1215 44.716 43.3151 44.715 43.5119C44.714 43.7088 44.661 43.9018 44.5614 44.0708ZM29.8579 35.3999V29.6C29.8579 29.2923 29.9783 28.9973 30.1926 28.7797C30.4069 28.5622 30.6976 28.44 31.0007 28.44C31.3038 28.44 31.5945 28.5622 31.8088 28.7797C32.0231 28.9973 32.1435 29.2923 32.1435 29.6V35.3999C32.1435 35.7076 32.0231 36.0026 31.8088 36.2202C31.5945 36.4377 31.3038 36.5599 31.0007 36.5599C30.6976 36.5599 30.4069 36.4377 30.1926 36.2202C29.9783 36.0026 29.8579 35.7076 29.8579 35.3999ZM32.7149 40.6199C32.7149 40.964 32.6144 41.3004 32.426 41.5866C32.2377 41.8727 31.9699 42.0957 31.6567 42.2274C31.3435 42.3591 30.9988 42.3936 30.6663 42.3264C30.3338 42.2593 30.0283 42.0936 29.7886 41.8502C29.5489 41.6069 29.3856 41.2969 29.3195 40.9593C29.2533 40.6218 29.2873 40.272 29.417 39.954C29.5467 39.6361 29.7665 39.3643 30.0484 39.1731C30.3303 38.9819 30.6617 38.8799 31.0007 38.8799C31.4553 38.8799 31.8914 39.0632 32.2128 39.3895C32.5343 39.7158 32.7149 40.1584 32.7149 40.6199Z"
                  fill="#E98400"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_674_358">
                  <Rect
                    width="32"
                    height="32"
                    fill="white"
                    transform="translate(15 15)"
                  />
                </ClipPath>
              </Defs>
            </Svg>

            <Text style={styles.modalText}>{text}</Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setModalVisible(false);
                  setText("");
                }}
              >
                <Text style={styles.textStyle}>Uredu</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.icon} activeOpacity={0.7}>
        <Svg width={34} height={27} viewBox="0 0 34 27" fill="none">
          <Path
            d="M31.9658 10.5654L34 13.5L31.9658 16.4346L31.9658 10.5654ZM29.0596 6.45605L30.5127 8.51074L30.5127 18.4893L29.0596 20.5439L29.0596 6.45605ZM26.1543 2.34766L27.6064 4.40234L27.6064 22.5977L26.1543 24.6523L26.1543 2.34766ZM9.29883 -4.10493e-07L19.1797 -8.4668e-07L11.624 9.97852L24.4102 -1.07758e-06L24.4102 27L11.624 17.0215L19.1797 27L9.29883 27L-5.84313e-07 13.5L9.29883 -4.10493e-07Z"
            fill="white"
          />
        </Svg>
      </TouchableOpacity>
      <Text style={styles.title}>Prijavi se</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#949494"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Lozinka"
        placeholderTextColor="#949494"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.smallText}>Zaboravili ste lozinku?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Prijavi se</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.smallText}>Nemate nalog?</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  smallText: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    fontStyle: "italic",
    color: "#333333",
    paddingBottom: 10,
    textDecorationLine: "underline",
  },
  icon: {
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    padding: 10,
    marginBottom: 200,
  },
  container: {
    flex: 1,
    backgroundColor: "#010101",
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 35,
    lineHeight: 35,
    letterSpacing: 0,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffffff",
    paddingBottom: 30,
  },
  input: {
    color: "#fff",
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: "#696969",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#E98400",
    padding: 16,
    borderRadius: 8,
    borderColor: "#696969",
    borderWidth: 1,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
