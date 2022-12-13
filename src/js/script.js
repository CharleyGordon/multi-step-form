const fields = Array.from(document.getElementsByTagName("fieldset"));
// console.log(fields);
const steps = Array.from(document.querySelectorAll(".step"));
const labels = Array.from(document.querySelectorAll("[data-yearly]"));
const cb = Array.from(document.querySelectorAll(".cb"));
const next = document.querySelector(".next");
const previous = document.querySelector(".previous");
const charge = document.querySelector(".charge");
const summary = document.createElement("span");
summary.classList.add("total-cost");
// console.log(labels);
let translate = (e) => {
  for (i = 0; i < fields.length; i++) {
    steps.forEach((step) => {
      step.classList.remove("light-up");
    });
    if (fields[i].dataset.current !== undefined) {
      if (
        fields[i + 1] !== undefined &&
        fields[i + 1].classList.contains("last") &&
        e.target === next
      ) {
        console.log("delete next", fields[i]);
        next.classList.add("disable");
      } else {
        next.classList.remove("disable");
      }
      if (
        fields[i - 1] !== undefined &&
        fields[i - 1].classList.contains("first") &&
        e.target === previous
      ) {
        previous.classList.add("disable");
      } else {
        previous.classList.remove("disable");
      }
      if (e.target === next) {
        let nextField = fields[i].nextElementSibling;
        if (nextField === null) {
          nextField = fields[0];
        }
        delete fields[i].dataset.current;
        nextField.dataset.current = "";
        steps[i + 1].classList.toggle("light-up");
      } else {
        console.log("else");
        let previousField = fields[i].previousElementSibling;
        if (previousField === null) {
          return;
        }
        delete fields[i].dataset.current;
        previousField.dataset.current = "";
        steps[i - 1].classList.toggle("light-up");
      }
      //   console.log(fields[i], next);

      // debugger;
      return;
    }
  }
  //   fields.forEach((field) => {
  //      else return;
  //   });
};

let pricing = () => {
  let total = {
    sumMonthly: 0,
    sumYearly: 0,
  };
  let planField = document.querySelector(".plan");
  let addonsField = document.querySelector(".addons");
  let planFieldOption = planField.querySelector('[type="radio"]:checked');
  console.log(planFieldOption);
  let planLabel = planFieldOption.parentElement;
  console.log(planLabel);
  let planPricing = {
    monthly: parseFloat(planLabel.dataset.monthly.split("/")[0].slice(1)),
    yearly: parseFloat(planLabel.dataset.yearly.split("/")[0].slice(1)),
  };
  total.sumMonthly += planPricing.monthly;
  total.sumYearly += planPricing.yearly;
  console.log(planPricing);
  let addons = Array.from(addonsField.querySelectorAll(".cb:checked"));
  console.log(addons);
  addons.forEach((addon) => {
    let addonParent = addon.parentElement;
    console.log(addonParent);
    let monthly = parseFloat(
      addonParent.dataset.monthly.split("/")[0].slice(2)
    );
    let yearly = parseFloat(addonParent.dataset.yearly.split("/")[0].slice(2));
    console.log(monthly, yearly);
    total.sumMonthly += monthly;
    total.sumYearly += yearly;
  });
  console.log(total);
  if (charge.checked) {
    summary.textContent = `+$${total.sumYearly}/yr`;
  } else {
    summary.textContent = `+$${total.sumMonthly}/mo`;
  }
};

next.addEventListener("click", translate);
previous.addEventListener("click", translate);
charge.addEventListener("click", () => {
  labels.forEach((label) => {
    label.classList.toggle("year-plan");
  });
});
cb.forEach((c) => {
  c.nextElementSibling.style.appearance = "none";
  c.addEventListener("click", () => {
    console.log(c.checked);
    console.log(c.nextElementSibling);
    if (c.checked) {
      c.nextElementSibling.style.appearance = "checkbox";
    } else {
      c.nextElementSibling.style.appearance = "none";
    }
  });
});
document.querySelector(".total").appendChild(summary);
