import { Image, StyleSheet, View, Text, Pressable} from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { CardItem } from '../types/CardItem';


export default function DetailScreen() {
    const { item: itemString } = useLocalSearchParams<{ item: string }>();
    const item: CardItem = JSON.parse(itemString);

    return (
    <View style={styles.container}>
            <Image source= {{ uri:item.image}} style={styles.image} />
            
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
    </View>
    );
}
const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#fff',
        margin: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 250,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        paddingHorizontal: 10,
    },
});
