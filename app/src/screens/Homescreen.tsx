// import React from "react";
// import {
//     FlatList,
//     Image,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { videoData } from "../data/StreamingLinksData";

// const Homescreen = ({ navigation, route }) => {
//   const onClickVideo = (video) => {
//     console.log('homescreen, ',video)
//     navigation.navigate("PlayerScreen", { video });
//   };

//   return (
//     <View style={Styles.mainContainer}>
//       <FlatList
//         data={videoData}
//         renderItem={({ item }) => {
//           return (
//             <TouchableOpacity
//               style={{ backgroundColor: "blue", margin: 10 }}
//               onPress={() => onClickVideo(item)}
//             >
//               <Image source={{ uri: item.url }} height={100} />
//               <View>
//                 <Text>{item.title}</Text>
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// };

// const Styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     margin: 15,
//     backgroundColor: "red",
//     gap: 10,
//   },
// });

// export default Homescreen;


// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as FileSystem from "expo-file-system";
// import React, { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     Image,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const videos = [
//   {
//     id: "bunny",
//     title: "Big Buck Bunny",
//     url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     thumbnail: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
//     duration: "9:56",
//   },
//   {
//     id: "sintel",
//     title: "Sintel",
//     url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
//     thumbnail: "https://media.kiteka.com/images/sintel-thumb.jpg",
//     duration: "14:48",
//   },
//       {
//         id: '3',
//         title: 'Tears of Steel',
//     thumbnail: "https://media.kiteka.com/images/sintel-thumb.jpg",

//         url: 'https://bitdash-a.akamaihd.net/content/tears/hls/playlist.m3u8',
//     },
//     {
//         id: '4',
//         title: 'Bunny 720p',
//     thumbnail: "https://media.kiteka.com/images/sintel-thumb.jpg",

//         url: 'https://moose.adc.washington.edu/media/bbb_720p/bbb_720p.m3u8',
//     },
//     {
//         id: '5',
//         title: 'Wildlife',
//     thumbnail: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",

//         url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     },
// ];

// const HomeScreen = ({ navigation }) => {
//   const [downloadedMap, setDownloadedMap] = useState({});
//   const [loadingMap, setLoadingMap] = useState({});

//   useEffect(() => {
//     checkDownloads();
//   }, []);

//   const getVideoFilePath = (videoId) =>
//     `${FileSystem.documentDirectory}${videoId}.mp4`;

//   const checkDownloads = async () => {
//     const map = {};
//     for (const v of videos) {
//       const uri = await AsyncStorage.getItem(`local-video-${v.id}`);
//       map[v.id] = uri ? true : false;
//     }
//     setDownloadedMap(map);
//   };

//   const handleDownload = async (video) => {
//     setLoadingMap((prev) => ({ ...prev, [video.id]: true }));
//     const localPath = getVideoFilePath(video.id);

//     try {
//       const downloadResumable = FileSystem.createDownloadResumable(
//         video.url,
//         localPath
//       );
//       const { uri } = await downloadResumable.downloadAsync();
//       await AsyncStorage.setItem(`local-video-${video.id}`, uri);
//       console.log("✅ Downloaded:", uri);
//       await checkDownloads();
//     } catch (e) {
//       console.error("❌ Download failed:", e);
//     } finally {
//       setLoadingMap((prev) => ({ ...prev, [video.id]: false }));
//     }
//   };

