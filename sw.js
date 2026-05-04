const cacheName = 'dr-baha-v2'; // قمنا بتغيير الإصدار لضمان التحديث
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap'
];

// 1. تثبيت الـ Service Worker وحفظ الملفات الأساسية في الكاش
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('جاري حفظ ملفات النظام...');
      return cache.addAll(assets);
    })
  );
  // تفعيل الـ SW الجديد فوراً بدون انتظار إغلاق المتصفح
  self.skipWaiting();
});

// 2. تنظيف الكاش القديم عند تحديث التطبيق
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
            .map(key => caches.delete(key))
      );
    })
  );
  // التحكم في الصفحات المفتوحة فوراً
  self.clients.claim();
});

// 3. استراتيجية (الشبكة أولاً ثم الكاش) لضمان الحصول على أحدث البيانات
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
