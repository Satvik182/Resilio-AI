import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Resilio AI databases...");

  // 1. Seed Presets
  const presets = [
    {
      name: "Miami, FL",
      lat: 25.7617,
      lng: -80.1918,
      description: "Coastal metropolis vulnerable to flooding, sea-level rise, and hurricanes.",
      riskFactors: ["Hurricanes", "Storm Surge", "Urban Flooding"],
    },
    {
      name: "Seattle, WA",
      lat: 47.6062,
      lng: -122.3321,
      description: "Hilly city with high precipitation, prone to landslides, seismic activity, and winter storms.",
      riskFactors: ["Landslides", "Earthquakes", "Seismic Liquefaction"],
    },
    {
      name: "San Francisco, CA",
      lat: 37.7749,
      lng: -122.4194,
      description: "High-density urban area adjacent to active fault zones, prone to wildfires and earthquakes.",
      riskFactors: ["Wildfires", "Earthquakes", "Tsunami"],
    },
    {
      name: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503,
      description: "Pacific coast megacity prone to typhoons, seismic events, and volcanic ash fall.",
      riskFactors: ["Typhoons", "Earthquakes", "Tsunami"],
    },
  ];

  for (const preset of presets) {
    await prisma.locationPreset.upsert({
      where: { name: preset.name },
      update: preset,
      create: preset,
    });
  }
  console.log("Location presets seeded.");

  // 2. Seed Alerts
  await prisma.emergencyAlert.createMany({
    data: [
      {
        title: "Critical Flash Flood Warning",
        description: "Rapid rise in water levels along the Miami River. Immediate evacuation recommended.",
        severity: "critical",
        category: "Flood",
        locationName: "Miami (Downtown / Brickell)",
        lat: 25.768,
        lng: -80.194,
        active: true,
      },
      {
        title: "Wildfire Advisory - Containment Notice",
        description: "Marin County brush fire approaching northern San Francisco perimeter.",
        severity: "high",
        category: "Fire",
        locationName: "San Francisco (North Bay Border)",
        lat: 37.82,
        lng: -122.478,
        active: true,
      },
      {
        title: "Landslide Risk Warning",
        description: "Heavy rainfall has saturated hillsides in East Queen Anne. Soil slips detected.",
        severity: "medium",
        category: "Landslide",
        locationName: "Seattle (Queen Anne Slope)",
        lat: 47.635,
        lng: -122.348,
        active: true,
      },
    ],
  });
  console.log("Initial alerts seeded.");

  // 3. Seed Relief Camps
  await prisma.reliefCamp.createMany({
    data: [
      {
        name: "Miami Convention Center Shelter",
        address: "1901 Convention Center Dr, Miami Beach, FL 33139",
        lat: 25.794,
        lng: -80.134,
        capacity: 2500,
        occupancy: 1450,
        status: "open",
        waterSupply: "high",
        foodSupply: "high",
        medSupply: "medium",
        powerStatus: "stable",
        contact: "+1 (305) 555-0199",
      },
      {
        name: "Little Havana Community Hub",
        address: "900 SW 8th St, Miami, FL 33130",
        lat: 25.764,
        lng: -80.208,
        capacity: 1200,
        occupancy: 1100,
        status: "filling",
        waterSupply: "medium",
        foodSupply: "medium",
        medSupply: "low",
        powerStatus: "generator",
        contact: "+1 (305) 555-0123",
      },
    ],
  });
  console.log("Relief camps seeded.");
  console.log("Database seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
