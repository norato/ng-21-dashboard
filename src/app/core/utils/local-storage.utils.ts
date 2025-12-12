interface PersistedState<T> {
  data: T;
  timestamp: number;
}

const TTL_MS = 30 * 60 * 1000; // 30 minutes

export const STORAGE_KEYS = {
  USER_STATE: 'userState',
  POSTS_STATE: 'postsState',
} as const;

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const persisted: PersistedState<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(persisted));
  } catch (error) {
    console.warn(`Error saving ${key} to localStorage:`, error);
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    const persisted: PersistedState<T> = JSON.parse(item);
    const isValid = Date.now() - persisted.timestamp < TTL_MS;

    if (!isValid) {
      localStorage.removeItem(key);
      return null;
    }

    return persisted.data;
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage:`, error);
    localStorage.removeItem(key);
    return null;
  }
}

export function clearFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error clearing ${key} from localStorage:`, error);
  }
}

export function getDataAge(key: string): number | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    const persisted: PersistedState<unknown> = JSON.parse(item);
    return Date.now() - persisted.timestamp;
  } catch {
    return null;
  }
}
