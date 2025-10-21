import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Basit öğe tipi
interface Item {
  id: string;
  title: string;
  category?: string;
  done?: boolean;
}

const STORAGE_KEY = 'CEYIZIM_ITEMS_V1';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const titleInputRef = useRef<TextInput>(null);

  // İlk açılışta verileri yükle
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Item[];
          setItems(parsed);
        }
      } catch (e) {
        console.log('Load error', e);
      }
    })();
  }, []);

  // Her değişimde kaydet
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.log('Save error', e);
      }
    })();
  }, [items]);

  const remainingCount = useMemo(
    () => items.filter(i => !i.done).length,
    [items],
  );

  const addItem = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newItem: Item = {
      id: Date.now().toString(),
      title: trimmed,
      category: category.trim() || undefined,
      done: false,
    };
    setItems(prev => [newItem, ...prev]);
    setTitle('');
    setCategory('');
    titleInputRef.current?.focus();
    Keyboard.dismiss();
  };

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(it => (it.id === id ? {...it, done: !it.done} : it)),
    );
  };

  const removeItem = (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    Alert.alert(
      'Silinsin mi?',
      `"${target.title}" listeden kaldırılsın mı?`,
      [
        {text: 'Vazgeç'},
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => setItems(prev => prev.filter(it => it.id !== id)),
        },
      ],
    );
  };

  const clearAll = () => {
    if (items.length === 0) return;
    Alert.alert('Hepsini temizle?', 'Tüm öğeler silinecek.', [
      {text: 'İptal'},
      {text: 'Temizle', style: 'destructive', onPress: () => setItems([])},
    ]);
  };

  const renderItem = ({item}: {item: Item}) => (
    <View style={[styles.item, item.done && styles.itemDone]}>
      <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.checkbox}>
        <Text style={[styles.checkboxText, item.done && styles.checkboxTextDone]}> {item.done ? '✓' : '○'} </Text>
      </TouchableOpacity>

      <View style={styles.itemBody}>
        <Text style={[styles.itemTitle, item.done && styles.itemTitleDone]} numberOfLines={2}>
          {item.title}
        </Text>
        {!!item.category && (
          <Text style={styles.itemCategory}>#{item.category}</Text>
        )}
      </View>

      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteTxt}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>🎁 Çeyizim</Text>
        <Text style={styles.subtitle}>Toplam: {items.length} • Bekleyen: {remainingCount}</Text>

        {/* Girdi Alanı */}
        <View style={styles.inputRow}>
          <TextInput
            ref={titleInputRef}
            placeholder="Öğe adı (örn. Nevresim Takımı)"
            placeholderTextColor="#b08a95"
            value={title}
            onChangeText={setTitle}
            style={styles.inputTitle}
            returnKeyType="done"
            onSubmitEditing={addItem}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Kategori (örn. Tekstil, Mutfak, Elektronik) — opsiyonel"
            placeholderTextColor="#b08a95"
            value={category}
            onChangeText={setCategory}
            style={styles.inputCategory}
            returnKeyType="done"
            onSubmitEditing={addItem}
          />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={addItem} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnTxt}>Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll} style={styles.ghostBtn}>
            <Text style={styles.ghostBtnTxt}>Hepsini Temizle</Text>
          </TouchableOpacity>
        </View>

        {/* Liste */}
        <FlatList
          data={items}
          keyExtractor={it => it.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 40}}
          ListEmptyComponent={
            <Text style={styles.empty}>Henüz bir şey eklenmedi. Başlamak için yukarıdan öğe ekle ✨</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fffafc' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#e91e63' },
  subtitle: { marginTop: 4, color: '#7a4a58' },

  inputRow: { marginTop: 14 },
  inputTitle: {
    borderWidth: 1,
    borderColor: '#f2cdda',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputCategory: {
    borderWidth: 1,
    borderColor: '#f2cdda',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  primaryBtn: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnTxt: { color: '#fff', fontWeight: '700' },
  ghostBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e91e63',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ghostBtnTxt: { color: '#e91e63', fontWeight: '700' },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f2cdda',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    gap: 10,
  },
  itemDone: {
    opacity: 0.6,
  },
  checkbox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#ffe6ee',
  },
  checkboxText: { fontSize: 16, color: '#e91e63' },
  checkboxTextDone: { textDecorationLine: 'line-through' },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemTitleDone: { textDecorationLine: 'line-through', color: '#777' },
  itemCategory: { marginTop: 4, fontSize: 12, color: '#a26476' },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f3b7c8',
  },
  deleteTxt: { color: '#b33957', fontWeight: '700' },

  empty: {
    textAlign: 'center',
    marginTop: 24,
    color: '#8b6b75',
  },
});

export default App;
