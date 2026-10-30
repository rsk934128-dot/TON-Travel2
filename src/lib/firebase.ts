import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, getDocFromServer, collection, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, HotelReview, WishlistItem } from '../types';
import { INITIAL_MOCK_REVIEWS } from '../data/reviews';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection to Firestore verified from server.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or database configuring:', error.message);
    } else {
      console.log('[Firebase] Connection check completed (offline or initial doc sync).');
    }
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign In Error:', err);
    throw err;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Logout Error:', err);
  }
}

export async function saveUserProfile(profile: UserProfile) {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
    console.log('[Firebase] Saved user profile to Firestore:', profile.uid);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function seedInitialReviewsIfEmpty(): Promise<void> {
  const path = 'hotel_reviews';
  try {
    const colRef = collection(db, 'hotel_reviews');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('[Firestore] Seeding initial mock hotel reviews...');
      for (const rev of INITIAL_MOCK_REVIEWS) {
        await setDoc(doc(db, 'hotel_reviews', rev.id), rev);
      }
      console.log('[Firestore] Seeded initial hotel reviews successfully.');
    }
  } catch (error) {
    console.warn('[Firestore] Review seeding check fallback (offline or pending rules):', error);
  }
}

export function subscribeToHotelReviews(callback: (reviews: HotelReview[]) => void): () => void {
  const path = 'hotel_reviews';
  const colRef = collection(db, 'hotel_reviews');
  
  return onSnapshot(
    colRef,
    (snapshot) => {
      const reviews: HotelReview[] = snapshot.docs.map((d) => d.data() as HotelReview);
      callback(reviews);
    },
    (error) => {
      console.error('[Firestore] Hotel reviews snapshot error:', error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function addHotelReview(review: HotelReview): Promise<void> {
  const path = `hotel_reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'hotel_reviews', review.id), review);
    console.log('[Firestore] Added hotel review:', review.id);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToWishlists(callback: (wishlists: WishlistItem[]) => void): () => void {
  const path = 'wishlists';
  const colRef = collection(db, 'wishlists');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: WishlistItem[] = snapshot.docs.map((d) => d.data() as WishlistItem);
      callback(items);
    },
    (error) => {
      console.error('[Firestore] Wishlist snapshot error:', error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function toggleWishlistItemDoc(
  userId: string,
  hotelId: string,
  hotelName: string,
  currentlySaved: boolean
): Promise<void> {
  const docId = `${userId}_${hotelId}`;
  const path = `wishlists/${docId}`;
  try {
    if (currentlySaved) {
      await deleteDoc(doc(db, 'wishlists', docId));
      console.log('[Firestore] Removed from wishlist:', docId);
    } else {
      const item: WishlistItem = {
        id: docId,
        userId,
        hotelId,
        hotelName,
        addedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'wishlists', docId), item);
      console.log('[Firestore] Saved to wishlist:', docId);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

