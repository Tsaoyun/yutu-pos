const STORAGE_KEY = "yutu-pos-state-v1";

export function loadState(fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn("[YUTU POS] localStorage read failed; using fallback state.", error);
    return fallback;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn("[YUTU POS] localStorage write failed.", error);
    return false;
  }
}

export { STORAGE_KEY };
