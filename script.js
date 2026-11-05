const finder = document.getElementById("finder");
const plots = [...document.querySelectorAll(".plot")];
const count = document.getElementById("result-count");
const empty = document.getElementById("empty");
const street = document.getElementById("street");
const homes = document.getElementById("homes");

function applySearch() {
  const { region, type, budget } = Object.fromEntries(new FormData(finder));
  const [min, max] = budget ? budget.split("-").map(Number) : [0, Infinity];
  let shown = 0;

  for (const plot of plots) {
    const price = Number(plot.dataset.price);
    const match =
      (!region || plot.dataset.region === region) &&
      (!type || plot.dataset.type === type) &&
      price >= min &&
      price < max;
    plot.hidden = !match;
    if (match) shown += 1;
  }

  count.textContent = shown === 1 ? "1 property" : `${shown} properties`;
  street.hidden = shown === 0;
  empty.hidden = shown !== 0;
}

finder.addEventListener("submit", (event) => {
  event.preventDefault();
  applySearch();
  homes.scrollIntoView();
});

document.getElementById("clear").addEventListener("click", () => {
  finder.reset();
  applySearch();
});

// Booking form: the property list comes from the listings above.
const form = document.getElementById("viewing-form");
const property = document.getElementById("property");
const sent = document.getElementById("sent");

for (const plot of plots) {
  property.add(new Option(plot.dataset.name, plot.dataset.name));
}

for (const link of document.querySelectorAll("[data-book]")) {
  link.addEventListener("click", () => {
    property.value = link.closest(".plot").dataset.name;
    sent.hidden = true;
  });
}

const messages = {
  name: "Enter your name.",
  email: "Enter an email address, like name@example.com.",
  property: "Choose a property.",
};

function checkField(field) {
  const message = field.validity.valid ? "" : messages[field.name];
  form.querySelector(`[data-for="${field.name}"]`).textContent = message;
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, select")];
  const results = fields.map(checkField);

  if (results.includes(false)) {
    fields[results.indexOf(false)].focus();
    sent.hidden = true;
    return;
  }

  sent.textContent = `This is a concept site, so nothing was sent. On a live site, your request for ${property.value} would go to an agent.`;
  sent.hidden = false;
  form.reset();
});
