import { Pet, Medication, Appointment, NewsArticle, OwnerProfile, Doctor } from './types';

export const MOCK_OWNER: OwnerProfile = {
  name: 'Alice Johnson',
  phone: '081-234-5678',
  address: '123 Sukhumvit Road, Bangkok',
  lineId: '@alice.j',
  facebook: 'Alice Johnson',
  email: 'alice@example.com',
  reliabilityScore: 95, // High score
  noShowCount: 0
};

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Smith', specialty: 'General & Surgery', image: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=4F46E5&color=fff' },
  { id: 'd2', name: 'Dr. John Doe', specialty: 'Dermatology', image: 'https://ui-avatars.com/api/?name=John+Doe&background=0D9488&color=fff' },
  { id: 'd3', name: 'Dr. Emily Chen', specialty: 'Internal Medicine', image: 'https://ui-avatars.com/api/?name=Emily+Chen&background=F97316&color=fff' }
];

export const MOCK_PETS: Pet[] = [
  {
    id: 'p1',
    name: 'Mochi',
    type: 'Dog',
    breed: 'Golden Retriever',
    sex: 'Male',
    weight: 28.5,
    age: 3,
    birthday: '2020-05-15',
    food: 'Royal Canin Adult',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500',
    allergies: ['Chicken', 'Dust'],
    history: ['Vaccination 2023', 'Spayed 2022'],
    ownerName: 'Alice Johnson'
  },
  {
    id: 'p2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese Cat',
    sex: 'Female',
    weight: 4.2,
    age: 2,
    birthday: '2021-08-20',
    food: 'Whiskas Wet Food',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=500',
    allergies: [],
    history: ['Annual Checkup 2024'],
    ownerName: 'Alice Johnson'
  }
];

export const MOCK_MEDS: Medication[] = [
  {
    id: 'm1',
    petId: 'p1',
    name: 'Apoquel',
    type: 'Medicine',
    dosage: '16mg',
    frequency: 'Once Daily',
    nextDue: new Date(new Date().setHours(new Date().getHours() - 1)), // Overdue by 1 hour for demo
    confirmed: false
  },
  {
    id: 'm2',
    petId: 'p2',
    name: 'Flea Prevention',
    type: 'Medicine',
    dosage: '1 pipette',
    frequency: 'Monthly',
    nextDue: new Date(new Date().setDate(new Date().getDate() + 14)),
    confirmed: false
  },
  {
    id: 'm3',
    petId: 'p1',
    name: 'Rabies Booster',
    type: 'Vaccine',
    dosage: '1 Shot',
    frequency: 'Annual',
    nextDue: new Date(new Date().setDate(new Date().getDate() + 2)),
    confirmed: false
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    petId: 'p1',
    clinicName: 'Happy Paws Hospital',
    doctorName: 'Dr. Sarah Smith',
    date: new Date(new Date().setHours(10, 30, 0, 0)),
    reason: 'Skin Allergy Follow-up',
    type: 'FOLLOWUP',
    severity: 'ROUTINE',
    status: 'CONFIRMED',
    prepInstructions: ['Bring previous prescription']
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Understanding Canine Parvovirus',
    summary: 'Essential information about symptoms, prevention, and treatment of this highly contagious virus. Learn how to protect your puppy.',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 24, 2023',
    category: 'Disease'
  },
  {
    id: 'n2',
    title: 'Balanced Nutrition for Senior Cats',
    summary: 'How to adjust your cat\'s diet as they age to support kidney function and joint health. Key ingredients to look for.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 20, 2023',
    category: 'Nutrition'
  },
  {
    id: 'n3',
    title: 'The Benefits of Daily Dog Walks',
    summary: 'Walking your dog is not just about exercise; it bonds you and provides mental stimulation that prevents behavioral issues.',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 18, 2023',
    category: 'Wellness'
  },
  {
    id: 'n4',
    title: 'Common Cat Allergies Explained',
    summary: 'Scratching? Sneezing? Your cat might be allergic to something in your home. We explore common environmental and food triggers.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 15, 2023',
    category: 'Disease'
  },
  {
    id: 'n5',
    title: 'The Ultimate Superfoods List for Parrots',
    summary: 'From kale to berries, discover nutrient-packed foods that boost immunity and plumage health. Plus, a comprehensive guide on toxic foods to avoid.',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 10, 2023',
    category: 'Nutrition'
  },
  {
    id: 'n6',
    title: 'Dental Hygiene for Pets',
    summary: 'Why brushing your pet\'s teeth is crucial for their overall health and longevity. Tips for starting a dental routine.',
    imageUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 05, 2023',
    category: 'Wellness'
  }
];