
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

const videosData = [
    {
      id: "pelvic-tilts",
      title: "Back Pain Relief - Pelvic Tilts",
      category: "Back Pain Relief",
      description: "Gentle pelvic tilt exercise to reduce lower back stiffness and improve posture.",
      youtubeId: "z915K14nL8s"
    },
    {
      id: "cat-cow-stretch",
      title: "Core Strengthening - Cat-Cow",
      category: "Back Pain Relief",
      description: "A classic yoga pose to increase spinal flexibility and relieve back tension.",
      youtubeId: "z915K14nL8s"
    },
    {
      id: "neck-mobility",
      title: "Neck Mobility Stretches",
      category: "Neck & Shoulder Pain",
      description: "Improve range of motion and decrease stiffness in your neck and upper shoulders.",
      youtubeId: "z915K14nL8s"
    },
    {
      id: "quad-sets",
      title: "Knee Pain - Quadriceps Strengthening",
      category: "Knee Pain & Arthritis",
      description: "Simple but effective exercise to activate and strengthen the quad muscles without stressing the knee joint.",
      youtubeId: "z915K14nL8s"
    },
    {
      id: "piriformis-stretch",
      title: "Sciatica Relief - Piriformis Stretch",
      category: "Sciatica & Leg Pain",
      description: "This stretch targets the piriformis muscle to relieve pressure on the sciatic nerve.",
      youtubeId: "z915K14nL8s"
    },
    {
      id: "chin-tucks",
      title: "Improve Your Posture - Chin Tucks",
      category: "Posture Correction",
      description: "A fundamental exercise to correct forward head posture and strengthen neck muscles.",
      youtubeId: "z915K14nL8s"
    },
    {
      id: "ankle-balance",
      title: "Ankle Injury Recovery - Balance Drills",
      category: "Sports Injury Recovery",
      description: "Rebuild stability and proprioception in your ankle after a sprain or injury.",
      youtubeId: "z915K14nL8s"
    },
    {
      id: "chair-squats",
      title: "Mobility for Seniors - Chair Squats",
      category: "Elderly Mobility & Balance",
      description: "A safe way to build leg strength and improve balance, using a chair for support.",
      youtubeId: "z915K14nL8s"
    }
];

export async function seedTreatments() {
  const treatmentsCollection = collection(db, 'treatments');
  
  // This check is removed to allow overwriting existing data.
  // const snapshot = await getDocs(treatmentsCollection);
  // if (!snapshot.empty) {
  //   console.log('Treatments collection is not empty. Skipping seed.');
  //   return;
  // }

  const batch = writeBatch(db);
  treatmentsData.forEach((treatment) => {
    const { id, ...data } = treatment;
    const docRef = doc(db, "treatments", id);
    batch.set(docRef, data);
  });

  await batch.commit();
  console.log('Successfully seeded treatments collection.');
}


export async function seedVideos() {
  const videosCollection = collection(db, 'videos');
  
  const snapshot = await getDocs(videosCollection);
  if (!snapshot.empty) {
    console.log('Videos collection is not empty. Skipping seed.');
    return;
  }

  const batch = writeBatch(db);
  videosData.forEach((video) => {
    const { id, ...data } = video;
    const docRef = doc(db, "videos", id);
    batch.set(docRef, data);
  });

  await batch.commit();
  console.log('Successfully seeded videos collection.');
}
