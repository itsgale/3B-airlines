let selectedFlight = null;
let passengers = [];

const flights = [
    { id: "5J560", from: "Manila", to: "Cebu", time: "10:00 AM", price: 2500, type: "oneway", duration: "1h 15m", seats: 25, fare: "Promo Fare", terminal: "T3" },
    { id: "PR401", from: "Manila", to: "Davao", time: "12:30 PM", price: 3200, type: "oneway", duration: "1h 45m", seats: 18, fare: "Regular", terminal: "T2" },
    { id: "5J123", from: "Cebu", to: "Manila", time: "4:00 PM", price: 2400, type: "roundtrip", duration: "1h 10m", seats: 30, fare: "Promo Fare", terminal: "T3" },
    { id: "PR220", from: "Manila", to: "Bacolod", time: "6:45 AM", price: 2800, type: "roundtrip", duration: "1h 25m", seats: 20, fare: "Regular", terminal: "T1" }
];

function showSection(id, step) {
    console.log("Showing section: " + id + " at step: " + step);
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    updateProgress(step);
}

function updateProgress(step) {
    const steps = document.querySelectorAll(".step");
    const lines = document.querySelectorAll(".line");
    steps.forEach((s, index) => {
        if (index < step) {
            s.classList.add("active");
        } else {
            s.classList.remove("active");
        }
    });
    lines.forEach((l, index) => {
        if (index < step - 1) {
            l.classList.add("active");
        } else {
            l.classList.remove("active");
        }
    });
}

function toggleReturn() {
    const type = document.getElementById("type").value;
    console.log("Toggling return date for flight type: " + type);
    document.getElementById("returnDiv").classList.toggle("hidden", type === "oneway");
}

function searchFlights() {
    console.log("Attempting to search flights");

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const departDateValue = document.getElementById("depart").value;
    const type = document.getElementById("type").value;
    const passengersValue = document.getElementById("passengers").value.trim();
    const passengersCount = parseInt(passengersValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!from) {
        console.log("Validation failed: 'From' field is empty");
        alert("Please enter a departure city.");
        return;
    }
    if (!to) {
        console.log("Validation failed: 'To' field is empty");
        alert("Please enter a destination city.");
        return;
    }
    if (from.toLowerCase() === to.toLowerCase()) {
        console.log("Validation failed: 'From' and 'To' are the same");
        alert("'From' and 'To' cannot be the same city.");
        return;
    }

    const matchingFlights = flights.filter(f => f.type === type && f.from.toLowerCase() === from.toLowerCase() && f.to.toLowerCase() === to.toLowerCase());
    if (matchingFlights.length === 0) {
        const availableFrom = [...new Set(flights.filter(f => f.type === type).map(f => f.from))];
        const availableTo = [...new Set(flights.filter(f => f.type === type).map(f => f.to))];
        console.log("Validation failed: No flights match the entered 'From' and 'To' for type " + type);
        alert(`No flights available for the entered departure and destination. Please choose from the available options:\n\nDeparture Cities: ${availableFrom.join(", ")}\nDestination Cities: ${availableTo.join(", ")}`);
        return;
    }
    if (!departDateValue) {
        console.log("Validation failed: Depart date not selected");
        alert("Please select a departure date.");
        return;
    }
    const departDate = new Date(departDateValue);
    if (departDate < today) {
        console.log("Validation failed: Depart date is in the past");
        alert("Please select a departure date in the future.");
        return;
    }
    if (type === "roundtrip") {
        const returnDateValue = document.getElementById("return").value;
        if (!returnDateValue) {
            console.log("Validation failed: Return date not selected for roundtrip");
            alert("Please select a return date.");
            return;
        }
        const returnDate = new Date(returnDateValue);
        if (returnDate <= departDate) {
            console.log("Validation failed: Return date is not after depart date");
            alert("Please select a return date after the departure date.");
            return;
        }
    }
    if (!passengersValue) {
        console.log("Validation failed: Passengers field is blank");
        alert("Please enter the number of passengers.");
        return;
    }
    if (passengersCount < 1 || passengersCount > 50) {
        console.log("Validation failed: Invalid passenger count");
        alert("Number of passengers must be between 1 and 50.");
        return;
    }

    console.log("All booking validations passed. Searching flights for type: " + type);
    const list = document.getElementById("flightList");
    list.innerHTML = "";
    const available = flights.filter(f => f.type === type);

    if (available.length === 0) {
        console.log("No flights available for type: " + type);
        list.innerHTML = "<p>No flights available for the selected type.</p>";
    } else {
        console.log("Found " + available.length + " flights for type: " + type);
        available.forEach(f => {
            const div = document.createElement("div");
            div.className = "flight-card";
            div.innerHTML = `
        <strong>${f.id}</strong> - ${f.from} → ${f.to}<br>
        Time: ${f.time} | ₱${f.price} | ${f.duration}<br>
        Seats: ${f.seats} | Fare Type: ${f.fare} | Terminal: ${f.terminal}<br>
        <button onclick="selectFlight('${f.id}')">Select</button>
      `;
            list.appendChild(div);
        });
    }
    showSection("flights", 2);
}

