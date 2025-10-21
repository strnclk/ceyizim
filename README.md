# 🎁 Ceyizim

**Ceyizim**, React Native ile geliştirilmiş kişisel bir **çeyiz listesi uygulamasıdır.**  
Kullanıcı, ev eşyalarını veya çeyiz ürünlerini kategorilere göre ekleyebilir, tamamlananları işaretleyebilir ve kayıtlarını kalıcı olarak saklayabilir.

---

## 🚀 Özellikler
- ✨ Öğe ekleme, silme ve düzenleme
- 📦 Kategoriye göre listeleme (ör. Tekstil, Mutfak, Elektronik)
- ✅ Tamamlandı / yapılacak olarak işaretleme
- 💾 Kalıcı kayıt (AsyncStorage)
- 📱 Android emülatör veya gerçek cihaz desteği

---

## 🛠️ Kullanılan Teknolojiler
- [React Native 0.82+](https://reactnative.dev/)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage)
- TypeScript
- Metro Bundler
- Android Studio (emülatör)

---

## ⚙️ Kurulum
```bash
# repoyu klonla
git clone https://github.com/strnclk/ceyizim.git

cd ceyizim

# bağımlılıkları yükle
npm install

# Android emülatörünü başlat
npm run android

💡 İlk defa çalıştırıyorsan:
npm start -- --reset-cache