// Basit JSON tabanlı versiyon (MongoDB kurana kadar)
let linksDB = {};

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { longUrl, customSlug } = JSON.parse(event.body);
    
    if (!longUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Slug oluştur
    let slug = customSlug || generateRandomSlug();
    
    // Custom slug kontrolü (geçici memory'de)
    if (customSlug && linksDB[customSlug]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Custom name already taken' })
      };
    }
    
    // Linki kaydet (geçici)
    linksDB[slug] = {
      longUrl: longUrl,
      createdAt: new Date().toISOString(),
      clicks: 0
    };
    
    const shortUrl = `https://ornate-piroshki-d0109f.netlify.app/r/${slug}`;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        shortUrl: shortUrl,
        success: true 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

function generateRandomSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
