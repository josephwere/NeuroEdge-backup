export function createFloatingChatUI() {
  const container = document.createElement("div");
  container.id = "floating-chat-container";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.width = "350px";
  container.style.height = "500px";
  container.style.background = "#1e1e2f";
  container.style.color = "#fff";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 4px 16px rgba(0,0,0,0.5)";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.zIndex = "9999";
  container.style.fontFamily = "Arial, sans-serif";

  const header = document.createElement("div");
  header.innerText = "NeuroEdge Floating Chat";
  header.style.padding = "10px";
  header.style.fontWeight = "bold";
  header.style.background = "#2b2b3c";
  header.style.borderTopLeftRadius = "12px";
  header.style.borderTopRightRadius = "12px";

  const logArea = document.createElement("div");
  logArea.id = "floating-chat-log";
  logArea.style.flex = "1";
  logArea.style.padding = "10px";
  logArea.style.overflowY = "auto";
  logArea.style.fontSize = "12px";

  const input = document.createElement("input");
  input.id = "floating-chat-input";
  input.placeholder = "Type command, question or task...";
  input.style.padding = "10px";
  input.style.border = "none";
  input.style.outline = "none";
  input.style.background = "#2b2b3c";
  input.style.color = "#fff";
  input.style.borderBottomLeftRadius = "12px";
  input.style.borderBottomRightRadius = "12px";

  container.appendChild(header);
  container.appendChild(logArea);
  container.appendChild(input);
  document.body.appendChild(container);

  return { logArea, input };
}
