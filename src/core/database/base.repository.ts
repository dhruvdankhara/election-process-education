import { db, admin } from "./firestore.server";

export interface BaseEntity {
  id?: string;
  createdAt?: admin.firestore.Timestamp | Date;
  updatedAt?: admin.firestore.Timestamp | Date;
}

type StoredEntity = BaseEntity & Record<string, unknown>;

export class BaseRepository<T extends BaseEntity> {
  protected collectionName: string;
  private static readonly inMemoryCollections = new Map<string, Map<string, StoredEntity>>();

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private get memoryCollection() {
    const existing = BaseRepository.inMemoryCollections.get(this.collectionName);
    if (existing) {
      return existing;
    }
    const created = new Map<string, StoredEntity>();
    BaseRepository.inMemoryCollections.set(this.collectionName, created);
    return created;
  }

  protected get collection() {
    return db ? db.collection(this.collectionName) : null;
  }

  private asEntity(record: StoredEntity): T {
    return record as unknown as T;
  }

  protected async listAll(): Promise<T[]> {
    const collection = this.collection;
    if (collection) {
      const snapshot = await collection.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
    }

    return Array.from(this.memoryCollection.values()).map((item) => this.asEntity({ ...item }));
  }

  protected async findOneByField<K extends keyof T>(field: K, value: T[K]): Promise<T | null> {
    const key = String(field);
    const collection = this.collection;
    if (collection) {
      const snapshot = await collection.where(key, "==", value).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as T;
    }

    for (const item of this.memoryCollection.values()) {
      if (item[key] === value) {
        return this.asEntity({ ...item });
      }
    }

    return null;
  }

  protected async findManyByField<K extends keyof T>(field: K, value: T[K]): Promise<T[]> {
    const key = String(field);
    const collection = this.collection;
    if (collection) {
      const snapshot = await collection.where(key, "==", value).get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
    }

    return Array.from(this.memoryCollection.values())
      .filter((item) => item[key] === value)
      .map((item) => this.asEntity({ ...item }));
  }

  async findById(id: string): Promise<T | null> {
    const collection = this.collection;
    if (collection) {
      const doc = await collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as T;
    }

    const data = this.memoryCollection.get(id);
    return data ? this.asEntity({ ...data }) : null;
  }

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">, customId?: string): Promise<T> {
    const collection = this.collection;
    if (collection) {
      const now = admin.firestore.FieldValue.serverTimestamp();
      const docData = { ...data, createdAt: now, updatedAt: now };

      let docRef;
      if (customId) {
        docRef = collection.doc(customId);
        await docRef.set(docData);
      } else {
        docRef = await collection.add(docData);
      }

      const savedDoc = await docRef.get();
      return { id: savedDoc.id, ...savedDoc.data() } as T;
    }

    const id = customId ?? crypto.randomUUID();
    const now = new Date();
    const docData = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    } as T;
    this.memoryCollection.set(id, docData as StoredEntity);
    return this.asEntity({ ...docData } as StoredEntity);
  }

  async update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
  ): Promise<T | null> {
    const collection = this.collection;
    if (collection) {
      const docRef = collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) return null;

      const now = admin.firestore.FieldValue.serverTimestamp();
      await docRef.update({ ...data, updatedAt: now });

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as T;
    }

    const existing = this.memoryCollection.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date(),
    } as StoredEntity;
    this.memoryCollection.set(id, updated);
    return this.asEntity({ ...updated });
  }

  async delete(id: string): Promise<boolean> {
    const collection = this.collection;
    if (collection) {
      const docRef = collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) return false;

      await docRef.delete();
      return true;
    }

    return this.memoryCollection.delete(id);
  }
}
