import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable ,StyleSheet, View, Text } from 'react-native';
import Card from '../components/ui/card';
import { CardItem } from '../types/CardItem';

interface ApiProduct {
    id: number;
    title: string;
    image: string;
    description: string;
}

const adaptProductToCardItem = (p: ApiProduct): CardItem => ({
    id: String(p.id),
    title: p.title,
    image: p.image,
    description: p.description
});

const API_URL = 'https://fakestoreapi.com/products?limit=10';

export default function HomeScreen() {
    const router = useRouter();
    const [cards, setCards] = useState<CardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCards = useCallback(async () => {
        try {
            setError(null);
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error HTTP: ${response.status}');
            const data: ApiProduct[] = await response.json();
            setCards(data.map(adaptProductToCardItem));
        } catch (err){
            setError(err instanceof Error ? err.message: 'Error desconocido');
        } finally {
            setLoading(false)
            setRefreshing(false)

        }
    }, []);

    useEffect(() =>{
        fetchCards();
    }, [fetchCards]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCards();
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#333" />
                <Text style={styles.message}>Cargando tarjetas...</Text>
            </View>
        );
    }

    if (error){
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={fetchCards} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
                <Text style={styles.emptyText}>No hay tarjetas disponibles.</Text>
            }
            renderItem={({ item }) => (
                <Card
                    title={item.title}
                    image={item.image}
                    description={item.description}
                    onPress={() =>
                        router.push({
                            pathname: '/details',
                            params: { item: JSON.stringify(item) },
                        })
                    }
                />
            )}
        />
    )

}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    listContent: {
        padding: 16,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    },
    message: {
        marginTop: 12,
        fontSize: 16,
        color: '#666'
    },
    errorText: {
        fontSize: 16,
        color: '#c0392b',
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    retryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 5
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
})


