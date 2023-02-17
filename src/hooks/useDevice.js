const useDevice = () => {
  const { userAgent, appVersion } = navigator;
  let browser = 'unkown';
  let deviceInfor = {};
  const browserVersion = (userAgent, regex) => {
    return userAgent.match(regex) ? userAgent.match(regex)[2] : null;
  };

  //detect device
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));

  const isMobile = () =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());

  //detect operator system
  let os = 'unknown';
  const clientStrings = [
    { s: 'Windows 3.11', r: /Win16/ },
    { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
    { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
    { s: 'Windows 98', r: /(Windows 98|Win98)/ },
    { s: 'Windows CE', r: /Windows CE/ },
    { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
    { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
    { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
    { s: 'Windows Vista', r: /Windows NT 6.0/ },
    { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
    { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
    { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
    { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
    { s: 'Windows ME', r: /Windows ME/ },
    { s: 'Android', r: /Android/ },
    { s: 'Open BSD', r: /OpenBSD/ },
    { s: 'Sun OS', r: /SunOS/ },
    { s: 'Linux', r: /(Linux|X11)/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
    { s: 'Mac OS X', r: /Mac OS X/ },
    { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
    { s: 'QNX', r: /QNX/ },
    { s: 'UNIX', r: /UNIX/ },
    { s: 'BeOS', r: /BeOS/ },
    { s: 'OS/2', r: /OS\/2/ },
    {
      s: 'Search Bot',
      r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
    }
  ];
  for (var id in clientStrings) {
    var cs = clientStrings[id];
    if (cs.r.test(userAgent)) {
      os = cs.s;
      break;
    }
  }

  let osVersion = 'unknown';

  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
    os = 'Windows';
  }

  switch (os) {
    case 'Mac OS X':
      osVersion = /Mac OS X (10[\.\_\d]+)/.exec(userAgent)[1];
      break;

    case 'Android':
      osVersion = /Android ([\.\_\d]+)/.exec(userAgent)[1];
      break;

    case 'iOS':
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(appVersion);
      osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
      break;
  }

  //   app_version: '2.0.0',
  //   modelId: 'Chrome',
  //   modelName: '108',
  //   os: 'Mac OS',
  //   os_version: '10.15.7',
  //   partner: 'pc',
  //   platform: 'web'
  //get os version

  // Detect browser name
  browser = /ucbrowser/i.test(userAgent) ? 'UCBrowser' : browser;
  browser = /edg/i.test(userAgent) ? 'Edge' : browser;
  browser = /googlebot/i.test(userAgent) ? 'GoogleBot' : browser;
  browser = /chromium/i.test(userAgent) ? 'Chromium' : browser;
  browser =
    /firefox|fxios/i.test(userAgent) && !/seamonkey/i.test(userAgent)
      ? 'Firefox'
      : browser;
  browser =
    /; msie|trident/i.test(userAgent) && !/ucbrowser/i.test(userAgent)
      ? 'IE'
      : browser;
  browser =
    /chrome|crios/i.test(userAgent) &&
    !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(userAgent)
      ? 'Chrome'
      : browser;
  browser =
    /safari/i.test(userAgent) &&
    !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(
      userAgent
    )
      ? 'Safari'
      : browser;
  browser = /opr|opera/i.test(userAgent) ? 'Opera' : browser;

  // detect browser version
  let version = 'Unknow';
  switch (browser) {
    case 'UCBrowser':
      version = browserVersion(userAgent, /(ucbrowser)\/([\d\.]+)/i);
      break;
    case 'Edge':
      version = browserVersion(userAgent, /(edge|edga|edgios|edg)\/([\d\.]+)/i);
      break;
    case 'GoogleBot':
      version = browserVersion(userAgent, /(googlebot)\/([\d\.]+)/i);
      break;
    case 'Chromium':
      version = browserVersion(userAgent, /(chromium)\/([\d\.]+)/i);
      break;
    case 'Firefox':
      version = browserVersion(userAgent, /(firefox|fxios)\/([\d\.]+)/i);
      break;
    case 'Chrome':
      version = browserVersion(userAgent, /(chrome|crios)\/([\d\.]+)/i);
      break;
    case 'Safari':
      version = browserVersion(userAgent, /(safari)\/([\d\.]+)/i);
      break;
    case 'Opera':
      version = browserVersion(userAgent, /(opera|opr)\/([\d\.]+)/i);
      break;
    case 'IE':
      {
        const ieVersion = browserVersion(userAgent, /(trident)\/([\d\.]+)/i);
        // IE version is mapped using trident version
        version = (ieVersion && parseFloat(ieVersion) + 4.0) || 7.0;
      }
      break;
  }

  deviceInfor = {
    ...deviceInfor,
    browser,
    partner: isMobile() ? 'mobile' : 'pc',
    os,
    osVer: osVersion,
    version
  };
  return deviceInfor;
};

export default useDevice;
