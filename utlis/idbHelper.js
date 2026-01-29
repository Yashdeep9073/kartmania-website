// utils/idbHelper.js
export class IDBHelper {
  constructor(dbName = 'productStoreDB', version = 2) {
    this.dbName = dbName
    this.version = version
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productsStore = db.createObjectStore('products', { keyPath: 'groupId' })
          productsStore.createIndex('category', 'category.name', { multiEntry: true })
          productsStore.createIndex('brand', 'brand.name')
          productsStore.createIndex('color', 'mainProduct.attributes.color')
          productsStore.createIndex('size', 'mainProduct.attributes.size')
          productsStore.createIndex('price', 'mainProduct.price')
          productsStore.createIndex('createdAt', 'mainProduct.createdAt')
          productsStore.createIndex('updatedAt', 'mainProduct.updatedAt')
          productsStore.createIndex('categoryPath', 'categoryPath', { multiEntry: true })
        }

        // Categories store
        if (!db.objectStoreNames.contains('categories')) {
          const categoriesStore = db.createObjectStore('categories', { keyPath: 'id' })
          categoriesStore.createIndex('parentId', 'parentId')
          categoriesStore.createIndex('level', 'level')
          categoriesStore.createIndex('slug', 'slug')
          categoriesStore.createIndex('path', 'path', { multiEntry: true })
        }

        // Filter options store
        if (!db.objectStoreNames.contains('filterOptions')) {
          const filterStore = db.createObjectStore('filterOptions', { keyPath: 'key' })
        }

        // Cache metadata store
        if (!db.objectStoreNames.contains('cacheMeta')) {
          db.createObjectStore('cacheMeta', { keyPath: 'key' })
        }

        // Session data store
        if (!db.objectStoreNames.contains('sessionData')) {
          db.createObjectStore('sessionData', { keyPath: 'key' })
        }
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }

      request.onerror = (event) => {
        reject(event.target.error)
      }
    })
  }

  async get(storeName, key) {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAll(storeName, indexName = null, query = null) {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const source = indexName ? store.index(indexName) : store
      
      const request = query ? source.getAll(query) : source.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async put(storeName, data) {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async putAll(storeName, items) {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      items.forEach(item => {
        if (item) store.put(item)
      })
      
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async delete(storeName, key) {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clear(storeName) {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async count(storeName, indexName = null, query = null) {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const source = indexName ? store.index(indexName) : store
      
      const request = query ? source.count(query) : source.count()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Cache specific methods
  async getCacheMeta(key) {
    return this.get('cacheMeta', key)
  }

  async setCacheMeta(key, value) {
    return this.put('cacheMeta', {
      key,
      value,
      timestamp: Date.now(),
      expires: Date.now() + (5 * 60 * 1000) // 5 minutes TTL
    })
  }

  async clearExpiredCache() {
    const allCache = await this.getAll('cacheMeta')
    const now = Date.now()
    
    for (const cache of allCache) {
      if (cache.expires && cache.expires < now) {
        await this.delete('cacheMeta', cache.key)
      }
    }
  }

  // Session specific methods
  async getSession(key) {
    return this.get('sessionData', key)
  }

  async setSession(key, value) {
    return this.put('sessionData', {
      key,
      value,
      timestamp: Date.now()
    })
  }

  async clearAll() {
    await Promise.all([
      this.clear('products'),
      this.clear('categories'),
      this.clear('filterOptions'),
      this.clear('cacheMeta'),
      this.clear('sessionData')
    ])
  }
}