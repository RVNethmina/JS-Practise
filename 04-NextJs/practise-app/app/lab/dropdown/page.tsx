import { getCategories } from "@/lib/db";
import Dropdown from "@/app/_components/Dropdown";

/* This page runs on the SERVER. It gets the categories from the database and
   hands them to Dropdown as a normal array.

   One thing to notice: we do NOT pass a function like onSelect.
   Functions can't be sent from the server to the browser (you saw that error
   back in Phase 3). So Dropdown just remembers the choice by itself. */

export default async function DropdownLabPage() {
    const categories = await getCategories();

    const items = categories.map((category) => ({
        id: category.id,
        label: category.name,
    }));

    return (
        <div>
            <h2>Dropdown — closing when you click outside</h2>

            <p>Open the menu, then try each of these:</p>
            <ol>
                <li>Click a menu item — it picks it and closes</li>
                <li>Click the button again — it closes</li>
                <li>Click the grey text at the bottom — it closes</li>
                <li>Press Escape — it closes</li>
            </ol>

            <Dropdown label="Choose a category" items={items} />

            <p style={{ marginTop: "2rem", color: "#888" }}>
                Click here. This is the click the page tells our component
                about, and the one that <code>contains()</code> says is NOT
                inside the dropdown — so the menu closes.
            </p>
        </div>
    );
}
