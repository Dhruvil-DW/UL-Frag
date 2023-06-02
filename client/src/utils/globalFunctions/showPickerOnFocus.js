export function showPickerOnFocus(e) {
  try {
    e.target.showPicker();
  }
  catch (err) {
    console.warn(err);
  }
}