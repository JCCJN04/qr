const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getNextEmployeeNumber = functions.https.onCall(async (data, context) => {
  const db = admin.firestore();
  
  // Documento que almacena el siguiente número de empleado
  const counterRef = db.collection('counters').doc('employeeNumber');

  return db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    if (!counterDoc.exists) {
      throw new Error('Counter document does not exist!');
    }

    const currentNumber = counterDoc.data().number;
    const nextNumber = currentNumber + 1;

    // Actualiza el documento del contador
    transaction.update(counterRef, { number: nextNumber });

    return { nextNumber };
  });
});
