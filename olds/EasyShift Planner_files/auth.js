// Configuração do Firebase
const firebaseConfig = {
    // Substitua com suas credenciais do Firebase
    apiKey: "SUA_API_KEY",
    authDomain: "seu-app.firebaseapp.com",
    projectId: "seu-app",
    storageBucket: "seu-app.appspot.com",
    messagingSenderId: "seu-id",
    appId: "seu-app-id"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Níveis de acesso
const ACCESS_LEVELS = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee'
};

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
    }

    async login(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            this.currentUser = result.user;
            await this.loadUserRole();
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        }
    }

    async register(email, password, role = ACCESS_LEVELS.EMPLOYEE) {
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(result.user.uid).set({
                email,
                role,
                notificationsEnabled: true
            });
            return true;
        } catch (error) {
            console.error('Erro no registro:', error);
            return false;
        }
    }

    async loadUserRole() {
        if (!this.currentUser) return null;
        const doc = await db.collection('users').doc(this.currentUser.uid).get();
        this.userRole = doc.data().role;
        return this.userRole;
    }

    canEdit() {
        return this.userRole === ACCESS_LEVELS.ADMIN || this.userRole === ACCESS_LEVELS.MANAGER;
    }

    canManageUsers() {
        return this.userRole === ACCESS_LEVELS.ADMIN;
    }
}

const authManager = new AuthManager(); 

// Adicionar funções de autenticação social
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        await createUserProfile(result.user);
        return true;
    } catch (error) {
        console.error('Erro no login com Google:', error);
        return false;
    }
}

async function createUserProfile(user) {
    const userRef = db.collection('users').doc(user.uid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        await userRef.set({
            email: user.email,
            name: user.displayName,
            role: 'employee',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
} 