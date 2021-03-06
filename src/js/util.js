window.shared = {};

window.timeagoInstance = null;

window.isZh = false;

chrome.i18n.getAcceptLanguages((data) => {
  if (data.indexOf('zh') != -1) {
    isZh = true;
    try {
      if (chrome.i18n.getUILanguage().indexOf('zh') == -1) {
        isZh = false;
      }
    } catch (e) {}
  }
})


//Sorting strings without case sensitivity
window.compare = (a, b) => {
  let cursor = 0;
  const lenA = a.length;
  const lenB = b.length;
  const aa = a.toLowerCase();
  const bb = b.toLowerCase();
  let tempA, tempB;
  while (lenA > cursor && lenB > cursor) {
    tempA = aa.charCodeAt(cursor);
    tempB = bb.charCodeAt(cursor);
    if (tempA == tempB) {
      cursor++;
      continue;
    } else {
      return tempA - tempB;
    }
  }
  return lenA - lenB;
}

window.getLocale = (string) => {
  return chrome.i18n.getMessage(string);
}

window.GL = getLocale;

window.getChromeVersion = () => {
  const match = window.navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9\.]+)/);
  return match ? match[1] : null;
}

//get xxx.com
window.extractDomain = (url) => {
  if (!url) {
    return 'error';
  }
  let domain;
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  domain = domain.split(':')[0];
  const list = domain.split('.');
  return list[list.length - 2] + '.' + list[list.length - 1];
}

window.capFirst = (elem) => {
  const str = getString(elem);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.getString = (elem) => {
  if (elem === undefined || elem === null) {
    return '';
  } else {
    return elem.toString();
  }
}

window.getLanguage = () => {
	let language = browser.i18n.getUILanguage().replace('-', '_');
	const supportedLanguageList = [ 'ar', 'be', 'bg', 'ca', 'da', 'de', 'el', 'en', 'en_short', 'es', 'eu', 'fa', 'fi', 'fr', 'gl', 'he', 'hu', 'in_BG', 'in_HI', 'in_ID', 'it', 'ja', 'ko', 'ml', 'my', 'nb_NO', 'nl', 'nn_NO', 'pl', 'pt_BR', 'ro', 'ru', 'sv', 'ta', 'th', 'tr', 'uk', 'vi', 'zh_CN', 'zh_TW' ];
	if (supportedLanguageList.indexOf(language) == -1) {
		language = language.split('_')[0];
	}
	return supportedLanguageList.indexOf(language) == -1 ? 'en' : language;
};

window.getParameterByName = (name, url) => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.dataUrlFromUrl = (link, callback) => {
  const img = new Image();
  img.addEventListener('load', () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const dataUrl = canvas.toDataURL();
    callback(dataUrl);
  });
  img.src = link;
}

window.isOn = (key, callbackTrue, callbackFalse, param) => {
  get(key, (value) => {
    if (value == '1' || value == true) {
      if (callbackTrue) {
        callbackTrue(param);
      }
    } else {
      if (callbackFalse) {
        callbackFalse(param);
      }
    }
  });
}

window.setIfNull = (key, setValue, callback) => {
  get(key, (value) => {
    if (value == undefined || value == null) {
      set(key, setValue, callback);
    } else {
      if (callback) {
        callback();
      }
    }
  });
}

window.setDB = (key, value, callback) => {
  const indexedDB = window.indexedDB;
  const open = indexedDB.open("NooBox", 1);
  open.onupgradeneeded = () => {
    const db = open.result;
    const store = db.createObjectStore("Store", {
      keyPath: "key"
    });
  };
  open.onsuccess = () => {
    const db = open.result;
    const tx = db.transaction("Store", "readwrite");
    const store = tx.objectStore("Store");
    const action1 = store.put({
      key,
      value
    });
    action1.onsuccess = () => {
      if (callback) {
        callback();
      }
    }
    action1.onerror = () => {
      console.log('setDB fail');
    }
  }
}

