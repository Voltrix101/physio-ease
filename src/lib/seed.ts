
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { db } from './firebase';

const treatmentsData = [
  {
    id: "manual-therapy",
    name: "Manual Therapy",
    description: "Hands-on techniques including joint mobilization, manipulation, and soft tissue massage to reduce pain and improve mobility.",
    price: 500,
    duration: 30,
    imageUrl: "https://images.unsplash.com/photo-1599447462463-0599a37a67a8?q=80&w=1470&auto=format&fit=crop",
    dataAiHint: "physiotherapy manual therapy"
  },
  {
    id: "exercise-therapy",
    name: "Exercise Therapy",
    description: "Customized strengthening, stretching, and balance exercises to restore movement and prevent injuries.",
    price: 400,
    duration: 45,
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
    dataAiHint: "physiotherapy exercise training"
  },
  {
    id: "electrotherapy",
    name: "Electrotherapy (TENS/IFT)",
    description: "Uses mild electrical currents to relieve pain, reduce inflammation, and stimulate healing.",
    price: 600,
    duration: 20,
    imageUrl: "https://images.unsplash.com/photo-1629822442426-003a71f05796?q=80&w=1470&auto=format&fit=crop",
    dataAiHint: "physiotherapy electrotherapy"
  },
  {
    id: "ultrasound-therapy",
    name: "Ultrasound Therapy",
    description: "High-frequency sound waves to reduce pain, improve blood flow, and accelerate tissue healing.",
    price: 500,
    duration: 20,
    imageUrl: "https://images.unsplash.com/photo-1605793520092-231584161b4a?q=80&w=1471&auto=format&fit=crop",
    dataAiHint: "physiotherapy ultrasound therapy"
  },
  {
    id: "heat-cold-therapy",
    name: "Heat & Cold Therapy",
    description: "Use of hot/cold packs to reduce inflammation, relax muscles, and relieve pain.",
    price: 300,
    duration: 15,
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba9996a?q=80&w=1470&auto=format&fit=crop",
    dataAiHint: "physiotherapy hot cold therapy"
  },
  {
    id: "kinesio-taping",
    name: "Kinesio Taping",
    description: "Elastic therapeutic tape applied to muscles and joints to provide support, reduce pain, and enhance movement.",
    price: 400,
    duration: 20,
    imageUrl: "https://images.unsplash.com/photo-1616886847038-1a2933735a11?q=80&w=1470&auto=format&fit=crop",
    dataAiHint: "physiotherapy kinesio taping"
  },
  {
    id: "traction-therapy",
    name: "Traction Therapy",
    description: "Spinal traction techniques to relieve pressure on spinal discs and nerves, especially for back and neck pain.",
    price: 700,
    duration: 30,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop",
    dataAiHint: "physiotherapy traction therapy"
  },
  {
    id: "dry-needling",
    name: "Dry Needling / Acupuncture",
    description: "Fine needles inserted into trigger points to relieve muscle tightness and reduce pain.",
    price: 800,
    duration: 25,
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1587&auto=format&fit=crop",
    dataAiHint: "physiotherapy dry needling acupuncture"
  },
  {
    id: "neurological-rehab",
    name: "Neurological Rehabilitation",
    description: "Specialized exercises for stroke, spinal cord injury, and neurological conditions to restore movement and independence.",
    price: 900,
    duration: 45,
    imageUrl: "https://images.unsplash.com/photo-1581092921532-7227429d35a8?q=80&w=1470&auto=format&fit=crop",
    dataAiHint: "physiotherapy neurological rehab"
  }
];

const categoriesData = [
    { id: 'back-pain', name: 'Back & Spine Care', icon: '🦴', description: 'Exercises for reducing back pain and improving spine stability.' },
    { id: 'knee-pain', name: 'Knee Pain Relief', icon: '🦵', description: 'Exercises for reducing knee pain and improving stability.' },
    { id: 'neck-shoulder', name: 'Neck & Shoulder', icon: '🤷', description: 'Stretches and exercises for neck and shoulder pain.' },
    { id: 'sports-injury', name: 'Sports Injury', icon: '🏃', description: 'Rehabilitation exercises for common sports injuries.' },
    { id: 'elderly-mobility', name: 'Elderly Mobility', icon: '👵', description: 'Gentle exercises to improve balance and mobility for seniors.' },
    { id: 'posture-correction', name: 'Posture Correction', icon: '🧘', description: 'Exercises to correct posture and strengthen core muscles.' }
];

const videosData = [
    // Back Pain
    { youtubeId: 'z915K14nL8s', title: 'Cat-Cow Stretch', categoryId: 'back-pain', duration: '2:15', tags: ['back', 'spine', 'flexibility'], description: 'A gentle stretch to improve spine mobility and relieve tension.' },
    { youtubeId: 'z915K14nL8s', title: 'Pelvic Tilts', categoryId: 'back-pain', duration: '3:05', tags: ['back', 'core', 'stability'], description: 'Strengthens core muscles and helps stabilize the lower back.' },
    // Knee Pain
    { youtubeId: 'z915K14nL8s', title: 'Isometric Quads', categoryId: 'knee-pain', duration: '3:42', tags: ['knee', 'rehab', 'strength'], description: 'Activates the quadriceps muscles without moving the knee joint.' },
    { youtubeId: 'z915K14nL8s', title: 'Straight Leg Raises', categoryId: 'knee-pain', duration: '4:10', tags: ['knee', 'strength'], description: 'Builds strength in the quads to better support the knee.' },
    // Neck & Shoulder
    { youtubeId: 'z915K14nL8s', title: 'Neck Mobility Stretches', categoryId: 'neck-shoulder', duration: '5:00', tags: ['neck', 'shoulder', 'stretch'], description: 'Increases range of motion and reduces stiffness in the neck and shoulders.' },
];

export async function seedTreatments() {
  const treatmentsCollection = collection(db, 'treatments');
  const batch = writeBatch(db);
  treatmentsData.forEach((treatment) => {
    const { id, ...data } = treatment;
    const docRef = doc(db, "treatments", id);
    batch.set(docRef, data);
  });
  await batch.commit();
  console.log('Successfully seeded treatments collection.');
}

export async function seedVideosAndCategories() {
  const categoriesCollection = collection(db, 'categories');
  const videosCollection = collection(db, 'videos');
  
  const catSnapshot = await getDocs(categoriesCollection);
  if (!catSnapshot.empty) {
    console.log('Collections are not empty. Skipping seed.');
    return;
  }

  const batch = writeBatch(db);
  
  categoriesData.forEach((category) => {
    const docRef = doc(categoriesCollection, category.id);
    batch.set(docRef, category);
  });
  
  videosData.forEach((video) => {
    const docRef = doc(videosCollection); // auto-generate ID
    const enrichedVideo = {
        ...video,
        url: `https://www.youtube.com/embed/${video.youtubeId}`,
        thumbnail: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
    }
    batch.set(docRef, enrichedVideo);
  });

  await batch.commit();
  console.log('Successfully seeded videos and categories collections.');
}
