function setupInstructions() {
    const instructions = [];

    for (const key in instructionDefinitions) {
        const value = instructionDefinitions[key];

        const slash = key.lastIndexOf("/");
        const category = key.substring(0, slash);

        // TODO
        if (category != "Base-Instructions") {
            continue;
        }

        const path = "docs/" + key.substring(slash + 1) + ".html";
        const name = value.substring(0, value.indexOf(":"));
        const lowercaseName = name.toLowerCase();

        instructions.push({
            name,
            path,
            lowercaseName,
            category,
        });
    }

    instructions.sort((a, b) => {
        const nameA = a.lowercaseName;
        const nameB = b.lowercaseName;

        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }
    
        return 0;
    });

    let previousSelected = undefined;

    const instructionsElement = document.getElementById("instructions");
    for (const instruction of instructions) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const a = document.createElement("a");
        const text = document.createTextNode(instruction.name);

        a.href = instruction.path;
        a.target = "instruction-description";
        
        a.addEventListener("click", () => {
            if (previousSelected) {
                previousSelected.classList.remove("currentlySelected");
            }
            previousSelected = a;
            previousSelected.classList.add("currentlySelected");
        });

        tr.appendChild(td);
        td.appendChild(a);
        a.appendChild(text);
        instructionsElement.appendChild(tr);

        instruction.element = tr;
    }

    return instructions;
}

const instructions = setupInstructions();
const searchBox = document.getElementById("search-box");

searchBox.oninput = () => {
    const text = searchBox.value.toLowerCase().trim();

    for (const instruction of instructions) {
        if (instruction.lowercaseName.includes(text)) {
            instruction.element.style.display = ""; 
        } else {
            instruction.element.style.display = "none"; 
        }
    }
};