window.getDB = (key, callback) => {
  if (callback) {
    const indexedDB = window.indexedDB;
    const open = indexedDB.open("NooBox", 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      const store = db.createObjectStore("Store", {
        keyPath: "key"
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("Store", "readwrite");
      const store = tx.objectStore("Store");
      const action1 = store.get(key);
      action1.onsuccess = (e) => {
        if (e.target.result) {
          callback(e.target.result.value);
        } else {
          callback(null);
        }
      }
      action1.onerror = () => {
        console.log('getDB fail');
      }
    }
  }
}

window.deleteDB = (key, callback) => {
	const indexedDB = window.indexedDB;
	const open = indexedDB.open("NooBox", 1);
	open.onupgradeneeded = () => {
		const db = open.result;
		const store = db.createObjectStore("Store", {
			keyPath: "key"
		});
	};
	open.onsuccess = () => {
		const db = open.result;
		const tx = db.transaction("Store", "readwrite");
		const store = tx.objectStore("Store");
		const action1 = store.delete(key);
		action1.onsuccess = (e) => {
			if (callback) {
				callback(true);
			}
		}
		action1.onerror = () => {
			console.log('deleteDB fail');
			if (callback) {
				callback(false);
			}
		}
	}
}
window.set = (key, value, callback) => {
  const temp = {};
  temp[key] = value;
  chrome.storage.sync.set(temp, callback);
}

window.get = (key, callback) => {
  chrome.storage.sync.get(key, (result) => {
    if (callback) {
      callback(result[key]);
    }
  });
}

window.getImageSearchEngines = (list, callback, i, result, shared) => {
  if (i == null) {
    i = -1;
    shared = [];
  } else {
    if (result) {
      shared.push(list[i]);
    }
    if (i == list.length - 1) {
      callback(shared);
    }
  }
  if (i < list.length - 1) {
    isOn(
      "imageSearchUrl_" + list[i + 1],
      getImageSearchEngines.bind(null, list, callback, i + 1, true, shared),
      getImageSearchEngines.bind(null, list, callback, i + 1, false, shared)
    );
  }
}

window.dataURItoBlob = (dataURI) => {
  try {
    const byteString = atob(dataURI.split(',')[1]);
  } catch (e) {
    console.log(e);
  }
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], {
    type: mimeString
  });
  return blob;
}

window.loadIframe = (url, callback) => {
  $(() => {
    const ifr = $('<iframe/>', {
      id: 'baiduIframe',
      src: url,
      style: 'display:none',
    });
    $('#baiduIframe').on('load', callback);
    $('body').append(ifr);
  });
}
const BASE64_MARKER = ';base64,';

window.convertDataURIToBinary = (dataURI) => {
  try {
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  } catch (e) {
    try {
      dataURI = dataURI.replace(/%2/g, '/');
      const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
      const base64 = dataURI.substring(base64Index);
      const raw = window.atob(base64);
      const rawLength = raw.length;
      const array2 = new Uint8Array(new ArrayBuffer(rawLength));
      for (let j = 0; j < rawLength; j++) {
        array2[j] = raw.charCodeAt(j);
      }
      return array2;
    } catch (e) {
      return ;
    }
    console.log(e);
    return array;
  }
}

window.voidFunc = () => {}

window.fetchBlob = (uri, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', uri, true);
  xhr.responseType = 'blob';

  xhr.onload = function(e) {
		if(xhr.readyState == 4) {
			if (this.status == 200) {
				const blob = new Blob([this.response], {
					type: 'image/png'
				});;
				if (callback) {
					callback(blob);
				}
			}
			else {
				console.log('error! yay');
				callback();
			}
		}
  };
	xhr.onerror = function() {
		console.log('error! yay');
		callback();
	}
  xhr.send();
};

window.bello = {
	pageview: function(version) {
		if(typeof window != 'object')
			return;
		var data = {
			type: 'pageview',
			path: version,
			title: 'background',
			referrer: '',
			ua: navigator.userAgent,
			sr: screen.width + 'x' + screen.height,
			ul: navigator.language || navigator.userLanguage,
			ainoob: Math.random(),
		}
		this.ajax('https://ainoob.com/bello/noobox'+this.serialize(data));
	},
	event: function(obj) {
		if(typeof window != 'object')
			return;
		var data = {
			type: 'event',
			category: obj.category,
			action: obj.action,
			label: obj.label,
			value: obj.value || 0,
			ainoob: Math.random(),
			ua: navigator.userAgent,
			sr: screen.width + 'x' + screen.height,
			path: '0.9.3.8',
			ul: navigator.language || navigator.userLanguage,
		}
		this.ajax('https://ainoob.com/bello/noobox'+this.serialize(data));
	},
	serialize: function(obj) {
		return '?'+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
	},
	ajax: function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				console.log(request.responseText);
			}
		}
		request.send();
	},
}
