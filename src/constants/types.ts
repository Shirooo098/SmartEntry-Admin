import { Timestamp } from "firebase/firestore";

export type Visitor = {
  id: string
  uid: string        
  fullName: string
  address: string
  email: string
  status: string
  scheduledTimeIn: string
  scheduledTimeOut: string
  actualTimeIn: Timestamp | null
  actualTimeOut: Timestamp | null
  visitDate: string
  checkoutDate: string
}

export type User = {
  uid: string
  username: string
  email: string
  residential_Id: string
  avatarUri?: string
}

export type Entry = {
  id: string
  visitorId: string
  fullName: string     
  email: string         
  username: string      
  residential_Id: string
  time: string
  status: 'in' | 'out'
}

export type VisitorWithUser = Visitor & { user: User | null }
export type StatusFilter = 'All' | 'Incoming' | 'Visitor-In' | 'Visitor-Out'
 