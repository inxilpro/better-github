// Content scripts can't be ES modules directly, so this classic script bootstraps the real module via a dynamic import.
import(chrome.runtime.getURL('src/content.js'));
