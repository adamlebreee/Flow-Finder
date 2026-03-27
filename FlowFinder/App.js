import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import Title from './components/Title';
import StyleDropdown from './components/StyleDropdown';
import StyleTooltip from './components/StyleTooltip';
import Map from './components/Map';
import StudioInfo from './components/StudioInfo';


export default function App() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [studios, setStudios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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
