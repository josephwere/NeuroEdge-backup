type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

class ChatContext {
  private messages: ChatMessage[] = [];

  add(message: ChatMessage) {
    this.messages.push(message);
    localStorage.setItem("neuroedge_chat_context", JSON.stringify(this.messages));
  }

  load() {
    const saved = localStorage.getItem("neuroedge_chat_context");
    if (saved) this.messages = JSON.parse(saved);
  }

  getAll() {
    return this.messages;
  }

  clear() {
    this.messages = [];
    localStorage.removeItem("neuroedge_chat_context");
  }
}

export const chatContext = new ChatContext();
chatContext.load();
