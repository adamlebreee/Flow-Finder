import React from 'react';
import { Picker } from '@react-native-picker/picker';

const stylesList = ['Vinyasa', 'Hatha', 'Ashtanga', 'Aerial', 'Bikram', 'Jivamukti'];

const StyleDropdown = ({ selectedStyle, setSelectedStyle }) => {
    return (
        <Picker
            selectedValue={selectedStyle}
            onValueChange={(itemValue) => setSelectedStyle(itemValue)}
        >
            <Picker.Item label="Select a Style" value={null} />
            {stylesList.map((style) => (
                <Picker.Item key={style} label={style} value={style} />
            ))}
        </Picker>
    );
};

export default StyleDropdown;