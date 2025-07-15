const searchBox = document.getElementById("searchBox");
const suggestionsList = document.getElementById("suggestions");

// Function to handle user input
function handleInput() {
    const input = searchBox.value.trim().toLowerCase();
    suggestionsList.innerHTML = "";

    if (input.length === 0) return;

    fetchSuggestions(input);
}

// Fetch word suggestions from Datamuse API
async function fetchSuggestions(query) {
    try {
        const response = await fetch(`https://api.datamuse.com/sug?s=${query}`);
        const data = await response.json();

        if (data.length > 0) {
            data.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item.word;
                li.onclick = () => {
                    searchBox.value = item.word;
                    suggestionsList.innerHTML = "";
                };
                suggestionsList.appendChild(li);
            });
        } else {
            fetchCorrections(query);
        }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}

// Fetch auto-correct suggestions if no exact match is found
async function fetchCorrections(query) {
    try {
        const response = await fetch(`https://api.datamuse.com/words?sp=${query}*`);
        const data = await response.json();

        if (data.length > 0) {
            const li = document.createElement("li");
            li.textContent = `Did you mean: ${data[0].word}?`;
            li.onclick = () => {
                searchBox.value = data[0].word;
                suggestionsList.innerHTML = "";
            };
            suggestionsList.appendChild(li);
        }
    } catch (error) {
        console.error("Error fetching corrections:", error);
    }
}

