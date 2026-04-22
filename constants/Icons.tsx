import { Ionicons } from "@expo/vector-icons";
import { Image , StyleSheet } from "react-native";

export const icon = {
    index: ({color}: {color:string}) => (
        <Ionicons name='home-outline' size={22} color={color} />
    ),
    explore: ({color}: {color:string}) => (
        <Ionicons name='search-outline' size={22} color={color} />
    ), 
    // إذا كان لديك ملف باسم notifications.tsx اتركه، وإذا حذفته يمكنك مسح هذا السطر
    notifications: ({color}: {color:string}) => (
        <Ionicons name='notifications-outline' size={22} color={color} />
    ),
    cart: ({color}: {color:string}) => (
        <Ionicons name='cart-outline' size={22} color={color} />
    ),
    profile: ({color}: {color:string}) => (
        <Image source={{uri:''}} style={style.userImg} />
    ),
    // 💡 هذا هو السطر الذي كان ينقصك وكان يسبب الانهيار!
    orders: ({color}: {color:string}) => (
        <Ionicons name='receipt-outline' size={22} color={color} />
    ),
}

const style = StyleSheet.create({
    userImg: {
        height: 24,
        width: 24,
        borderRadius: 20
    }
});