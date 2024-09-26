function setupElements() {
    let currentHighlighted = null;
    let tooltip = null;

    function handleMouseMove(event) {
        // Remove highlight from the previously highlighted element
        if (currentHighlighted) {
            currentHighlighted.classList.remove("findpath");
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        }

        // Find the deepest element at the current mouse position
        let element = document.elementFromPoint(event.clientX, event.clientY);

        if (
            element &&
            element !== document.body &&
            element !== document.documentElement
        ) {
            element.classList.add("findpath");
            currentHighlighted = element;

            tooltip = document.createElement("div");
            tooltip.className = "css-path-tooltip";
            tooltip.textContent = getUniqueSelector(element);
            element.appendChild(tooltip);

            // Adjust tooltip position if it goes off-screen
            const rect = tooltip.getBoundingClientRect();
            if (rect.top < 0) {
                tooltip.style.top = "calc(100% + 5px)";
            }
            if (rect.right > window.innerWidth) {
                tooltip.style.left = "auto";
                tooltip.style.right = "0";
            }
        } else {
            currentHighlighted = null;
        }
    }

    // Add mousemove event listener to the document
    document.addEventListener("mousemove", handleMouseMove);
}

function getUniqueSelector(element) {
    if (!(element instanceof Element)) {
        throw new Error("Provided argument is not a valid DOM element.");
    }

    let selector = element.tagName.toLowerCase();

    // Include ID if it exists
    if (element.id) {
        selector += `#${element.id}`;
    }

    // Include classes if they exist
    if (element.className) {
        selector += `.${Array.from(element.classList).join(".")}`;
    }

    // Check for parent elements to ensure uniqueness
    let parent = element.parentElement;
    while (parent) {
        const sibling = Array.from(parent.children).filter(
            (child) => child !== element
        );
        if (sibling.length > 0) {
            selector = `${parent.tagName.toLowerCase()} > ${selector}`;
        }
        parent = parent.parentElement;
    }

    return selector;
}

function createTooltip() {
    tooltip = document.createElement("div");
    tooltip.id = "css-path-tooltip";
    document.body.appendChild(tooltip);
}

function positionTooltip(x, y, text) {
    tooltip.textContent = text;
    const rect = tooltip.getBoundingClientRect();
    let top = y - rect.height - 5;
    let left = x;

    if (top < 0) {
        top = y + 5;
    }
    if (left + rect.width > window.innerWidth) {
        left = window.innerWidth - rect.width - 5;
    }

    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
}

setupElements();
