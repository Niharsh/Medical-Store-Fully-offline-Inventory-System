// Test to verify wholesaler context logic works correctly
// This simulates what happens when addWholesaler is called

// Simulate localStorage
const storage = {};
const mockLocalStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, value) => {
    storage[key] = value;
  },
  removeItem: (key) => {
    delete storage[key];
  },
};

const WHOLESALERS_STORAGE_KEY = "inventory_wholesalers";

// Simulate state
let wholesalers = [];
let selectedWholesalerId = null;
let renderCount = 0;

// Simulate component render
function render(label) {
  renderCount++;
  console.log(`\n🔄 Render #${renderCount} - ${label}`);
  console.log(
    `  - wholesalers:`,
    wholesalers.map((w) => ({ id: w.id, name: w.name })),
  );
  console.log(`  - selectedWholesalerId:`, selectedWholesalerId);
  const selectedWholesaler = wholesalers.find(
    (w) => w.id === selectedWholesalerId,
  );
  console.log(
    `  - selectedWholesaler:`,
    selectedWholesaler
      ? { id: selectedWholesaler.id, name: selectedWholesaler.name }
      : null,
  );
}

// Simulate saveWholesalers
function saveWholesalers(data) {
  console.log(`\n💾 saveWholesalers called`);
  mockLocalStorage.setItem(WHOLESALERS_STORAGE_KEY, JSON.stringify(data));
  console.log(`  - Saved ${data.length} wholesalers to localStorage`);
  wholesalers = data;
  render("After saveWholesalers");
}

// Simulate addWholesaler
function addWholesaler(name, contactNumber = "") {
  const newWholesaler = {
    id: Date.now().toString(),
    name: name.trim(),
    contactNumber: contactNumber.trim(),
    createdAt: new Date().toISOString(),
  };
  const updated = [...wholesalers, newWholesaler];
  console.log(`\n🏢 addWholesaler called with:`, { name, contactNumber });
  console.log(`  - Old wholesalers:`, wholesalers.length);
  console.log(`  - New wholesaler object:`, {
    id: newWholesaler.id,
    name: newWholesaler.name,
  });
  console.log(`  - Updated wholesalers array will have:`, updated.length);

  saveWholesalers(updated);
  return newWholesaler;
}

// Simulate component handleSubmit
function handleSubmit(name, contactNumber) {
  console.log(`\n📝 handleSubmit called with:`, { name, contactNumber });

  const newWholesaler = addWholesaler(name, contactNumber);
  console.log(`  ✅ New wholesaler created:`, {
    id: newWholesaler.id,
    name: newWholesaler.name,
  });
  console.log(`  📝 Setting selectedWholesalerId to:`, newWholesaler.id);

  selectedWholesalerId = newWholesaler.id;
  render("After setSelectedWholesalerId");

  // Check if dropdown would show the selection
  const matchingOption = wholesalers.find((w) => w.id === selectedWholesalerId);
  console.log(`\n🎯 Dropdown check:`);
  console.log(`  - selectedWholesalerId:`, selectedWholesalerId);
  console.log(`  - Matching option found:`, !!matchingOption);
  console.log(
    `  - Dropdown would show:`,
    matchingOption ? matchingOption.name : "NOTHING SELECTED",
  );
}

// Test
console.log("=== TESTING WHOLESALER LOGIC ===\n");
render("Initial state");

handleSubmit("Supplier A", "1234567890");
handleSubmit("Supplier B", "9876543210");

console.log("\n=== FINAL STATE ===");
console.log("wholesalers:", wholesalers);
console.log("selectedWholesalerId:", selectedWholesalerId);
console.log("localStorage:", storage[WHOLESALERS_STORAGE_KEY]);
