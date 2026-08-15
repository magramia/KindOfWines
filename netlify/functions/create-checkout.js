// netlify/functions/create-checkout.js
//
// Questa funzione crea una sessione di pagamento Stripe.
// La chiave segreta Stripe (sk_...) vive SOLO qui, mai nel sito pubblico.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Metodo non permesso' })
    };
  }

  try {
    // L'URL del tuo sito, per sapere dove rimandare il cliente dopo il pagamento
    const siteUrl = process.env.URL || 'https://magramia.github.io/KindOfWines';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1U4kMNBLzmXdHmeCW3w6oUUQ', // Price ID del prodotto "Consultazione KindOfWines"
          quantity: 1
        }
      ],
      success_url: siteUrl + '?payment=success',
      cancel_url: siteUrl + '?payment=cancelled'
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore Stripe: ' + error.message })
    };
  }
};
