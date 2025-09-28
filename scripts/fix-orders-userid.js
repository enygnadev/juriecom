
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { credential } = require('firebase-admin');

// Inicializar Firebase Admin
const admin = require('firebase-admin');

const serviceAccount = {
  "type": "service_account",
  "project_id": "juriecommerce",
  "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_ADMIN_CLIENT_EMAIL}`
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = getFirestore();

async function fixOrdersUserId() {
  try {
    console.log('🔍 Buscando pedidos sem userId...');
    
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.get();
    
    console.log(`📦 Total de pedidos encontrados: ${snapshot.size}`);
    
    let fixedCount = 0;
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`📝 Pedido ${doc.id}:`, {
        userId: data.userId,
        userEmail: data.userEmail,
        customerEmail: data.customerInfo?.email,
        status: data.status
      });
      
      // Se não tem userId mas tem email do cliente, tentar inferir
      if (!data.userId && data.customerInfo?.email) {
        console.log(`🔧 Pedido ${doc.id} precisa de correção`);
        
        // Para o usuário admin conhecido
        if (data.customerInfo.email === 'guga@gmail.com') {
          batch.update(doc.ref, {
            userId: 'jyU6kiM4ieb8eiK2LgZV0imSlYz1',
            userEmail: 'guga@gmail.com',
            updatedAt: new Date()
          });
          fixedCount++;
          console.log(`✅ Pedido ${doc.id} será corrigido`);
        }
      }
    });
    
    if (fixedCount > 0) {
      await batch.commit();
      console.log(`✅ ${fixedCount} pedidos foram corrigidos!`);
    } else {
      console.log('ℹ️ Nenhum pedido precisa de correção');
    }
    
  } catch (error) {
    console.error('❌ Erro ao corrigir pedidos:', error);
  }
}

// Executar script
fixOrdersUserId()
  .then(() => {
    console.log('🏁 Script finalizado');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
