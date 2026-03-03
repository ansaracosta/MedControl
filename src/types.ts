export interface Medicine {
  id: string;
  name: string;
  quantity: string;
  prescriptionDelivery: string;
  medicinePickup: string;
  acquisition: string;
  observations: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  year: string;
  medicineName: string;
  imageUrl: string;
  dateAdded: string;
  folderId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'appointment' | 'exam' | 'prescription' | 'pickup' | 'task';
  reminder: boolean;
  time?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  fontFamily: string;
  fontSize: string;
  createdAt: string;
  reminderDate?: string;
  reminderTime?: string;
}

export interface Alarm {
  id: string;
  time: string;
  days: string[];
  label: string;
  active: boolean;
  soundUrl?: string;
}
