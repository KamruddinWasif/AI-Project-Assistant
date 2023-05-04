const projectTypeInput = document.getElementById("projectType");
const apiKeyInput = document.getElementById("apiKey");
const generateBtn = document.getElementById("generateBtn");
const outputDiv = document.getElementById("output");

generateBtn.addEventListener("click", async () => {
    const projectType = projectTypeInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (!projectType || !apiKey) {
        alert("Please fill in the project type and API key fields.");
        return;
    }

    outputDiv.textContent = "Generating content...";
    const prompts = [
        `Give me 10 ideas for this ${projectType}`,
        "which of these do you think would be most successful in the marketplace",
        "okay, please ask me ten questions that would help clarify my needs for this project",
        "please provide the best possible answers to these questions",
        "based on these answers please write an outline for this project",
        "please execute all the steps of the outline",
        "please review your work for each step of the outline to see if meets the expectations for this project and is correctly completed."
    ];

    try {
        let previousOutput = "";
        for (const prompt of prompts) {
            const result = await fetchGptResponse(prompt, apiKey, previousOutput);
            previousOutput = result;
            outputDiv.textContent += `\n\n${prompt}\n\n${result}`;
        }
    } catch (error) {
        console.error(error);
        outputDiv.textContent = "An error occurred while generating content. Please check your API key and try again.";
    }
});

async function fetchGptResponse(prompt, apiKey, previousOutput) {
    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt: `${previousOutput}\n\n${prompt}`,
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 1
        })
    });

    if (!response.ok) {
        throw new Error("Failed to fetch GPT response");
    }

    const data = await response.json();
    return data.choices[0].text.trim();
}