function selectFlight(id) {
    console.log("Attempting to select flight with ID: " + id);
    selectedFlight = flights.find(f => f.id === id);
    if (!selectedFlight) {
        console.log("Validation failed: Flight not found");
        alert("Flight not found. Please try again.");
        return;
    }
    if (selectedFlight.seats <= 0) {
        console.log("Validation failed: No seats available for flight " + id);
        alert("No seats available for this flight.");
        return;
    }
    console.log("Flight selected successfully: " + selectedFlight.id);
    generatePassengerForms();
    showSection("passenger", 3);
}

function generatePassengerForms() {
    const count = parseInt(document.getElementById("passengers").value);
    console.log("Generating forms for " + count + " passengers");
    const form = document.getElementById("passengerForm");
    form.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const div = document.createElement("div");
        div.className = "passenger-card";
        div.innerHTML = `
      <h4>Passenger ${i}</h4>
      <div class="form-group">
        <label>Full Name:</label><input type="text" id="pname${i}" required>
      </div>
      <div class="form-group">
        <label>Age:</label><input type="number" id="page${i}" min="1" max="120" required>
      </div>
      <div class="form-group">
        <label>Gender:</label>
        <select id="pgender${i}" required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>
      <div class="form-group">
        <label>Contact Number:</label><input type="tel" id="pcontact${i}" pattern="[0-9]{10,15}" required>
      </div>
    `;
        form.appendChild(div);
    }
}

function submitPassenger() {
    console.log("Attempting to submit passenger information");
    passengers = [];
    const count = parseInt(document.getElementById("passengers").value);

    for (let i = 1; i <= count; i++) {
        const name = document.getElementById(`pname${i}`).value.trim();
        const age = parseInt(document.getElementById(`page${i}`).value);
        const gender = document.getElementById(`pgender${i}`).value;
        const contact = document.getElementById(`pcontact${i}`).value.trim();

        if (!name || name.length < 2) {
            console.log("Validation failed for Passenger " + i + ": Invalid name");
            alert(`Please enter a valid full name for Passenger ${i} (at least 2 characters).`);
            return;
        }

        if (!age || age < 1 || age > 120) {
            console.log("Validation failed for Passenger " + i + ": Invalid age");
            alert(`Please enter a valid age for Passenger ${i} (between 1 and 120).`);
            return;
        }

        if (!gender) {
            console.log("Validation failed for Passenger " + i + ": Gender not selected");
            alert(`Please select a gender for Passenger ${i}.`);
            return;
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (!contact || !phoneRegex.test(contact)) {
            console.log("Validation failed for Passenger " + i + ": Invalid contact number");
            alert(`Please enter a valid contact number for Passenger ${i} (10-15 digits only).`);
            return;
        }

        passengers.push({ name, age, gender, contact });
    }

    if (!selectedFlight) {
        console.log("Validation failed: No flight selected");
        alert("Please select a flight first.");
        return;
    }

    console.log("All passenger validations passed for " + passengers.length + " passengers");
    let total = selectedFlight.price * passengers.length;
    let passengerList = passengers.map((p, index) => `
    <p><strong>Passenger ${index + 1}:</strong> ${p.name}, ${p.age} years old, ${p.gender} - ${p.contact}</p>
  `).join("");

    const summary = `
    <h3>Flight: ${selectedFlight.id}</h3>
    <p>${selectedFlight.from} → ${selectedFlight.to}</p>
    <p>Time: ${selectedFlight.time} | ₱${selectedFlight.price}</p>
    <p>Fare Type: ${selectedFlight.fare} | Duration: ${selectedFlight.duration}</p>
    <p>Seats Available: ${selectedFlight.seats} | Terminal: ${selectedFlight.terminal}</p>
    <hr>
    <h3>Passenger(s) (${passengers.length}):</h3>
    ${passengerList}
    <hr>
    <h3>Total Price: ₱${total}</h3>
  `;
    document.getElementById("summaryDetails").innerHTML = summary;
    showSection("summary", 4);
}

function bookNow() {
    console.log("Attempting to confirm booking");
    if (!selectedFlight || passengers.length === 0) {
        console.log("Validation failed: Missing flight or passengers");
        alert("Please complete all steps before booking.");
        return;
    }
    console.log("Booking confirmed for flight: " + selectedFlight.id);
    alert("✅ Booking Successful! Thank you for flying with GaleCarl Airlines.");
    location.reload();
}