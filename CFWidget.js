class CFWidget extends HTMLElement {
  constructor() {
    super();

    this.renderTarget = null;
  }

  connectedCallback() {
    this.renderTarget = this.dataset.useShadowDom
      ? this.attachShadow({ mode: "open" })
      : this;

    this.initialize();
  }

  initialize() {
    if (this.hasAttribute("data-initialized")) {
      console.warn("Widget already initialized.");
      return;
    }

    this.setAttribute("data-initialized", "true");

    const form = this.buildForm();

    this.renderTarget.innerHTML = "";
    this.renderTarget.appendChild(form);

    this.initializeTrustedForm();
  }

  buildForm() {
    const form = document.createElement("form");

    const fields = [
      {
        autocomplete: "on",
        label: "First Name",
        name: "first_name",
        required: true,
        type: "text",
      },
      {
        autocomplete: "on",
        label: "Last Name",
        name: "last_name",
        required: true,
        type: "text",
      },
      {
        autocomplete: "on",
        label: "Email",
        name: "email",
        required: true,
        type: "email",
      },
    ];

    fields.forEach(({ autocomplete, label, name, required, type }) => {
      const fieldEl = document.createElement("div");

      const fieldLabelEl = document.createElement("label");
      fieldLabelEl.setAttribute("for", name);
      fieldLabelEl.textContent = label;
      fieldLabelEl.style.display = "block";

      const fieldInputEl = document.createElement("input");
      fieldInputEl.id = name;
      fieldInputEl.type = type;
      fieldInputEl.name = name;
      fieldInputEl.required = required;
      fieldInputEl.autocomplete = autocomplete;

      fieldEl.appendChild(fieldLabelEl);
      fieldEl.appendChild(fieldInputEl);
      form.appendChild(fieldEl);
    });

    const submit = document.createElement("button");

    submit.type = "submit";
    submit.textContent = "Submit";

    form.appendChild(submit);

    form.addEventListener("submit", (evt) => {
      this.handleSubmit(evt);
    });

    return form;
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const formData = new FormData(evt.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Submitted data:", data);

    this.renderTarget.innerHTML = "<p>Thank you for your submission!</p>";
  }

  initializeTrustedForm() {
    if (
      document.querySelector('script[src*="trustedform.com/trustedform.js"]') ||
      typeof window.trustedForm !== "undefined"
    ) {
      console.log("TrustedForm has already been initialized.");
      return;
    }

    const tf = document.createElement("script");
    tf.type = "text/javascript";
    tf.async = true;
    tf.src =
      (location.protocol === "https:" ? "https" : "http") +
      "://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&sandbox=true&l=" +
      new Date().getTime() +
      Math.random();

    document.head.appendChild(tf);

    window.trustedFormCertIdCallback = (certificateId) => {
      console.log("TrustedForm Certificate ID:", certificateId);
      console.log(
        `TrustedForm Certificate URL: https://cert.trustedform.com/${certificateId}#event_log`,
      );
    };
  }
}

customElements.define("cf-widget", CFWidget);
