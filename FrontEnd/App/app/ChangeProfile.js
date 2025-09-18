// ChangeProfile.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { checkUpdate } from './Account/updateUsers';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 1024;
const moderateScale = (size, factor = 0.5) =>
  size + ((SCREEN_WIDTH / BASE_WIDTH) * size - size) * factor;

export default function ChangeProfile({ visible, onClose, user, onUpdateSuccess }) {
  const [mode, setMode] = useState(null); // 'name' | 'phone' | 'password'
  const [value, setValue] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const reset = () => {
    setMode(null);
    setValue('');
    setPasswordConfirm('');
  };

  const saveChange = async () => {
    if (mode === 'name') {
      if (!value.trim()) return Alert.alert('Error', 'Name cannot be empty');
      const result = await checkUpdate(value, null, null, null);
      Alert.alert(result.success ? 'Success' : 'Error', result.message);
      if (result.success) {
        onUpdateSuccess();
        reset();
        onClose();
      }
    }

    if (mode === 'phone') {
      if (!value.trim()) return Alert.alert('Error', 'Phone cannot be empty');
      const result = await checkUpdate(null, null, null, value);
      Alert.alert(result.success ? 'Success' : 'Error', result.message);
      if (result.success) {
        onUpdateSuccess();
        reset();
        onClose();
      }
    }

    if (mode === 'password') {
      if (!value.trim() || !passwordConfirm.trim())
        return Alert.alert('Error', 'Password cannot be empty');
      if (value !== passwordConfirm)
        return Alert.alert('Error', 'Passwords do not match');
      const result = await checkUpdate(null, value, null, null);
      Alert.alert(result.success ? 'Success' : 'Error', result.message);
      if (result.success) {
        reset();
        onClose();
      }
    }
  };

  const handlePictureChange = async () => {
    onClose();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your gallery.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const updateResult = await checkUpdate(null, null, result.assets[0].uri, null);
      Alert.alert(updateResult.success ? 'Success' : 'Error', updateResult.message);
      if (updateResult.success) {
        onUpdateSuccess();
      }
    }
  };

  return (
    <>
      {/* Main options modal */}
      <Modal visible={visible && !mode} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Edit Profile</Text>

            <TouchableOpacity style={styles.option} onPress={() => { setMode('name'); setValue(user.name); }}>
              <Text style={styles.optionText}>📝 Change Name</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => { setMode('phone'); setValue(user.phone_number); }}>
              <Text style={styles.optionText}>📞 Change Phone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => setMode('password')}>
              <Text style={styles.optionText}>🔒 Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handlePictureChange}>
              <Text style={styles.optionText}>📷 Change Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Input modal for name/phone/password */}
      <Modal visible={!!mode} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>
              {mode === 'name' && 'Change Name'}
              {mode === 'phone' && 'Change Phone'}
              {mode === 'password' && 'Change Password'}
            </Text>

            {/* One input for name & phone */}
            {mode !== 'password' && (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                placeholder={mode === 'name' ? 'Enter new name' : 'Enter new phone'}
                keyboardType={mode === 'phone' ? 'phone-pad' : 'default'}
              />
            )}

            {/* Two inputs for password */}
            {mode === 'password' && (
              <>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setValue}
                  placeholder="Enter new password"
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  placeholder="Confirm new password"
                  secureTextEntry
                />
              </>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveChange}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
    padding: 20,
  },
  closeBtn: { position: 'absolute', top: 10, right: 15 },
  closeText: { fontSize: 24, color: '#1E4368' },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#1E4368',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: { fontSize: moderateScale(18), color: '#1E4368' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: moderateScale(16),
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginRight: 5,
  },
  cancelText: { textAlign: 'center', color: '#666', fontSize: moderateScale(16) },
  saveBtn: {
    flex: 1,
    backgroundColor: '#1E4368',
    padding: 15,
    borderRadius: 10,
    marginLeft: 5,
  },
  saveText: { textAlign: 'center', color: '#fff', fontSize: moderateScale(16) },
};
