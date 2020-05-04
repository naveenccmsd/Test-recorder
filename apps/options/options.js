// Saves options to chrome.storage.sync.
function save_options() {
  
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    quick_access_url: 'http://www.google.com',
    omnibox_search_url: 'https://www.google.com/search?q='
  }, function(items) {
    document.getElementById('quick_access_url').value = items.quick_access_url;
    document.getElementById('search_url').value = items.omnibox_search_url;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);