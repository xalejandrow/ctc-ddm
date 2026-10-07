import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

const URL = "https://dummyjson.com/products";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${URL}${path}`, options);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    return response.json() as Promise<T>;
  }

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await request<{ products: Product[] }>("?limit=10");
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible cargar los productos");
    } finally {
      setLoading(false);
    }
  }

  async function addProduct() {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    try {
      setSaving(true);
      const created = await request<Product>("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: cleanTitle, price: 100, thumbnail: "https://dummyjson.com/image/300x200/2D6A4F/FFFFFF?text=Nuevo" }),
      });
      setProducts((current) => [created, ...current]);
      setTitle("");
    } catch (err) {
      Alert.alert("No se pudo crear", err instanceof Error ? err.message : "Intente otra vez");
    } finally {
      setSaving(false);
    }
  }

  async function editProduct(product: Product) {
    try {
      const updated = await request<Product>(`/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `${product.title} (oferta)` }),
      });
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, ...updated } : item));
    } catch (err) {
      Alert.alert("No se pudo editar", err instanceof Error ? err.message : "Intente otra vez");
    }
  }

  function confirmDelete(product: Product) {
    Alert.alert("Eliminar producto", `¿Eliminar "${product.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => void deleteProduct(product.id),
      },
    ]);
  }

  async function deleteProduct(id: number) {
    try {
      await request(`/${id}`, { method: "DELETE" });
      setProducts((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      Alert.alert("No se pudo eliminar", err instanceof Error ? err.message : "Intente otra vez");
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={loadProducts}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Productos</Text>
            <Text style={styles.subtitle}>CRUD básico con DummyJSON y fetch</Text>
            <View style={styles.form}>
              <TextInput value={title} onChangeText={setTitle} placeholder="Nombre del producto" style={styles.input} />
              <Pressable style={[styles.addButton, saving && styles.disabled]} onPress={() => void addProduct()} disabled={saving}>
                <Text style={styles.addButtonText}>{saving ? "..." : "Agregar"}</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.price}>USD {item.price}</Text>
              <View style={styles.actions}>
                <Pressable onPress={() => void editProduct(item)}><Text style={styles.edit}>Editar</Text></Pressable>
                <Pressable onPress={() => confirmDelete(item)}><Text style={styles.delete}>Eliminar</Text></Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? <ActivityIndicator size="large" color="#2D6A4F" /> : <Text style={styles.error}>{error ?? "No hay productos."}</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7F5", paddingTop: 10 },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  header: { gap: 7, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: "800", color: "#1B4332" },
  subtitle: { color: "#52796F" },
  form: { flexDirection: "row", gap: 8, marginTop: 8 },
  input: { flex: 1, backgroundColor: "white", borderWidth: 1, borderColor: "#B7C9BF", borderRadius: 8, paddingHorizontal: 12, height: 44 },
  addButton: { backgroundColor: "#2D6A4F", borderRadius: 8, justifyContent: "center", paddingHorizontal: 14 },
  disabled: { opacity: 0.6 },
  addButtonText: { color: "white", fontWeight: "700" },
  card: { flexDirection: "row", backgroundColor: "white", borderRadius: 12, padding: 10, gap: 12, elevation: 2 },
  image: { width: 88, height: 88, borderRadius: 8, backgroundColor: "#D8E2DC" },
  info: { flex: 1, justifyContent: "space-between", gap: 5 },
  productTitle: { fontSize: 16, fontWeight: "700", color: "#1B4332" },
  price: { color: "#52796F", fontWeight: "600" },
  actions: { flexDirection: "row", gap: 18 },
  edit: { color: "#1D4ED8", fontWeight: "700" },
  delete: { color: "#B42318", fontWeight: "700" },
  error: { color: "#B42318", textAlign: "center", marginTop: 32 },
});
