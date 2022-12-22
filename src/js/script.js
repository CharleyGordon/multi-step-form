const fields = Array.from(document.getElementsByTagName("fieldset"));
const form = document.querySelector("form");
// console.log(fields);
const steps = Array.from(document.querySelectorAll(".step"));
const labels = Array.from(document.querySelectorAll("[data-yearly]"));
const cb = Array.from(document.querySelectorAll(".cb"));
const next = document.querySelector(".next");
const previous = document.querySelector(".previous");
const charge = document.querySelector(".charge");
const change = document.querySelector(".change");
charge.checked = false;
const summary = document.createElement("span");
summary.classList.add("total-cost");
// console.log(labels);
let removeSteps = () => {
  steps.forEach((step) => {
    step.classList.remove("light-up");
  });
};
let checkFields = (field) => {
  let inputs = Array.from(field.querySelectorAll("[required]"));

  console.log(inputs);
  for (let i = 0; i < inputs.length; i++) {
    let validation = inputs[i].parentElement.querySelector(".validation");
    inputs[i].classList.remove("fail");
    validation.classList.remove("fail");
    if (inputs[i].matches(":invalid")) {
      inputs[i].classList.add("fail");
      validation.classList.add("fail");
      return false;
    }
  }
  return true;
};
let changeToConfirm = (element) => {
  if (element.nextElementSibling.matches(".last")) {
    next.textContent = "Confirm";
  } else next.textContent = "Next step";
};
let translate = (e) => {
  next.value = "Next step";
  removeSteps();
  for (i = 0; i < fields.length; i++) {
    if (checkFields(fields[i]) === false) {
      return;
    }
    if (fields[i].dataset.current !== undefined) {
      if (
        fields[i + 1] !== undefined &&
        fields[i + 1].classList.contains("last") &&
        e.target === next
      ) {
        console.log("delete next", fields[i]);
        next.classList.add("disable");
        previous.classList.add("disable");
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
        if (nextField.matches(".last")) {
          previous.classList.add("disable");
        }
        if (nextField.matches(".summary")) {
          countPricing();
        }
        delete fields[i].dataset.current;
        nextField.dataset.current = "";
        if (steps[i + 1] !== undefined) {
          steps[i + 1].classList.toggle("light-up");
        }

        //
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
let removeChildren = (parent) => {
  let toRemove = Array.from(document.querySelectorAll(".may-remove"));
  toRemove.forEach((remove) => {
    parent.removeChild(remove);
  });
};
let insertChoices = (total) => {
  let toInsert = document.querySelector(".sum-up");
  let mainPlan = document.querySelector(".main-plan");
  let mainPrice = mainPlan.nextElementSibling;
  mainPlan.textContent = "";
  mainPrice.textContent = "";
  let planField = document.querySelector(".plan");
  let addonsField = document.querySelector(".addons");
  //
  let addonsAll = Array.from(
    addonsField.querySelectorAll("input:not(.identify):checked")
  );
  console.log(addonsAll);
  let planFieldOption = planField.querySelector("input:checked");
  //
  //
  let optionName = planFieldOption.parentElement.childNodes[0].textContent;
  mainPlan.textContent = optionName;
  console.log(total);
  if (charge.checked) {
    summary.textContent = `+$${total.sumYearly}/yr`;
    mainPlan.textContent += " (Yearly)";
    mainPrice.textContent = planFieldOption.parentElement.dataset.yearly;
  } else {
    summary.textContent = `+$${total.sumMonthly}/mo`;
    mainPlan.textContent += " (Monthly)";
    mainPrice.textContent = planFieldOption.parentElement.dataset.monthly;
  }
  removeChildren(toInsert);
  addonsAll.forEach((a) => {
    console.log(a);
    let order = document.createElement("div");
    order.classList.add("order");
    order.classList.add("may-remove");
    order.dataset.grid = "";
    let choice = document.createElement("span");
    choice.classList.add("choice");
    let price = document.createElement("span");
    price.classList.add("price");
    let parent = a.parentElement;
    choice.textContent = parent.childNodes[0].textContent;
    price.textContent = parent.dataset.monthly;
    if (charge.checked) {
      price.textContent = parent.dataset.yearly;
    }
    order.appendChild(choice);
    order.appendChild(price);
    toInsert.appendChild(order);
  });
  next.value = "Confirm";
  //
};
let countPricing = () => {
  let total = {
    sumMonthly: 0,
    sumYearly: 0,
  };
  let planField = document.querySelector(".plan");
  let addonsField = document.querySelector(".addons");
  let planFieldOption = planField.querySelector("input:checked");
  let planLabel = planFieldOption.parentElement;
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
    let monthly = parseFloat(
      addonParent.dataset.monthly.split("/")[0].slice(2)
    );
    let yearly = parseFloat(addonParent.dataset.yearly.split("/")[0].slice(2));
    console.log(monthly, yearly);
    total.sumMonthly += monthly;
    total.sumYearly += yearly;
  });
  insertChoices(total);
};

next.addEventListener("click", translate);
previous.addEventListener("click", translate);
charge.addEventListener("click", () => {
  labels.forEach((label) => {
    label.classList.toggle("year-plan");
  });
});
cb.forEach((c) => {
  c.checked = false;
  c.nextElementSibling.checked = false;
  c.addEventListener("click", () => {
    console.log(c.checked);
    console.log(c.nextElementSibling);
    if (c.checked) {
      c.nextElementSibling.checked = true;
    } else {
      c.nextElementSibling.checked = false;
    }
  });
});
change.addEventListener("click", (e) => {
  e.preventDefault();
  removeSteps();
  steps[1].classList.toggle("light-up");
  let current = document.querySelector("[data-current]");
  let option = document.querySelector(".plan");
  delete current.dataset.current;
  option.dataset.current = "";
});
document.querySelector(".total").appendChild(summary);
