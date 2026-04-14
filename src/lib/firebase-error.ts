import { FirebaseError } from 'firebase/app'

const FIREBASE_MESSAGES: Record<string, string> = {
  'auth/user-not-found':      'Invalid email or password.',
  'auth/wrong-password':      'Invalid email or password.',
  'auth/invalid-credential':  'Invalid email or password.',
  'auth/invalid-email':       'Enter a valid email address.',
  'auth/user-disabled':       'This account has been disabled.',
  'auth/too-many-requests':   'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'permission-denied':        'You do not have permission to do this.',
}

export function getFirebaseError(err: unknown): string {
  if (err instanceof FirebaseError) {
    return FIREBASE_MESSAGES[err.code] ?? 'Something went wrong. Please try again.'
  }
  return 'Something went wrong. Please try again.'
}