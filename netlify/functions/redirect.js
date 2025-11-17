// Link yönlendirme fonksiyonu
let linksDB = {};

exports.handler = async function(event, context) {
  const path = event.path;
  const slug = path.startsWith('/r/') ? path.split('/r/')[1] : null;
  
  if (!slug) {
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://ornate-piroshki-d0109f.netlify.app'
      }
    };
  }
  
  // Linki bul
  const link = linksDB[slug];
  
  if (!link) {
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://ornate-piroshki-d0109f.netlify.app/#not-found'
      }
    };
  }
  
  // Tıklama sayısını artır
  linksDB[slug].clicks++;
  
  // Her 3 tıklamada bir reklam göster
  if (link.clicks % 3 === 0) {
    return showAdPage(link.longUrl, slug);
  }
  
  // Direkt yönlendir
  return {
    statusCode: 302,
    headers: {
      'Location': link.longUrl
    }
  };
};

function showAdPage(originalUrl, slug) {
  const adHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Redirecting... - 12hrs Link Shortener</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      font-family: Arial, sans-serif;
      text-align: center; 
      padding: 50px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .countdown {
      font-size: 48px;
      font-weight: bold;
      margin: 20px 0;
      color: #FFD700;
    }
    .ad-section {
      background: white;
      color: #333;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>🔄 Redirecting...</h1>
  
  <div class="countdown" id="countdown">5</div>
  
  <div class="ad-section">
    <h3>📢 Sponsored Content</h3>
    <div id="ad-content">
      <script src="https://3nbf4.com/act/files/tag.min.js?z=10200882"></script>
    </div>
    <p><small>Support our free service</small></p>
  </div>
  
  <p>You will be redirected in <span id="seconds">5</span> seconds</p>
  
  <button onclick="skipAd()" style="
    background: #667eea; color: white; border: none; padding: 10px 20px; 
    border-radius: 5px; cursor: pointer; margin: 10px;
  ">Skip Ad</button>

  <script>
    let seconds = 5;
    let countdownInterval;
    
    function startCountdown() {
      countdownInterval = setInterval(() => {
        seconds--;
        document.getElementById('seconds').textContent = seconds;
        document.getElementById('countdown').textContent = seconds;
        
        if (seconds <= 0) {
          clearInterval(countdownInterval);
          redirectToDestination();
        }
      }, 1000);
    }
    
    function redirectToDestination() {
      window.location.href = '${originalUrl}';
    }
    
    function skipAd() {
      clearInterval(countdownInterval);
      redirectToDestination();
    }
    
    startCountdown();
  </script>
</body>
</html>
  `;
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: adHtml
  };
}
