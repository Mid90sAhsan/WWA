(() => {
  const load = document.getElementById("load-time");
  if (load) {
    const paint = () => {
      const nav = performance.getEntriesByType("navigation")[0];
      const ms = nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : performance.now();
      const seconds = ms / 1000;
      load.textContent = seconds < 0.1 ? "< 0.1" : seconds < 1 ? seconds.toFixed(2) : seconds.toFixed(1);
    };
    if (document.readyState === "complete") paint();
    else window.addEventListener("load", paint, { once: true });
  }

  const form = document.getElementById("audit-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [
      `Name: ${data.get("name") || ""}`,
      `Business: ${data.get("business") || ""}`,
      `City: ${data.get("city") || ""}`,
      `Website: ${data.get("website") || ""}`,
      "",
      String(data.get("notes") || ""),
    ];
    const subject = encodeURIComponent("Free 15-minute site audit");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:ahsan@workwithahsan.com?subject=${subject}&body=${body}`;
  });
})();
