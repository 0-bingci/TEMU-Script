document.getElementById('fillBtn').addEventListener('click', () => {
  const selectedValue = document.getElementById('sizeSelect').value;
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'fillForm',
      size: selectedValue
    });
  });
});