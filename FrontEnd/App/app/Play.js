import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { WebView } from 'react-native-webview';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 1024;    // iPad M1 width
const BASE_HEIGHT = 1366;   // iPad M1 height

// Scaling functions
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const videoData = [
  {
    id: '1',
    title: 'Hey! Do you afraid of losing Acc? Come Here!!',
    creator: 'PhishGuard',
    views: '100k views',
    date: '17.01.2026',
    thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    url: 'https://player.cloudinary.com/embed/?cloud_name=dif1rbrhk&public_id=Screen_Recording_2025-08-09_065330_e74jtg&profile=cld-default',
    
  },
  {
    id: '2',
    title: 'Advanced Phishing Detection Techniques',
    creator: 'PhishGuard',
    views: '85k views',
    date: '15.01.2026',
    thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    url: 'https://player.cloudinary.com/embed/?cloud_name=dif1rbrhk&public_id=Screen_Recording_2025-08-09_065330_e74jtg&profile=cld-default',
  },
  {
    id: '3',
    title: 'Cybersecurity Best Practices 2026',
    creator: 'PhishGuard',
    views: '200k views',
    date: '12.01.2026',
    thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    url: 'https://player.cloudinary.com/embed/?cloud_name=dif1rbrhk&public_id=Screen_Recording_2025-08-09_065330_e74jtg&profile=cld-default',
  },
  {
    id: '4',
    title: 'Email Security Guide',
    creator: 'PhishGuard',
    views: '150k views',
    date: '10.01.2026',
    thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    url: 'https://player.cloudinary.com/embed/?cloud_name=dif1rbrhk&public_id=Screen_Recording_2025-08-09_065330_e74jtg&profile=cld-default',
  },
  {
    id: '5',
    title: 'Social Engineering Awareness',
    creator: 'PhishGuard',
    views: '95k views',
    date: '08.01.2026',
    thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    url: 'https://player.cloudinary.com/embed/?cloud_name=dif1rbrhk&public_id=Screen_Recording_2025-08-09_065330_e74jtg&profile=cld-default',
  },
  {
    id: '6',
    title: 'Password Security Essentials',
    creator: 'PhishGuard',
    views: '180k views',
    date: '05.01.2026',
    thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    url: 'https://player.cloudinary.com/embed/?cloud_name=dif1rbrhk&public_id=Screen_Recording_2025-08-09_065330_e74jtg&profile=cld-default',
  },
];

// Video Player Modal Component
const VideoPlayerModal = ({ visible, video, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!video) return null;

  const handleLoadStart = () => setIsLoading(true);
  const handleLoadEnd = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    Alert.alert('Error', 'Failed to load video', [{ text: 'OK', onPress: onClose }]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.playerContainer}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        
        {/* Player Header */}
        <View style={styles.playerHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          
        </View>

        {/* Video Player */}
        <View style={styles.videoPlayerContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
          <WebView
            source={{ uri: video.url }}
            style={styles.webView}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>

        {/* Video Info */}
        <View style={styles.playerVideoInfo}>
          <Text style={styles.playerTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <Text style={styles.playerCreator}>{video.creator}</Text>
          <Text style={styles.playerMetadata}>
            {video.views} • {video.date}
          </Text>
          
          {/* Action buttons */}
          <View style={styles.playerActionButtons}>
            <TouchableOpacity style={styles.playerActionButton} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>👍</Text>
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.playerActionButton} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>💾</Text>
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.playerActionButton} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>↗️</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Video list item component
const VideoListItem = ({ item, onPress }) => {
  const source = typeof item.thumbnail === "string" ? { uri: item.thumbnail } : item.thumbnail;

  return (
    <TouchableOpacity 
      style={styles.videoItem} 
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={source} style={styles.thumbnail} />
        <View style={styles.playButtonOverlay}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.creator}>{item.creator}</Text>
        <Text style={styles.metadata}>
          {item.views} • {item.date}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Header with search bar
const Header = ({ searchText, setSearchText }) => (
  <View style={styles.header}>
    <TextInput
      style={styles.searchInput}
      placeholder="Search videos..."
      placeholderTextColor="#ccc"
      value={searchText}
      onChangeText={setSearchText}
    />
  </View>
);

// Main Play Component
export default function Play() {
  const [searchText, setSearchText] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  // Filter videos based on search input
  const filteredVideos = videoData.filter(video =>
    video.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle video press - open player modal
  const handleVideoPress = (video) => {
    setSelectedVideo(video);
    setPlayerVisible(true);
  };

  // Close player modal
  const handleClosePlayer = () => {
    setPlayerVisible(false);
    setSelectedVideo(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1E4368" barStyle="light-content" />
      
      <Header searchText={searchText} setSearchText={setSearchText} />
      
      <FlatList
        data={filteredVideos}
        renderItem={({ item }) => (
          <VideoListItem item={item} onPress={handleVideoPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        visible={playerVisible}
        video={selectedVideo}
        onClose={handleClosePlayer}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E4368',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 65,
    paddingHorizontal: scale(40),
    paddingVertical: verticalScale(20),
    backgroundColor: "#1E4368",
  },
  searchInput: {
    width: scale(800),
    height: verticalScale(70),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(40),
    backgroundColor: "#2B5A7D",
    borderRadius: moderateScale(50),
    color: "white",
    fontSize: moderateScale(18),
  },
  listContainer: {
    padding: scale(40),
  },
  videoItem: {
    flexDirection: "row",
    backgroundColor: "#2B5A7D",
    width: scale(920),
    borderRadius: moderateScale(15),
    padding: scale(15),
    marginBottom: scale(12),
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: scale(250),
    height: verticalScale(100),
    borderRadius: moderateScale(15),
    backgroundColor: "#ccc",
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(15),
  },
  playButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: 'white',
    fontSize: moderateScale(16),
    marginLeft: scale(2),
  },
  videoInfo: {
    flex: 1,
    marginLeft: scale(30),
  },
  title: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(5), 
  },
  creator: {
    color: "#B8D4F0",
    fontSize: moderateScale(14),
    marginBottom: verticalScale(5),
  },
  metadata: {
    color: "#8BB5D9",
    fontSize: moderateScale(12),
    opacity: 0.8,
  },
  
  // Player Modal Styles
  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E4368',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    paddingTop: verticalScale(50),
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  closeIcon: {
    color: 'white',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  playerHeaderTitle: {
    flex: 1,
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  videoPlayerContainer: {
    width: '100%',
    height: verticalScale(400),
    backgroundColor: '#000',
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  loadingText: {
    color: 'white',
    fontSize: moderateScale(16),
  },
  playerVideoInfo: {
    flex: 1,
    backgroundColor: '#1E4368',
    padding: scale(20),
  },
  playerTitle: {
    color: 'white',
    fontSize: moderateScale(20),
    fontWeight: '600',
    marginBottom: verticalScale(10),
  },
  playerCreator: {
    color: '#B8D4F0',
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginBottom: verticalScale(5),
  },
  playerMetadata: {
    color: '#8BB5D9',
    fontSize: moderateScale(14),
    opacity: 0.8,
    marginBottom: verticalScale(20),
  },
  playerActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: '#2B5A7D',
  },
  playerActionButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
  },
  actionIcon: {
    fontSize: moderateScale(24),
    marginBottom: verticalScale(5),
  },
  actionText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
});