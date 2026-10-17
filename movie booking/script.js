
// MovieBook multi-step booking

function bookMovie(movieName) {
    localStorage.setItem("selectedMovie", movieName);
    window.location.href = "booking.html";
}

const form = document.getElementById("bookingForm");

if (form) {
    const steps = Array.from(
        document.querySelectorAll(".booking-step")
    );

    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const progressFill = document.getElementById("progressFill");
    const stepLabel = document.getElementById("stepLabel");
    const seatContainer = document.getElementById("seats");

    let currentStep = 0;
    let selectedSeats = [];

    const pricePerSeat = 150;

    document.getElementById("movie").value =
        localStorage.getItem("selectedMovie") || "Avengers";

    const dateInput = document.getElementById("date");
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;

    // Generate 24 selectable seats.
    ["A", "B", "C", "D"].forEach(row => {
        for (let number = 1; number <= 6; number++) {
            const seatId = row + number;
            const button = document.createElement("button");

            button.type = "button";
            button.className = "seat";
            button.textContent = seatId;
            button.setAttribute("aria-pressed", "false");

            button.addEventListener("click", () => {
                if (selectedSeats.includes(seatId)) {
                    selectedSeats = selectedSeats.filter(
                        seat => seat !== seatId
                    );
                } else {
                    selectedSeats.push(seatId);
                }

                button.classList.toggle(
                    "selected",
                    selectedSeats.includes(seatId)
                );

                button.setAttribute(
                    "aria-pressed",
                    String(selectedSeats.includes(seatId))
                );

                updateSeatSummary();
            });

            seatContainer.appendChild(button);
        }
    });

    function updateSeatSummary() {
        document.getElementById("seatSummary").textContent =
            selectedSeats.length
                ? selectedSeats.join(", ")
                : "None";

        document.getElementById("total").textContent =
            "₹" + selectedSeats.length * pricePerSeat;
    }

    function validateCurrentStep() {
        if (currentStep === 1 && selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return false;
        }

        const fields = steps[currentStep].querySelectorAll(
            "input:not([readonly]), select"
        );

        for (const field of fields) {
            if (!field.reportValidity()) {
                return false;
            }
        }

        return true;
    }

    function renderReview() {
        const details = [
            ["Movie", document.getElementById("movie").value],
            ["Theatre", document.getElementById("theatre").value],
            ["Date", document.getElementById("date").value],
            ["Show time", document.getElementById("time").value],
            ["Seats", selectedSeats.join(", ")],
            ["Name", document.getElementById("customer").value],
            ["Mobile", document.getElementById("phone").value],
            ["Email", document.getElementById("email").value],
            ["Total", "₹" + selectedSeats.length * pricePerSeat]
        ];

        const container = document.getElementById("reviewDetails");
        container.replaceChildren();

        details.forEach(([label, value]) => {
            const p = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = label + ": ";
            p.append(strong, document.createTextNode(value));
            container.appendChild(p);
        });
    }

    function showStep(index) {
        currentStep = index;

        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });

        progressFill.style.width =
            ((index + 1) / steps.length * 100) + "%";

        stepLabel.textContent =
            `Step ${index + 1} of ${steps.length}`;

        backBtn.hidden = index === 0;
        nextBtn.hidden = index === steps.length - 1;
        confirmBtn.hidden = index !== steps.length - 1;

        if (index === steps.length - 1) {
            renderReview();
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    nextBtn.addEventListener("click", () => {
        if (!validateCurrentStep()) return;

        if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
        }
    });

    backBtn.addEventListener("click", () => {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (currentStep !== steps.length - 1) return;

        if (!validateCurrentStep()) return;

        const booking = {
            id: "MB" + Date.now(),
            movie: document.getElementById("movie").value,
            theatre: document.getElementById("theatre").value,
            date: dateInput.value,
            time: document.getElementById("time").value,
            seats: [...selectedSeats],
            customer: document.getElementById("customer").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            total: selectedSeats.length * pricePerSeat
        };

        localStorage.setItem(
            "lastBooking",
            JSON.stringify(booking)
        );

        window.location.href = "confirmation.html";
    });

    showStep(0);
}