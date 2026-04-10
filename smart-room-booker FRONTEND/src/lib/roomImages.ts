// High-quality Unsplash meeting room images
export const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80',
  'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800&q=80',
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
  'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&q=80',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
  'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?w=800&q=80',
  'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
  'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80',
  'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80',
  'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&q=80',
];

export function getRoomImage(roomId: number, imageUrl?: string): string {
  if (imageUrl) return imageUrl;
  return ROOM_IMAGES[roomId % ROOM_IMAGES.length];
}

export function parseEquipment(equipment?: string): string[] {
  if (!equipment) return [];
  return equipment.split(',').map((e) => e.trim()).filter(Boolean);
}

export const MOCK_ROOMS = [
  { id: 1, name: 'Salle Atlas', capacity: 6, equipment: 'TV, WiFi, Tableau blanc', image: ROOM_IMAGES[0] },
  { id: 2, name: 'Salle Orion', capacity: 10, equipment: 'Projecteur, WiFi, Vidéoconférence', image: ROOM_IMAGES[1] },
  { id: 3, name: 'Salle Nova', capacity: 4, equipment: 'TV, WiFi', image: ROOM_IMAGES[2] },
  { id: 4, name: 'Salle Phoenix', capacity: 20, equipment: 'Projecteur, Micro, Sonorisation, WiFi', image: ROOM_IMAGES[3] },
  { id: 5, name: 'Salle Vega', capacity: 8, equipment: 'TV, WiFi, Tableau blanc, Vidéoconférence', image: ROOM_IMAGES[4] },
  { id: 6, name: 'Salle Helios', capacity: 12, equipment: 'Projecteur, WiFi, Tableau blanc', image: ROOM_IMAGES[5] },
  { id: 7, name: 'Salle Luna', capacity: 3, equipment: 'TV, WiFi', image: ROOM_IMAGES[6] },
  { id: 8, name: 'Salle Titan', capacity: 30, equipment: 'Projecteur, Micro, Sonorisation, WiFi, Vidéoconférence', image: ROOM_IMAGES[7] },
  { id: 9, name: 'Salle Cosmos', capacity: 6, equipment: 'TV, WiFi, Imprimante', image: ROOM_IMAGES[8] },
  { id: 10, name: 'Salle Eclipse', capacity: 15, equipment: 'Projecteur, WiFi, Tableau blanc, Micro', image: ROOM_IMAGES[9] },
  { id: 11, name: 'Salle Nebula', capacity: 5, equipment: 'TV, WiFi, Tableau blanc', image: ROOM_IMAGES[10] },
  { id: 12, name: 'Salle Jupiter', capacity: 25, equipment: 'Projecteur, Sonorisation, WiFi, Vidéoconférence', image: ROOM_IMAGES[11] },
  { id: 13, name: 'Salle Mercury', capacity: 4, equipment: 'TV, WiFi', image: ROOM_IMAGES[12] },
  { id: 14, name: 'Salle Saturn', capacity: 10, equipment: 'Projecteur, WiFi, Tableau blanc', image: ROOM_IMAGES[13] },
  { id: 15, name: 'Salle Andromeda', capacity: 18, equipment: 'Projecteur, Micro, WiFi, Vidéoconférence', image: ROOM_IMAGES[14] },
  { id: 16, name: 'Salle Polaris', capacity: 2, equipment: 'TV, WiFi', image: ROOM_IMAGES[15] },
  { id: 17, name: 'Salle Centauri', capacity: 8, equipment: 'TV, WiFi, Tableau blanc, Imprimante', image: ROOM_IMAGES[16] },
  { id: 18, name: 'Salle Sirius', capacity: 14, equipment: 'Projecteur, WiFi, Vidéoconférence, Tableau blanc', image: ROOM_IMAGES[17] },
  { id: 19, name: 'Salle Rigel', capacity: 6, equipment: 'TV, WiFi, Tableau blanc', image: ROOM_IMAGES[18] },
  { id: 20, name: 'Salle Altair', capacity: 22, equipment: 'Projecteur, Micro, Sonorisation, WiFi, Vidéoconférence, Tableau blanc', image: ROOM_IMAGES[19] },
];