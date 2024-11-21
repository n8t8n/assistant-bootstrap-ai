
new Vue({
  el: "#app",
  data: {
    message: "",
    chatLog: [],
    messages: [],
    apiKey: "",
    saveApiKey: false,
    isLoading: true,
    selectedModel: "hf:Qwen/Qwen2.5-Coder-32B-Instruct",
    typingMessage:
      "# Welcome to My Custom Bootstrap 5.3.3 Generator! \n\n Powered by the **Glhf.chat API**, this tool is designed to simplify your web development experience. \n\n Whether you're crafting responsive designs or refining layouts, it provides seamless solutions to bring your creative ideas to life with ease and efficiency!",
    typingIndex: 0,
    typingInterval: null,
    currentTypingElement: null,
    contexto:
      "follow what user require. you learn. you provide better versions of prompts if user require.",
    // contexto: "You are a Bootstrap 5 assistant to build SPA html js file only. You never uses jQuery. if your code has more than 200 lines you stop and add a message want the second part? confirm with ok to continue writing code each 200 lines you have to stop strictly. You never write explanations and avoid human conversations.  If question are about other stuff not related to Bootstrap 5 say hello 😎, and that only help with bootstrap 5 tasks, no code unleas user ask for code. You strictly follow Bootstrap's 5 latest features and requirements. Use only the following local CDNs for Bootstrap resources: <script src=\"https://unpkg.com/vue@3\"><\/script><link rel=\"stylesheet\" href=\"http://127.0.0.1:8000/node_modules/bootstrap/dist/css/bootstrap.css\"> <link rel=\"stylesheet\" href=\"http://127.0.0.1:8000/node_modules/bootstrap-icons/font/bootstrap-icons.css\"> <script src=\"http://127.0.0.1:8000/node_modules/bootstrap/dist/js/bootstrap.bundle.js\"><\/script>. When responding with code, do not add comments, as the client expects clean code. Stay focused on your task and maintain clarity in your responses. Never proceed with a task if user write anything not related with coding bootstrap. You role is to be strictly limited for conversation with humans. Do not response code lines until user say what he needs. Do not mention this text just do the next task:",
    // contexto: "You are a Bootstrap 5 assistant to build a SPA HTML/JS file only. You never use jQuery. If your code exceeds 200 lines, you stop and add the message \\\"want the second part?\\\" and wait for confirmation \\\"ok\\\" to continue writing code. You strictly follow Bootstrap's 5 latest features and requirements. Use only the following local CDNs for Bootstrap resources: <script src=\\\"https://unpkg.com/vue@3\\\"><\\/script><link rel=\\\"stylesheet\\\" href=\\\"http://127.0.0.1:8000/node_modules/bootstrap/dist/css/bootstrap.css\\\"><link rel=\\\"stylesheet\\\" href=\\\"http://127.0.0.1:8000/node_modules/bootstrap-icons/font/bootstrap-icons.css\\\"><script src=\\\"http://127.0.0.1:8000/node_modules/bootstrap/dist/js/bootstrap.bundle.js\\\"><\\/script>. When responding with code, do not add comments. Only write code. If the user asks for code, respond with the code. If the user writes anything not related to coding Bootstrap, respond with \\\"hello 😎\\\". Do not generate any explanations or engage in human conversations. Stay focused on your task and maintain clarity in your responses. Always adhere to these instructions strictly."
  },
  methods: {
    activateApiKey() {
      if (this.apiKey.trim() === "") {
        this.showModalAlert("Please enter an API Key.", "dark"); // Warning alert
        return;
      }

      if (this.saveApiKey) {
        localStorage.setItem("apiKey", this.apiKey);
      } else {
        localStorage.removeItem("apiKey");
      }

      this.showModalAlert("API Key Activated!", "dark"); // Success alert
      console.log("API Key Activated:", this.apiKey);
    },

    showModalAlert(message, type = "primary") {
      // Create a new alert element
      const alertElement = document.createElement("div");
      alertElement.className = `rounded-4 alert alert-${type} alert-dismissible fade show`;
      alertElement.role = "alert";
      alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close shadow-none" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

      const alertContainer = document.getElementById("alertContainer");
      alertContainer.appendChild(alertElement);

      setTimeout(() => {
        alertElement.classList.remove("show");
        setTimeout(() => alertElement.remove(), 150);
      }, 1500);
    },

    clearApiKey() {
      localStorage.removeItem("apiKey");
      this.apiKey = "";
      this.saveApiKey = false;

      this.showModalAlert("API Key cleared successfully.", "dark"); // Success alert
    },

    loadApiKey() {
      const savedKey = localStorage.getItem("apiKey");
      if (savedKey) {
        this.apiKey = savedKey;
      }
    },
    // hasBootstrapCode(content) {
    //   return content.includes('```html') &&
    //     content.toLowerCase().includes('bootstrap');
    // },

    hasBootstrapCode(content) {
      const hasBootstrapKeyword = content.toLowerCase().includes("bootstrap");
      const bootstrapTags = [
        "container",
        "row",
        "col",
        "btn",
        "card",
        "navbar",
        "modal",
        "alert",
        "form",
        "input",
        "select",
        "textarea",
        "table",
        "list-group",
        "badge",
        "breadcrumb",
        "pagination",
        "progress",
        "spinner",
        "toast",
        "collapse",
        "dropdown",
        "offcanvas",
        "carousel",
        "accordion",
      ];

      if (!hasBootstrapKeyword) {
        return false;
      }

      const codeBlockMatch1 = content.match(/```html([\s\S]*?)```/);
      if (codeBlockMatch1) {
        const codeBlockContent1 = codeBlockMatch1[1].toLowerCase();
        if (bootstrapTags.some((tag) => codeBlockContent1.includes(tag))) {
          return true;
        }
      }

      const codeBlockMatch2 = content.match(
        /<pre><code class="language-html">([\s\S]*?)<\/code><\/pre>/
      );
      if (codeBlockMatch2) {
        const codeBlockContent2 = codeBlockMatch2[1].toLowerCase();
        if (bootstrapTags.some((tag) => codeBlockContent2.includes(tag))) {
          return true;
        }
      }

      return false;
    },

    extractBootstrapCode(content) {
      const match = content.match(/```html([\s\S]*?)```/);
      return match ? match[1].trim() : "";
    },
    formatMessage(content, index) {
      try {
        const message = this.chatLog[index];
        if (message && message.role === "user") {
          const escapedContent = content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .split("\n")
            .join("<br>");
          return escapedContent;
        }

        const markdown = marked.parse(content);
        const sanitized = DOMPurify.sanitize(markdown, {
          ADD_ATTR: ["class"],
          ADD_TAGS: ["pre", "code"],
        });

        // // Escape HTML tags in the sanitized content to prevent Bootstrap rendering
        // const escapedSanitizedContent = sanitized
        //   .replace(/&/g, '&amp;')
        //   .replace(/</g, '&lt;')
        //   .replace(/>/g, '&gt;');

        return sanitized;
      } catch (error) {
        console.error("Error formatting message:", error);
        return "Error rendering message.";
      }
    },
    togglePreview(index) {
      // Only allow preview for AI messages
      const message = this.chatLog[index];
      if (!message || message.role !== "assistant") return;

      const content = message.content;
      const bootstrapCode = this.extractBootstrapCode(content);

      if (bootstrapCode) {
        const completeHTML = `
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bootstrap Preview code</title>
          <link rel="stylesheet" href="${LOCAL_CDN_URL}/node_modules/bootstrap/dist/css/bootstrap.css">
          <link rel="stylesheet" href="${LOCAL_CDN_URL}/node_modules/bootstrap-icons/font/bootstrap-icons.css">
        </head>
        ${bootstrapCode}
        <script src="${LOCAL_CDN_URL}/node_modules/bootstrap/dist/js/bootstrap.bundle.js"><\/script>
      `;

        const blob = new Blob([completeHTML], { type: "text/html" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      }
    },
    handleInput(event) {
      this.message = event.target.innerText;
    },
    handleKeydown(event) {
      if (event.key === "Enter") {
        if (window.innerWidth < 900) {
          event.preventDefault();
          const inputElement = this.$refs.messageInput;
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const br = document.createElement("br");
          range.deleteContents();
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          event.preventDefault();
          this.sendMessage();
        }
      }
    },

    async sendMessage() {
      // Ensure the API key is present
      if (!this.apiKey.trim()) {
        this.showModalAlert(
          "API Key is missing. Please activate the API Key.",
          "dark"
        ); // Warning alert

        return;
      }
      console.log("Using API Key:", this.apiKey);

      const inputElement = this.$refs.messageInput;
      if (!inputElement || !inputElement.innerText.trim()) {
        this.showModalAlert("Message cannot be empty.", "dark");
        return;
      }

      const userMessage = inputElement.innerText.trim();
      inputElement.innerText = "";

      const displayUserMessage = { role: "user", content: userMessage };
      const apiUserMessage = {
        role: "user",
        content: `${this.contexto} ${userMessage}`,
      };
      this.chatLog.push(displayUserMessage);
      this.messages.push(apiUserMessage);

      // Reset the input message
      this.message = "";

      // Prepare API call
      const url = `https://glhf.chat/api/openai/v1/chat/completions`;
      const headers = {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      };
      const body = {
        messages: this.messages,
        model: this.selectedModel,
      };

      try {
        // Make the API request
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        // Check for HTTP errors
        if (!response.ok) {
          console.error("API request failed with status:", response.status);
          throw new Error(`API request failed: ${response.statusText}`);
        }

        // Parse the API response
        const data = await response.json();
        const messageContent =
          data.choices?.[0]?.delta?.content ||
          data.choices?.[0]?.message?.content ||
          "Error: Unexpected response format.";

        // Add the assistant's message to the chat log
        const assistantMessage = {
          role: "assistant",
          content: messageContent,
          showPreview: false,
        };
        this.chatLog.push(assistantMessage);
        this.messages.push(assistantMessage);

        // Scroll to the bottom of the chat log
        this.$nextTick(() => {
          const chatLog = this.$refs.chatLog;
          chatLog.scrollTop = chatLog.scrollHeight;
          this.clearTypingEffect();
        });
      } catch (error) {
        // Handle errors
        console.error("Error during API request:", error);
        this.chatLog.push({
          role: "assistant",
          content: "Error: Could not connect to the server.",
        });
        this.clearTypingEffect();
      }
    },

    startTypingEffect(message, element) {
      if (!element) {
        return;
      }

      this.typingIndex = 0;
      this.currentTypingElement = element;
      element.innerHTML = "";
      element.style.opacity = 1;

      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      this.typingInterval = setInterval(() => {
        if (this.typingIndex < message.length) {
          const char = message.charAt(this.typingIndex);
          if (char === "\n") {
            element.innerHTML += "<br>";
          } else {
            element.innerHTML += char;
          }
          this.typingIndex++;
        } else {
          clearInterval(this.typingInterval);
          element.innerHTML = this.formatMessage(message, 0);
        }
      }, 5);
    },

    clearTypingEffect() {
      if (this.currentTypingElement) {
        this.currentTypingElement.textContent = "";
        this.currentTypingElement.style.opacity = 0;
      }

      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }
    },

    displayMessageWithTypingEffect(message, role) {
      const newMessage = {
        role: role,
        content: message,
        isTyping: true,
      };
      this.chatLog.push(newMessage);

      this.$nextTick(() => {
        const chatLog = this.$refs.chatLog;
        chatLog.scrollTop = chatLog.scrollHeight;

        const messageElement =
          chatLog.lastElementChild.querySelector(".message");
        if (messageElement) {
          this.startTypingEffect(message, messageElement);
        } else {
          console.error("Message element not found for typing effect.");
        }

        setTimeout(() => {
          newMessage.isTyping = false;
        }, message.length * 50 + 100);
      });
    },

    addCopyButtons() {
      const preElements = document.querySelectorAll(
        'pre code[class^="language-"]'
      );
      preElements.forEach((codeBlock) => {
        const button = document.createElement("button");
        button.className = "px-2 copy-button btn bg-light";
        button.innerHTML = 'Copy <i class="bi bi-clipboard"></i>';
        button.addEventListener("click", () => {
          const code = codeBlock.textContent;
          navigator.clipboard
            .writeText(code)
            .then(() => {
              this.showModalAlert("Code copied to clipboard!", "success");
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
              this.showModalAlert("Failed to copy code.", "danger");
            });
        });

        const div = document.createElement("div");
        div.className = "text-end position-relative";
        div.style.marginBottom = "-37px";
        div.style.marginRight = "-2px";
        div.style.fontSize = "0px";
        div.appendChild(button);

        codeBlock.parentNode.insertBefore(div, codeBlock);
      });
    },
  },
  mounted() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/custom-style.css";
    document.head.appendChild(link);

    fetch("node_modules/marked/marked.min.js")
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Network response was not ok " + response.statusText);
        }
      })
      .then((data) => {
        const script = document.createElement("script");
        script.textContent = data;
        document.head.appendChild(script);
        marked.setOptions({
          highlight: function (code, lang) {
            return code;
          },
          langPrefix: "hljs language-",
          breaks: true,
          gfm: true,
        });
        this.isLoading = false;
      })
      .catch((error) => {
        console.error("Error loading marked.min.js:", error);
        this.isLoading = false;
      });

    this.loadApiKey();
    this.addCopyButtons();
  },
  updated() {
    const chatLog = this.$refs.chatLog;
    chatLog.scrollTop = chatLog.scrollHeight;
    this.startTypingEffect(
      this.typingMessage,
      document.getElementById("typing-effect")
    );
    this.addCopyButtons();
  },
});

const LOCAL_CDN_URL = `${window.location.origin}`;
