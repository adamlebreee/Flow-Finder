import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, Text, Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import Title from './components/Title';
import StyleDropdown from './components/StyleDropdown';
import StyleTooltip from './components/StyleTooltip';
import Map from './components/Map';
import StudioInfo from './components/StudioInfo';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [studios, setStudios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) setAuthToken(token);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (response?.type !== 'success') return;
      const idToken = response.authentication?.idToken;
      if (!idToken) return;

      const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
      const res = await fetch(`${apiBaseUrl}/auth/google/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) return;
      const data = await res.json();
      if (!data?.token) return;

      await SecureStore.setItemAsync('authToken', data.token);
      setAuthToken(data.token);
    })();
  }, [response]);

  useEffect(() => {
    if (selectedStyle) {
      const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
      fetch(`${apiBaseUrl}/studio/style/${encodeURIComponent(selectedStyle)}`)
        .then(response => response.json())
        .then(data => {
          setStudios(data);
        })
        .catch((error) => {
          console.error('error:', error);
        });
    }
  }, [selectedStyle]);

  const openModal = (studio) => {
    setSelectedStudio(studio);
    setModalVisible(true);
  }

  const closeModal = () => {
    setSelectedStudio(null);
    setModalVisible(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <Title />
      {!authToken && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Button
            title="Sign in with Google (optional)"
            disabled={!request}
            onPress={() => promptAsync()}
          />
        </View>
      )}
      <View style={{ height: 65 }}>
        <StyleDropdown setSelectedStyle={setSelectedStyle} selectedStyle={selectedStyle} />
      </View>
      {selectedStyle &&
        <View style={{ height: 50 }}>
          <StyleTooltip selectedStyle={selectedStyle} />
        </View>
      }
      <View style={{ height: 570 }}>
        <Map setSelectedStudio={openModal} studios={studios} />
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {selectedStudio &&
            <>
              <StudioInfo studio={selectedStudio} />
              <TouchableOpacity onPress={closeModal}>
                <Text>Close</Text>
              </TouchableOpacity>
            </>
          }
        </View>
      </Modal>
    </View>
  );
}
