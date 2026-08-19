//netlify/functions/analyze-wine.js
//
// Questa funzione riceve dal sito le immagini + le preferenze,
// chiama Claude (Anthropic) usando la chiave API SEGRETA
// (che qui sta al sicuro, mai visibile al pubblico),
// e restituisce il risultato al sito.

exports.handler = async function (event) {
  // Il sito può chiamare questa funzione solo con richieste POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Metodo non permesso' })
    };
  }

  try {
    const body = JSON.parse(event.body);

    // La chiave segreta vive SOLO qui, nelle variabili d'ambiente di Netlify
    // (la impostiamo tra poco nel pannello Netlify, mai nel codice)
    const API_KEY = process.env.ANTHROPIC_API_KEY;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: body.max_tokens || 1500,
        system: body.system
          messages: body.messages
      })
    });

    const data = await response.json();
console.log('Anthropic response:', JSON.stringify(data));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno: ' + error.message })
    };
  }
};
