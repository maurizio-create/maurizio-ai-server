// avatar.js
async function createAvatar(options) {
    const containerId = options.container || "maurizio-avatar";
    const knowledgeUrl = options.knowledge;
    const personalityUrl = options.personality;
    const greeting = options.greeting || "Hi! Ask me about guitar lessons!";
    const styles = options.styles || {};

    // Create avatar container
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Apply basic styles
    container.style.position = "relative";
    container.style.maxWidth = "600px";
    container.style.margin = "20px auto";
    container.style.padding = styles.padding || "10px";
    container.style.backgroundColor = styles.bubbleColor || "#fff";
    container.style.border = styles.bubbleBorder || "1px solid #ccc";
    container.style.borderRadius = styles.bubbleBorderRadius || "8px";
    container.style.fontSize = styles.fontSize || "16px";
    container.style.lineHeight = styles.lineHeight || "1.5";
    container.style.color = styles.textColor || "#333";
    container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";

    // Add greeting
    const message = document.createElement("p");
    message.textContent = greeting;
    container.appendChild(message);

    // Fetch knowledge & personality
    let knowledge = "";
    let personality = "";
    try {
        const kResp = await fetch(knowledgeUrl);
        knowledge = await kResp.text();
    } catch(e) { console.warn("Failed to load knowledge:", e); }

    try {
        const pResp = await fetch(personalityUrl);
        personality = await pResp.text();
    } catch(e) { console.warn("Failed to load personality:", e); }

    // Simple demo responses (can be expanded)
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Ask Maurizio about guitar...";
    input.style.width = "100%";
    input.style.marginTop = "10px";
    input.style.padding = "8px";
    input.style.borderRadius = "4px";
    input.style.border = "1px solid #ccc";

    container.appendChild(input);

    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            const userQuestion = input.value.trim();
            if (!userQuestion) return;

            const response = generateResponse(userQuestion, knowledge, personality);
            const reply = document.createElement("p");
            reply.textContent = response;
            reply.style.marginTop = "8px";
            reply.style.fontStyle = "italic";
            container.appendChild(reply);
            input.value = "";
            container.scrollTop = container.scrollHeight;
        }
    });

    // Basic response function
    function generateResponse(question, knowledgeText, personalityText) {
        // Very simple demo: just echoes knowledge and personality in context
        if (question.toLowerCase().includes("lesson")) {
            return "I teach pop songs, old and new, along with songwriting and improvisation.";
        }
        if (question.toLowerCase().includes("guitar")) {
            return "I love sharing guitar techniques—fingerstyle, blues, folk, and expressive phrasing.";
        }
        return personalityText.split("\n")[0] || "Let's talk music!";
    }
}