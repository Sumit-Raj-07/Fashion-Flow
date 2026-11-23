// =====================================================
// PERSON 1 - Data, shared helpers, Home page, dashboard opening, and start-up
// =====================================================

// ---------- Users (hard-coded for the demo) ----------
const users = [
  { username: "designer",   password: "1234", role: "designer",   name: "Designer" },
  { username: "client",     password: "1234", role: "client",     name: "Client" },
  { username: "production", password: "1234", role: "production", name: "Production Manager" }
];

// ---------- Sample designs (used the first time the site opens) ----------
// today's date as text, used in comments and history
function today() {
  return new Date().toLocaleDateString();
}

const sampleDesigns = [
  { id: 1, title: "Summer Wrap Dress", image: "sketches/dress.svg", fabric: "Cotton Linen", color: "#e8b4a0",
    notes: "Light and flowy for summer.", status: "Pending Client Review", version: 1,
    comments: [],
    history: ["v1 created and sent to client (" + today() + ")"] },

  { id: 2, title: "Tailored Blazer", image: "sketches/jacket.svg", fabric: "Wool Blend", color: "#3b3b4f",
    notes: "Two buttons, structured shoulders.", status: "Pending Client Review", version: 1,
    comments: [],
    history: ["v1 created and sent to client (" + today() + ")"] },

  { id: 3, title: "Classic Shirt", image: "sketches/shirt.svg", fabric: "Poplin Cotton", color: "#ffffff",
    notes: "Slim fit office shirt.", status: "Approved by Client", version: 1,
    comments: [{ by: "Client", text: "Looks great, approved!", date: today() }],
    history: ["v1 created and sent to client (" + today() + ")", "Approved by Client (" + today() + ")"] },

  { id: 4, title: "Straight Trousers", image: "sketches/trousers.svg", fabric: "Twill", color: "#8b7355",
    notes: "High waist, straight leg.", status: "Changes Requested", version: 1,
    comments: [{ by: "Client", text: "Please make the legs a bit wider.", date: today() }],
    history: ["v1 created and sent to client (" + today() + ")", "Client asked for changes (" + today() + ")"] },

  { id: 5, title: "A-Line Skirt", image: "sketches/skirt.svg", fabric: "Crepe", color: "#6b8e7f",
    notes: "Knee length, still deciding the fabric.", status: "Draft", version: 1,
    comments: [],
    history: ["v1 saved as draft (" + today() + ")"] }
];

// ---------- Saved data (kept in the browser's localStorage) ----------
let designs = JSON.parse(localStorage.getItem("fashionDesigns")) || sampleDesigns;
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// saves the designs so they are still there after refreshing the page
function saveDesigns() {
  localStorage.setItem("fashionDesigns", JSON.stringify(designs));
}

// ---------- Shared helpers (used by all three persons) ----------

// finds one design using its id
function findDesign(id) {
  return designs.find(d => d.id === id);
}

// adds a line to the version history of a design
function addHistory(d, text) {
  d.history.push(text + " (" + today() + ")");
}

// adds a comment written by the logged-in user
function addComment(d, text) {
  d.comments.push({ by: currentUser.name, text: text, date: today() });
}

// decides which stage a design belongs to: Draft, Review or Approved
function stageOf(status) {
  if (status === "Draft") return "Draft";
  if (status === "Pending Client Review" || status === "Changes Requested") return "Review";
  return "Approved";
}

// ---------- Showing pages ----------

// shows one page (home, login or dashboard) and hides the others
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ---------- Home page ----------

// draws the sample sketch cards on the home page, then shows it
function showHome() {
  let html = "";
  // drafts are private, so they are not shown on the home page
  const visible = designs.filter(d => d.status !== "Draft").slice(0, 4);

  visible.forEach(d => {
    html += `
      <div class="card">
        <img src="${d.image}" alt="${d.title}">
        <div class="card-body">
          <h3>${d.title}</h3>
          <p class="fabric">${d.fabric}</p>
        </div>
      </div>`;
  });

  document.getElementById("homeGallery").innerHTML = html;
  showPage("home");
}

// ---------- Dashboard ----------

// opens the dashboard for whoever is logged in
function openDashboard() {
  document.getElementById("navLogin").classList.add("hidden");
  document.getElementById("navLogout").classList.remove("hidden");
  document.getElementById("welcome").innerText = "Welcome, " + currentUser.name;

  // only the designer sees the "add sketch" form
  document.getElementById("designerForm").classList.toggle("hidden", currentUser.role !== "designer");

  showPage("dashboard");
  refresh();
}

// draws the cards again using the code of the logged-in role
function refresh() {
  if (currentUser.role === "designer") renderDesigner();     // Person 2
  if (currentUser.role === "client") renderClient();         // Person 3
  if (currentUser.role === "production") renderProduction(); // Person 3
}

// ---------- Start the website ----------
// runs after all three JS files have loaded
window.onload = function () {
  if (currentUser) {
    openDashboard();
  } else {
    showHome();
  }
};
