
#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verifyAdminUser() {
  try {
    // Substitua por seu UID de usuário admin real
    const adminUID = "SEU_UID_AQUI"; // Você pode pegar isso do console do Firebase Auth
    const adminEmail = "guga@gmail.com";
    
    console.log("🔍 Verificando usuário admin:", adminEmail);
    
    const userRef = doc(db, "users", adminUID);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log("👤 Dados do usuário:", userData);
      
      if (userData.isAdmin) {
        console.log("✅ Usuário já é admin");
      } else {
        console.log("🔄 Atualizando usuário para admin...");
        await setDoc(userRef, {
          ...userData,
          isAdmin: true,
          updatedAt: new Date()
        }, { merge: true });
        console.log("✅ Usuário atualizado para admin");
      }
    } else {
      console.log("❌ Usuário não encontrado, criando...");
      await setDoc(userRef, {
        email: adminEmail,
        name: "Admin",
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("✅ Usuário admin criado");
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

verifyAdminUser();
