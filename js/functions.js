function Inside(num, min, max) {
  if (num > min - 1 && num < max + 1) {
    return true;
  }
  return false;
}

function Random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function Disable(item, hide = false) {
  item.setAttribute("disabled", "");
  item.setAttribute("aria-disabled", "true");
  if (hide) {
    item.style.display = "none";
  }
}

function Enable(item) {
  item.removeAttribute("disabled");
  item.removeAttribute("aria-disabled");
  item.style.display = "";
}

function padNumber(number, totalLength) {
  return String(number).padStart(totalLength, "0");
}
