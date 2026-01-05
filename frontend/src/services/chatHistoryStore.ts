// frontend/src/services/chatHistoryStore.ts

export interface ChatRecord {
  id: string;
  title: string;
  messages: string[];
  createdAt: number;
  tags?: string[];
}

const STORAGE_KEY = "neuroedge_chat_history";

function load(): ChatRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(data: ChatRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const ChatHistoryStore = {
  getAll(): ChatRecord[] {
    return load().sort((a, b) => b.createdAt - a.createdAt);
  },

  add(record: ChatRecord) {
    const data = load();
    data.push(record);
    save(data);
  },

  remove(id: string) {
    save(load().filter(r => r.id !== id));
  },

  search(query: string): ChatRecord[] {
    const q = query.toLowerCase();
    return load().filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.messages.some(m => m.toLowerCase().includes(q))
    );
  },
};
