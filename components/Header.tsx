import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/context/AuthContext'; // تأكد من المسار الصحيح

const Header = () => {
  const { session } = useAuth(); // لجلب بيانات المستخدم

  return (
    <View style={headerStyles.headerContainer}>
      <View style={headerStyles.topRow}>
        <View>
          <Text style={headerStyles.greeting}>مرحباً 👋</Text>
          <Text style={headerStyles.subGreeting}>دعنا نبحث عن طلبك .</Text>
        </View>
        <Image 
          source={{ uri: session?.user?.avatar || 'https://share.google/images/5TvVr0UV6vRLJE854' }} // استخدم صورة المستخدم أو صورة افتراضية
          style={headerStyles.profileImage} 
        />
      </View>
      <View style={headerStyles.searchContainer}>
        <Ionicons name="search" size={24} color="#888" style={headerStyles.searchIcon} />
        <TextInput 
          style={headerStyles.searchInput} 
          placeholder="ابحث عن طلبك ..." 
          placeholderTextColor="#8c8787ff" 
        />
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#D2691E', // لون بنفسجي مطابق للصورة
    paddingTop: 50, // للتعامل مع النوتش
    paddingHorizontal: 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 7, // لرفع الظل في أندرويد
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 23,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 14,
    color: '#eee',
    marginTop: 5,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right', // ليتناسب مع اللغة العربية
  },
});

export default Header;