//   const handlePlay = async (video) => {
//     const localUri = await AsyncStorage.getItem(`local-video-${video.id}`);
//     const playUri = localUri || video.url;
//     navigation.navigate("PlayerScreen", {
//       video: {
//         id: video.id,
//         url: playUri,
//       },
//     });
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
//       <View style={styles.info}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.duration}>⏱ {item.duration}</Text>
//         <View style={styles.actions}>
//           <TouchableOpacity onPress={() => handlePlay(item)} style={styles.playButton}>
//             <Text style={styles.playText}>▶️ Play</Text>
//           </TouchableOpacity>
//           {downloadedMap[item.id] ? (
//             <Text style={styles.downloaded}>📥 Downloaded</Text>
//           ) : loadingMap[item.id] ? (
//             <ActivityIndicator size="small" color="gray" />
//           ) : (
//             <TouchableOpacity onPress={() => handleDownload(item)}>
//               <Text style={styles.download}>⬇️ Download</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <FlatList
//       data={videos}
//       keyExtractor={(item) => item.id}
//       renderItem={renderItem}
//       contentContainerStyle={{ padding: 10 }}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   card: { flexDirection: "row", marginBottom: 15, backgroundColor: "#eee", borderRadius: 10 },
//   thumbnail: { width: 120, height: 80, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
//   info: { flex: 1, padding: 10, justifyContent: "space-between" },
//   title: { fontSize: 16, fontWeight: "bold" },
//   duration: { fontSize: 12, color: "#666" },
//   actions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   playButton: { padding: 5, backgroundColor: "#222", borderRadius: 5 },
//   playText: { color: "#fff" },
//   downloaded: { color: "green", fontWeight: "bold" },
//   download: { color: "blue" },
// });

// export default HomeScreen;


import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// ... your video list
const videos = [
  {
    id: "bunny",
    title: "Big Buck Bunny",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
    duration: "9:56",
  },
  {
    id: "sintel",
    title: "Sintel",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail: "https://media.kiteka.com/images/sintel-thumb.jpg",
    duration: "14:48",
  },
];

const HomeScreen = ({ navigation }) => {
  const [downloadedMap, setDownloadedMap] = useState({});
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    checkDownloads();
  }, []);

  const getVideoFilePath = (videoId) =>
    `${FileSystem.documentDirectory}${videoId}.mp4`;

  const checkDownloads = async () => {
    const map = {};
    for (const v of videos) {
      const uri = await AsyncStorage.getItem(`local-video-${v.id}`);
      map[v.id] = uri ? true : false;
    }
    setDownloadedMap(map);
  };

  const handleDownload = async (video) => {
    const localPath = getVideoFilePath(video.id);

    const callback = (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      setProgressMap((prev) => ({
        ...prev,
        [video.id]: Math.floor(progress * 100),
      }));
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      video.url,
      localPath,
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      await AsyncStorage.setItem(`local-video-${video.id}`, uri);
      console.log("✅ Download complete:", uri);
      setProgressMap((prev) => ({ ...prev, [video.id]: 100 }));
      await checkDownloads();
    } catch (e) {
      console.error("❌ Download failed:", e);
      setProgressMap((prev) => ({ ...prev, [video.id]: null }));
    }
  };

  const handlePlay = async (video) => {
    const localUri = await AsyncStorage.getItem(`local-video-${video.id}`);
    const playUri = localUri || video.url;
    navigation.navigate("PlayerScreen", {
      video: { id: video.id, url: playUri },
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.duration}>⏱ {item.duration}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handlePlay(item)} style={styles.playButton}>
            <Text style={styles.playText}>▶️ Play</Text>
          </TouchableOpacity>

          {downloadedMap[item.id] ? (
            <Text style={styles.downloaded}>📥 Downloaded</Text>
          ) : progressMap[item.id] >= 0 ? (
            <Text style={styles.progressText}>⬇️ {progressMap[item.id]}%</Text>
          ) : (
            <TouchableOpacity onPress={() => handleDownload(item)}>
              <Text style={styles.download}>⬇️ Download</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  thumbnail: {
    width: 120,
    height: 80,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  duration: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playButton: {
    padding: 5,
    backgroundColor: "#222",
    borderRadius: 5,
  },
  playText: {
    color: "#fff",
  },
  downloaded: {
    color: "green",
    fontWeight: "bold",
  },
  download: {
    color: "blue",
  },
  progressText: {
    color: "#555",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default HomeScreen;
